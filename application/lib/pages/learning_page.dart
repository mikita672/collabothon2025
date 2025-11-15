import 'package:application/pages/certificate_page.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:application/widgets/learning/learning_materials_list.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:application/theme/app_buttons.dart';

class LearningPage extends StatefulWidget {
  const LearningPage({super.key});

  @override
  State<LearningPage> createState() => _LearningPageState();
}

class _LearningPageState extends State<LearningPage> {
  List<String> completedQuizzes = [];
  late LearningMaterialsList learningList;

  @override
  void initState() {
    super.initState();
    learningList = LearningMaterialsList();
    _loadCompleted();
  }

  Future<void> _loadCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    final completed = prefs.getStringList('completedQuizzes') ?? [];
    setState(() {
      completedQuizzes = completed;
    });
  }

  @override
  Widget build(BuildContext context) {
    final allQuizzes = learningList.materials
        .where((m) => (m['quiz'] as List).isNotEmpty)
        .map((m) => m['title'] as String)
        .toList();
    final total = allQuizzes.length;
    final done = completedQuizzes.where((t) => allQuizzes.contains(t)).length;
    final allDone = done == total;

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
        child: Column(
          children: [
            CustomCard(
              child: LearningMaterialsList(onQuizCompleted: _loadCompleted),
            ),
            const SizedBox(height: 24),
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  "$done/$total quizzes completed",
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: AppButtons.primary(),
                    onPressed: allDone
                        ? () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => const CertificatePage(),
                              ),
                            );
                          }
                        : null,
                    child: const Text("Get Certificate"),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
