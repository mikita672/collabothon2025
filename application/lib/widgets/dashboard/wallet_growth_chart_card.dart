import 'dart:async';
import 'dart:math';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:application/theme/app_colors.dart';

class WalletChartGrowthCard extends StatefulWidget {
  final double screenWidth;
  final double screenHeight;

  const WalletChartGrowthCard({
    required this.screenWidth,
    required this.screenHeight,
    super.key,
  });

  @override
  State<WalletChartGrowthCard> createState() => _WalletChartGrowthCardState();
}

class _WalletChartGrowthCardState extends State<WalletChartGrowthCard> {
  final List<FlSpot> _allPoints = [];
  int _visiblePoints = 0;
  Timer? _timer;
  final Random _random = Random();

  static const int totalPoints = 50;
  static const int updateIntervalSeconds = 1;

  @override
  void initState() {
    super.initState();
    _generateDayPoints();
    _startChartGrowth();
  }

  void _generateDayPoints() {
    double value = 8;
    for (int i = 0; i < totalPoints; i++) {
      double change = (_random.nextDouble() * 0.8) - 0.4;
      value += change;
      value = value.clamp(0, 20);
      _allPoints.add(FlSpot(i.toDouble(), value));
    }
  }

  void _startChartGrowth() {
    _timer = Timer.periodic(const Duration(seconds: updateIntervalSeconds), (_) {
      setState(() {
        if (_visiblePoints < _allPoints.length) {
          _visiblePoints++;
        } else {
          _timer?.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_visiblePoints == 0) return const SizedBox();

    final visibleList = _allPoints.take(_visiblePoints).toList();
    final minY = visibleList.map((e) => e.y).reduce(min);
    final maxY = visibleList.map((e) => e.y).reduce(max);

    return CustomCard(
      width: double.infinity,
      child: SizedBox(
        height: widget.screenHeight * 0.25,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: LineChart(
            LineChartData(
              minX: 0,
              maxX: totalPoints - 1.toDouble(),
              minY: minY - 1,
              maxY: maxY + 1,
              clipData: FlClipData.all(),

              titlesData: FlTitlesData(
  leftTitles: AxisTitles(
    sideTitles: SideTitles(
      showTitles: true,
      reservedSize: 40, 
      interval: 2,
      getTitlesWidget: (value, meta) {
        return Align(
          alignment: Alignment.centerLeft,
          child: Text(
            '${value.toStringAsFixed(2)} €',
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
                    interval: ((totalPoints - 1) / 4),
                    getTitlesWidget: (value, meta) {
                      // Compute proportional time between 08:00 and 17:00
                      final totalMinutes = 9 * 60;
                      final minutesAtPoint =
                          ((value / (totalPoints - 1)) * totalMinutes).round();
                      final hour = 8 + (minutesAtPoint ~/ 60);
                      final minute = minutesAtPoint % 60;

                      return Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}',
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 12),
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

              gridData: FlGridData(show: false),
              borderData: FlBorderData(show: false),

              lineTouchData: LineTouchData(
                enabled: true,
                touchTooltipData: LineTouchTooltipData(
                  tooltipPadding: const EdgeInsets.all(8),
                  getTooltipItems: (touchedSpots) {
                    return touchedSpots.map((spot) {
                      return LineTooltipItem(
                        '${spot.y.toStringAsFixed(2)} €',
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
                  shadow: const Shadow(),
                  spots: visibleList,
                  isCurved: true,
                  barWidth: 2.3,
                  dotData: const FlDotData(show: false),
                  color: AppColors.primary,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
