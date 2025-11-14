import 'package:flutter/material.dart';
import 'package:application/theme/app_colors.dart';

class InputDecorations {
  static InputDecoration roundedOutline({
    String? hintText,
    Color borderColor = AppColors.primary,
    double borderRadius = 15.0,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: TextStyle(
        fontSize: 20,
        color: const Color.fromARGB(131, 0, 0, 0),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(borderRadius),
        borderSide: BorderSide(color: borderColor, width: 1.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(borderRadius),
        borderSide: BorderSide(color: borderColor, width: 2),
      ),
      filled: true,
      fillColor: const Color.fromARGB(255, 255, 255, 255),
      suffixIcon: suffixIcon != null
          ? Padding(
              padding: const EdgeInsets.only(right: 12.0),
              child: suffixIcon,
            )
          : null,
    );
  }
}
