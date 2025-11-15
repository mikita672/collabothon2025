import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';

class CurrentBalanceCard extends StatelessWidget {
  final double balance;
  final double screenWidth;

  const CurrentBalanceCard({
    super.key,
    required this.balance,
    required this.screenWidth,
  });

  @override
  Widget build(BuildContext context) {
    return Flexible(
      flex: 0,
      child: CustomCard(
        width: screenWidth * 0.3,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Current \nBalance',
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
    '$balance€',
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
    );
  }
}
