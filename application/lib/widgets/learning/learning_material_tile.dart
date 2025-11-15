import 'package:flutter/material.dart';

class LearningMaterialTile extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color iconColor;
  final Color color; 
  final List<Map<String, String>> sections;

  final double iconSize;
  final double titleFontSize;
  final double sectionTitleSize;
  final double sectionContentSize;
  final double verticalPadding;
  final double horizontalPadding;

  const LearningMaterialTile({
    super.key,
    required this.title,
    required this.icon,
    required this.sections,
    this.iconColor = Colors.blue,
    this.color = Colors.white, 
    this.iconSize = 30,
    this.titleFontSize = 16,
    this.sectionTitleSize = 16,
    this.sectionContentSize = 14,
    this.verticalPadding = 8,
    this.horizontalPadding = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color, 
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          leading: Icon(icon, size: iconSize, color: iconColor),
          title: Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: titleFontSize)),
          childrenPadding: EdgeInsets.zero,
          tilePadding: EdgeInsets.symmetric(horizontal: horizontalPadding),
          children: sections.map((section) {
            return Padding(
              padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    section['subtitle']!,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: sectionTitleSize),
                  ),
                  SizedBox(height: 6),
                  Text(section['content']!, style: TextStyle(fontSize: sectionContentSize)),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
