import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  final Widget? child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final Color color;
  final Color borderColor;
  final double borderWidth;

  const CustomCard({
    Key? key,
    this.child,
    this.width,
    this.height,
    this.padding = const EdgeInsets.all(8),
    this.borderRadius = 16,
    this.color = Colors.white,
    this.borderColor = const Color.fromARGB(255, 230, 230, 230),
    this.borderWidth = 1,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: borderColor,
          width: borderWidth,
        ),
      ),
      child: child,
    );
  }
}
