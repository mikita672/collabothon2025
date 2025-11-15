import 'package:application/theme/app_buttons.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class QuizPage extends StatefulWidget {
  final String title;
  final List<Map<String, dynamic>> questions;
  final VoidCallback? onQuizCompleted;

  const QuizPage({
    super.key,
    required this.title,
    required this.questions,
    this.onQuizCompleted,
  });

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  int currentQuestion = 0;
  Map<int, String?> selectedAnswers = {};

  void _nextQuestion() async {
    if (currentQuestion < widget.questions.length - 1) {
      setState(() => currentQuestion++);
    } else {
      int score = 0;
      for (int i = 0; i < widget.questions.length; i++) {
        if (selectedAnswers[i] == widget.questions[i]['answer']) score++;
      }

      await markQuizCompleted(widget.title);
      widget.onQuizCompleted?.call();

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 20,
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Quiz Completed",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                "You got $score/${widget.questions.length} correct!",
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      style: AppButtons.primary(),
                      onPressed: () {
                        Navigator.pop(context); // close dialog
                        Navigator.pop(context); // go back from quiz page
                      },
                      child: const Text(
                        "Close",
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      style: AppButtons.primary(),
                      onPressed: () {
                        Navigator.pop(context); // close dialog
                        setState(() {
                          currentQuestion = 0;
                          selectedAnswers.clear(); // reset answers
                        });
                      },
                      child: const Text(
                        "Retry",
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
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

  Future<void> markQuizCompleted(String quizTitle) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> completed = prefs.getStringList('completedQuizzes') ?? [];
    if (!completed.contains(quizTitle)) {
      completed.add(quizTitle);
      await prefs.setStringList('completedQuizzes', completed);
    }
  }

  Future<bool> isQuizCompleted(String quizTitle) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> completed = prefs.getStringList('completedQuizzes') ?? [];
    return completed.contains(quizTitle);
  }

  Future<bool> areAllQuizzesCompleted(List<String> allTitles) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> completed = prefs.getStringList('completedQuizzes') ?? [];
    return allTitles.every((title) => completed.contains(title));
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    final q = widget.questions[currentQuestion];
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              LinearProgressIndicator(
                value: (currentQuestion + 1) / widget.questions.length,
                minHeight: 8,
                color: AppColors.primary,
                backgroundColor: Colors.grey[300],
              ),
              const SizedBox(height: 16),
              CustomCard(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Question ${currentQuestion + 1}/${widget.questions.length}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(q['question'], style: const TextStyle(fontSize: 17)),
                      const SizedBox(height: 12),
                      ...List.generate((q['options'] as List<String>).length, (
                        index,
                      ) {
                        final option = (q['options'] as List<String>)[index];
                        return Container(
                          margin: const EdgeInsets.symmetric(vertical: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(25),
                            border: Border.all(
                              color: selectedAnswers[currentQuestion] == option
                                  ? AppColors.primary
                                  : Colors.grey[300]!,
                            ),
                          ),
                          child: RadioListTile<String>(
                            title: Text(option),
                            value: option,
                            groupValue: selectedAnswers[currentQuestion],
                            activeColor: AppColors.primary,
                            onChanged: (value) {
                              setState(() {
                                selectedAnswers[currentQuestion] = value;
                              });
                            },
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ),
              SizedBox(height: screenHeight * 0.05),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Center(
                  child: Image.asset(
                    "assets/images/commerzbank_logo.png",
                    width: screenWidth * 0.4,
                    height: screenWidth * 0.4,
                  ),
                ),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: AppButtons.primary(),
                  onPressed: selectedAnswers[currentQuestion] == null
                      ? null
                      : _nextQuestion,
                  child: Text(
                    currentQuestion < widget.questions.length - 1
                        ? "Next"
                        : "Submit",
                    style: const TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
