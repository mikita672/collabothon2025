import 'package:application/widgets/common/custom_card.dart';
import 'package:application/widgets/learning/learning_materials_list.dart';
import 'package:flutter/material.dart';

class LearningPage extends StatelessWidget {
  const LearningPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
        child: CustomCard(child: LearningMaterialsList()),
      ),
    );
  }
}