import 'package:application/theme/app_colors.dart';
import 'package:flutter/material.dart';

class AppButtons {
  // PRIMARY BUTTON
  static ButtonStyle primary({
    double radius = 30,
    Color background = AppColors.primary,
    Color textColor = Colors.white,
    EdgeInsets padding = const EdgeInsets.symmetric(vertical: 16),
  }) {
    return ElevatedButton.styleFrom(
      backgroundColor: background,
      foregroundColor: textColor, 
      padding: padding,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }

  static ButtonStyle outline({
    double radius = 30,
    Color borderColor = AppColors.primary,
    Color textColor = AppColors.primary,
    double borderWidth = 2,
    EdgeInsets padding = const EdgeInsets.symmetric(vertical: 16),
  }) {
    return OutlinedButton.styleFrom(
      padding: padding,
      side: BorderSide(color: borderColor, width: borderWidth),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius),
      ),
      foregroundColor: textColor, 
    );
  }

  // TEXT BUTTON
  static ButtonStyle text({
    Color textColor = AppColors.primary,
    double fontSize = 16,
  }) {
    return TextButton.styleFrom(
      foregroundColor: textColor, 
      textStyle: TextStyle(fontSize: fontSize),
    );
  }
}
