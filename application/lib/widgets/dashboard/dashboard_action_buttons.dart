import 'package:application/controllers/dashboard_controller.dart';
import 'package:flutter/material.dart';
import 'package:application/theme/app_buttons.dart';
import 'package:application/theme/app_colors.dart';

class DashboardActionButtons extends StatelessWidget {
  final double screenWidth;
  final double screenHeight;
  final DashboardController dashboardController;

  const DashboardActionButtons({
    required this.screenWidth,
    required this.screenHeight,
    required this.dashboardController,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SizedBox(
          width: screenWidth * 0.3,
          child: ElevatedButton(
            onPressed: () {
              dashboardController.showFundsDialog(isAdd: false);
            },
            style: AppButtons.primary(
              radius: 15,
              padding: EdgeInsets.symmetric(vertical: screenHeight * 0.012),
            ),
            child: Text(
              "Withdraw",
              style: TextStyle(
                fontSize: screenWidth * 0.05,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        SizedBox(
          width: screenWidth * 0.3,
          child: ElevatedButton(
            onPressed: () {
              dashboardController.showFundsDialog(isAdd: true);
            },
            style: AppButtons.primary(
              background: AppColors.accent,
              textColor: AppColors.primary,
              radius: 15,
              padding: EdgeInsets.symmetric(vertical: screenHeight * 0.012),
            ),
            child: Text(
              "Add Funds",
              style: TextStyle(
                fontSize: screenWidth * 0.05,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        SizedBox(
          width: screenWidth * 0.25,
          child: ElevatedButton(
            onPressed: () {},
            style: AppButtons.outline(
              textColor: AppColors.primary,
              radius: 15,
              padding: EdgeInsets.symmetric(vertical: screenHeight * 0.012),
            ),
            child: Text(
              "More",
              style: TextStyle(
                fontSize: screenWidth * 0.05,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
