import 'dart:async';
import 'dart:math';
import 'package:application/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class ChartGrowthCard extends StatefulWidget {
  final double width;
  final double height;
  final String symbol;
  final List<double> series;
  final Function(String trend) onTrendChange;

  const ChartGrowthCard({
    super.key,
    required this.width,
    required this.height,
    required this.symbol,
    required this.series,
    required this.onTrendChange,
  });

  @override
  State<ChartGrowthCard> createState() => ChartGrowthCardState();
}

class ChartGrowthCardState extends State<ChartGrowthCard> {
  late List<double> series;
  int visiblePoints = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    series = widget.series;
    _startInitialGrowth();
  }

  void _startInitialGrowth() {
    _timer?.cancel();
    visiblePoints = 0;
    _timer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (visiblePoints < series.length) {
        setState(() => visiblePoints++);
      } else {
        timer.cancel();
      }
    });
  }

  void replaceFuturePoints(List<double> newSeries) {
    _timer?.cancel();

    final pastPoints = series.take(visiblePoints).toList();
    series = [...pastPoints, ...newSeries];

    _timer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (visiblePoints < series.length) {
        setState(() => visiblePoints++);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (visiblePoints == 0) {
      return SizedBox(width: widget.width, height: widget.height);
    }

    final visibleList = List.generate(
      visiblePoints,
      (i) => FlSpot(i.toDouble(), series[i]),
    );

    final minY = visibleList.map((e) => e.y).reduce(min) - 5;
    final maxY = visibleList.map((e) => e.y).reduce(max) + 5;

    return Card(
      elevation: 2,
      color: Colors.white,
      child: SizedBox(
        width: widget.width,
        height: widget.height,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          child: LineChart(
            LineChartData(
              minX: 0,
              maxX: series.length - 1.toDouble(),
              minY: minY,
              maxY: maxY,

              clipData: FlClipData.all(),
              gridData: FlGridData(show: false),
              borderData: FlBorderData(show: false),

              titlesData: FlTitlesData(
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 40,
                    getTitlesWidget: (value, meta) {
                      return Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "${value.toStringAsFixed(0)}€",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                      );
                    },
                  ),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 28,
                    interval: max(1, series.length ~/ 6).toDouble(),
                    getTitlesWidget: (value, meta) {
                      final totalMinutes = 6 * 60 + 30;
                      final fraction = value / (series.length - 1);
                      final minutesFromStart = (fraction * totalMinutes)
                          .round();

                      final hour = 9 + ((30 + minutesFromStart) ~/ 60);
                      final minute = (30 + minutesFromStart) % 60;

                      final label =
                          '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';

                      return Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            label,
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),

                rightTitles: AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                topTitles: AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
              ),

              lineTouchData: LineTouchData(
                enabled: true,
                touchTooltipData: LineTouchTooltipData(
                  tooltipPadding: const EdgeInsets.all(8),
                  fitInsideHorizontally: true,
                  fitInsideVertically: true,
                  getTooltipItems: (spots) {
                    return spots.map((s) {
                      return LineTooltipItem(
                        '${s.y.toStringAsFixed(2)}',
                        const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      );
                    }).toList();
                  },
                ),
              ),

              lineBarsData: [
                LineChartBarData(
                  spots: visibleList,
                  isCurved: true,
                  barWidth: 2.3,
                  color: AppColors.primary,
                  dotData: const FlDotData(show: false),
                  shadow: Shadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ),
              ],
              
            ),
          ),
        ),
      ),
    );
  }
}
