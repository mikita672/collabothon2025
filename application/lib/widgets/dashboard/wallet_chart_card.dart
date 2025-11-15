import 'dart:async';
import 'dart:math';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:application/theme/app_colors.dart';

class WalletChartCard extends StatefulWidget {
  final double screenWidth;
  final double screenHeight;

  const WalletChartCard({
    required this.screenWidth,
    required this.screenHeight,
    super.key,
  });

  @override
  State<WalletChartCard> createState() => _WalletChartCardState();
}

class _WalletChartCardState extends State<WalletChartCard> {
  final List<FlSpot> _points = [];
  Timer? _timer;
  double _currentValue = 8;
  int _timeIndex = 0;
  final Random _random = Random();

  static const int visibleRange = 30;

  @override
  void initState() {
    super.initState();

    _initializeStartingPoints();

    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _addNextPoint());
  }

  void _initializeStartingPoints() {
    const int initialPoints = visibleRange;

    for (int i = 0; i < initialPoints; i++) {
      double change = (_random.nextDouble() * 0.6) - 0.3;
      double trend = (_random.nextDouble() * 0.1) - 0.05;

      _currentValue += change + trend;

      if (_currentValue < 0) _currentValue = 0;
      if (_currentValue > 20) _currentValue = 20;

      _points.add(FlSpot(i.toDouble(), _currentValue));
      _timeIndex = i;
    }
  }

  void _addNextPoint() {
    setState(() {
      _timeIndex++;
      double change = (_random.nextDouble() * 0.6) - 0.3;
      double trend = (_random.nextDouble() * 0.1) - 0.05;

      _currentValue += change + trend;

      if (_currentValue < 0) _currentValue = 0;
      if (_currentValue > 20) _currentValue = 20;

      _points.add(FlSpot(_timeIndex.toDouble(), _currentValue));
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double minX = (_timeIndex - visibleRange).toDouble();
    if (minX < 0) minX = 0;

    double maxX = _timeIndex.toDouble();

    return CustomCard(
      width: double.infinity,
      child: Column(
        children: [
          SizedBox(
            height: widget.screenHeight * 0.2,
            child: LineChart(
              LineChartData(
                minX: minX,
                maxX: maxX,
                minY: _points.map((e) => e.y).reduce(min) - 1,
                maxY: _points.map((e) => e.y).reduce(max) + 1,
                clipData: FlClipData.all(),

                gridData: FlGridData(show: false),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(show: false),

                lineTouchData: LineTouchData(enabled: false),

                lineBarsData: [
                  LineChartBarData(
                    shadow: Shadow(),
                    spots: _points,
                    isCurved: true,
                    preventCurveOverShooting: true,
                    barWidth: 3,
                    dotData: const FlDotData(show: false),
                    color: AppColors.primary,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
