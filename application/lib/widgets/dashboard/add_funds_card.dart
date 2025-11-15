import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:application/theme/app_buttons.dart';
import 'package:application/theme/app_colors.dart';

class AddFundsCard extends StatelessWidget {
  final double screenWidth;
  final double screenHeight;
  final VoidCallback onAddFunds;

  const AddFundsCard({
    required this.screenWidth,
    required this.screenHeight,
    required this.onAddFunds,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      width: double.infinity,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Icon(LucideIcons.wallet, size: screenWidth * 0.1, color: Colors.grey,),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Start Your Investment Journey',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: screenWidth * 0.043,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Add funds to your account and let our AI bot start investing based on your risk tolerance',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: screenWidth * 0.04,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
          Padding(
            padding: EdgeInsets.symmetric(vertical: screenHeight * 0.02),
            child: SizedBox(
              width: screenWidth * 0.4,
              child: ElevatedButton(
                onPressed: onAddFunds,
                style: AppButtons.primary(
                  background: AppColors.accent,
                  textColor: AppColors.primary,
                  radius: 15,
                  padding: EdgeInsets.symmetric(vertical: screenHeight * 0.01),
                ),
                child: Text(
                  "Add Funds Now",
                  style: TextStyle(
                    fontSize: screenWidth * 0.045,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
