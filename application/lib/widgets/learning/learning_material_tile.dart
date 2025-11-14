import 'package:flutter/material.dart';

class LearningMaterialTile extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color iconColor;
  final Color color; 
  final List<Map<String, String>> sections;

  const LearningMaterialTile({
    super.key,
    required this.title,
    required this.icon,
    required this.sections,
    this.iconColor = Colors.blue,
    this.color = Colors.white, 
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color, 
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          leading: Icon(icon, size: 30, color: iconColor),
          title: Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
          childrenPadding: EdgeInsets.zero,
          tilePadding: EdgeInsets.symmetric(horizontal: 16),
          children: sections.map((section) {
            return Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    section['subtitle']!,
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(section['content']!),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
