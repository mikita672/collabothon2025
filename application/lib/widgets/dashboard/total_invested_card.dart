import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';

class TotalInvestedCard extends StatelessWidget {
  final double invested;
  final double screenWidth;

  const TotalInvestedCard({
    super.key,
    required this.invested,
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
                'Total \nInvested',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: screenWidth * 0.05,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.left,
              ),
              const Spacer(),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  '$invested€',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: screenWidth * 0.07,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.left,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
