import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

class NewsTile extends StatelessWidget {
  final String title;
  final String date; // incoming date string
  final double priceImpact;

  const NewsTile({
    super.key,
    required this.title,
    required this.date,
    required this.priceImpact,
  });

  String formatDate(String raw) {
    try {
      final parsed = DateTime.parse(raw);
      return DateFormat("d MMMM yyyy").format(parsed);
    } catch (e) {
      return raw; 
    }
  }

  // Sentiment color
  Color getSentimentColor() {
    if (priceImpact > 0) return Colors.green;
    if (priceImpact < 0) return Colors.red;
    return Colors.grey;
  }

  // Sentiment label
  String getSentimentLabel() {
    if (priceImpact > 0) return "Positive";
    if (priceImpact < 0) return "Negative";
    return "Neutral";
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            // CONTENT
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    formatDate(date),
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                ],
              ),
            ),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: getSentimentColor().withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                getSentimentLabel(),
                style: TextStyle(
                  color: getSentimentColor(),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(width: 16),

            const Icon(
              LucideIcons.chevronRight,
              size: 22,
              color: Colors.black54,
            ),
          ],
        ),
      ),
    );
  }
}
