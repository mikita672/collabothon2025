import 'package:application/main.dart';
import 'package:application/theme/app_buttons.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class RiskSelectionPage extends StatefulWidget {
  const RiskSelectionPage({super.key, this.canPop = false});
  final bool canPop;
  @override
  State<RiskSelectionPage> createState() => _RiskSelectionPageState();
}

class _RiskSelectionPageState extends State<RiskSelectionPage> {
  int? selectedRisk;

  final riskOptions = [
    {
      "id": 1,
      "title": "Low",
      "icon": LucideIcons.shieldCheck,
      "color": Colors.green,
      "description":
          "Conservative, stable growth with minimal volatility. Ideal for risk-averse investors.",
    },
    {
      "id": 2,
      "title": "Moderate",
      "icon": LucideIcons.activity,
      "color": Colors.orange,
      "description":
          "Balanced profile with moderate ups and downs. Good for long-term diversified investors.",
    },
    {
      "id": 3,
      "title": "High",
      "icon": LucideIcons.trendingUp,
      "color": Colors.red,
      "description":
          "Aggressive profile with highest growth potential and significant volatility.",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(      appBar: AppBar(
        automaticallyImplyLeading: widget.canPop,
        title: const Text("Select Your Risk Profile"),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Choose your risk",
                style: TextStyle(
                  fontSize: screenWidth * 0.1,
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  height: 0.9,
                ),
              ),
              Text(
                "tolerance level",
                style: TextStyle(
                  fontSize: screenWidth * 0.1,
                  color: AppColors.accent,
                  fontWeight: FontWeight.bold,
                  height: 0.9,
                ),
              ),

              const SizedBox(height: 24),

              Expanded(
                child: CustomCard(
                  child: ListView.separated(
                    itemCount: riskOptions.length,
                    separatorBuilder: (_, __) =>
                        Divider(height: 1, color: Colors.grey[300]),
                    itemBuilder: (_, index) {
                      final item = riskOptions[index];
                      final isSelected = selectedRisk == item["id"];

                      return _buildRiskTile(
                        id: item["id"] as int,
                        title: item["title"] as String,
                        description: item["description"] as String,
                        icon: item["icon"] as IconData,
                        color: item["color"] as Color,
                        selected: isSelected,
                      );
                    },
                  ),
                ),
              ),

              const SizedBox(height: 12),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: selectedRisk == null ? null : _saveRisk,
                  style: AppButtons.primary(),
                  child: Text(
                    "Continue",
                    style: TextStyle(
                      fontSize: screenWidth * 0.05,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRiskTile({
    required int id,
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required bool selected,
  }) {
    return Material(
      color: Colors.white,
      child: InkWell(
        onTap: () {
          setState(() {
            selectedRisk = id;
          });
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              Icon(icon, color: color, size: 35),
              const SizedBox(width: 16),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 30,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      description,
                      style: TextStyle(fontSize: 18, color: Colors.grey[700]),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 12),

              Icon(
                selected ? LucideIcons.checkCircle : LucideIcons.circle,
                color: selected ? color : Colors.grey[400],
                size: 28,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _saveRisk() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
      'risk_level': selectedRisk,
    });

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const NavigationView()),
    );
  }
}
