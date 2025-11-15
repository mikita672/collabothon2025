import 'package:flutter/material.dart';
import 'news_tile.dart';

class NewsList extends StatelessWidget {
  const NewsList({super.key});

  final List<Map<String, dynamic>> mockNews = const [
    {
      "id": "1",
      "title": "Stock XYZ jumps 5% on strong earnings",
      "timestamp": "2025-11-15T12:00:00Z",
      "priceImpact": 5.0,
    },
    {
      "id": "2",
      "title": "Global markets see downturn after rate hike",
      "timestamp": "2025-11-14T09:30:00Z",
      "priceImpact": -2.4,
    },
    {
      "id": "3",
      "title": "Tech sector shows neutral movement today",
      "timestamp": "2025-11-13T15:45:00Z",
      "priceImpact": 0.0,
    },
  ];

  String formatDate(String iso) {
    final date = DateTime.parse(iso);
    return "${date.day.toString().padLeft(2, '0')}"
           ".${date.month.toString().padLeft(2, '0')}"
           ".${date.year}";
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,  // <-- important
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 12),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            "Financial Market News",
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 28,
                ),
          ),
        ),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Text(
            "Latest news and their potential impact on your investments",
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[700],
                  fontSize: 18,
                ),
          ),
        ),

        const SizedBox(height: 12),

        ListView.separated(
          shrinkWrap: true,                    // <-- makes it compact
          physics: const NeverScrollableScrollPhysics(),  // <-- avoids scroll conflict
          itemCount: mockNews.length,
          separatorBuilder: (_, __) =>
              Divider(height: 1, color: Colors.grey[300]),
          itemBuilder: (context, index) {
            final item = mockNews[index];
            return NewsTile(
              title: item["title"],
              date: formatDate(item["timestamp"]),
              priceImpact: item["priceImpact"],
            );
          },
        ),
      ],
    );
  }
}
