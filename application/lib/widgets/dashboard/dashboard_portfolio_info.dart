import 'package:flutter/material.dart';
import 'package:application/theme/app_colors.dart';

class DashboardPortfolioInfo extends StatelessWidget {
  const DashboardPortfolioInfo({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Portfolio Performance Over Time',
            style: TextStyle(
              color: AppColors.primary,
              fontSize: screenWidth * 0.05,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Your investment growth tracked daily',
            style: TextStyle(
              color: Colors.black,
              fontSize: screenWidth * 0.04,
            ),
          ),
        ],
      ),
    );
  }
}
