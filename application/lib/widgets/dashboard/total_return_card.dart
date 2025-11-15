import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';

class TotalReturnCard extends StatelessWidget {
  final double totalReturn;
  final double screenWidth;

  const TotalReturnCard({
    super.key,
    required this.totalReturn,
    required this.screenWidth,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: CustomCard(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            children: [
              Text(
                'Total \nReturn',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: screenWidth * 0.05,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.left,
              ),
              const Spacer(),
              Text(
                '${totalReturn.toStringAsFixed(2)}€',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: screenWidth * 0.07,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.left,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
