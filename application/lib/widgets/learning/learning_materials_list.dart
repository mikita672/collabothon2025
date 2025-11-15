import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'learning_material_tile.dart';

class LearningMaterialsList extends StatelessWidget {
  final List<Map<String, dynamic>> materials = [
    {
      "title": "Investment Basics",
      "icon": LucideIcons.piggyBank,
      "color": Colors.green,
      "sections": [
        {
          "subtitle": "What is Investing?",
          "content":
              "Investing means putting your money into assets (like stocks, bonds, or real estate) with the goal of growing your wealth over time."
        },
        {
          "subtitle": "Why Invest?",
          "content":
              "Beat inflation, build wealth, generate passive income, and take advantage of compound growth over time."
        },
        {
          "subtitle": "Common Investment Types",
          "content": "Stocks, Bonds, ETFs, Real Estate."
        },
      ],
    },
    {
      "title": "Understanding Risk and Return",
      "icon": LucideIcons.shield,
      "color": Colors.orange,
      "sections": [
        {
          "subtitle": "The Risk-Return Relationship",
          "content":
              "Higher potential returns usually come with higher risk. Safe investments offer steady but lower returns."
        },
        {
          "subtitle": "Types of Risk",
          "content":
              "Market risk, company risk, inflation risk, liquidity risk."
        },
        {
          "subtitle": "Managing Risk",
          "content":
              "Diversify, invest long-term, match risk tolerance, rebalance portfolio."
        },
      ],
    },
    {
      "title": "Macroeconomics Made Simple",
      "icon": LucideIcons.globe,
      "color": Colors.blue,
      "sections": [
        {
          "subtitle": "What is Macroeconomics?",
          "content":
              "Macroeconomics looks at the 'big picture' of the economy - national income, unemployment, inflation, and growth."
        },
        {
          "subtitle": "Key Economic Indicators",
          "content":
              "GDP, Inflation, Interest Rates, Unemployment Rate."
        },
        {
          "subtitle": "How Macro Affects Your Investments",
          "content":
              "High inflation can eat returns; rising interest rates affect stocks/bonds; economic growth usually benefits stocks; recessions can create opportunities."
        },
      ],
    },
    {
      "title": "Portfolio Diversification",
      "icon": LucideIcons.lineChart,
      "color": Colors.purple,
      "sections": [
        {
          "subtitle": "Why Diversify?",
          "content":
              "Spreading your money across different investments protects your portfolio."
        },
        {
          "subtitle": "Ways to Diversify",
          "content": "Asset classes, Geography, Sectors, Company Sizes."
        },
        {
          "subtitle": "Example Portfolios",
          "content":
              "Conservative: 70% Bonds, 25% Stocks, 5% Cash\nBalanced: 50% Stocks, 40% Bonds, 10% Alternatives\nAggressive: 85% Stocks, 10% Bonds, 5% Alternatives"
        },
      ],
    },
    {
      "title": "Understanding Market Cycles",
      "icon": LucideIcons.trendingUp,
      "color": Colors.indigo,
      "sections": [
        {
          "subtitle": "What are Market Cycles?",
          "content":
              "Markets go through bull (growth) and bear (decline) phases. Understanding cycles helps avoid panic."
        },
        {
          "subtitle": "Four Phases of Market Cycles",
          "content":
              "Accumulation, Mark-Up, Distribution, Mark-Down."
        },
        {
          "subtitle": "How to Navigate Cycles",
          "content":
              "Stay invested, dollar-cost averaging, rebalance periodically, view downturns as buying opportunities."
        },
      ],
    },
  ];

  LearningMaterialsList({super.key});

 @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Text(
            'Investment Learning Center',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 28,
                ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Text(
            'Easy-to-understand guides about investments and macroeconomics',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[700],
                  fontSize: 18,
                ),
          ),
        ),
        const SizedBox(height: 12),

        ...List.generate(materials.length * 2 - 1, (index) {
          if (index.isOdd) return Divider(height: 1, color: Colors.grey[300]);
          final item = materials[index ~/ 2];
          return LearningMaterialTile(
            title: item['title'],
            icon: item['icon'],
            iconColor: item['color'],
            sections: List<Map<String, String>>.from(item['sections']),
            iconSize: 36,
            titleFontSize: 20,
            sectionTitleSize: 18,
            sectionContentSize: 16,
            verticalPadding: 12,
            horizontalPadding: 20,
          );
        }),
      ],
    );
  }

}
