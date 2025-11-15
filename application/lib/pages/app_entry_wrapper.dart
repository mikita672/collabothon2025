import 'package:application/main.dart';
import 'package:application/pages/risk_selection_page.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'auth_page.dart';

class AppEntryWrapper extends StatelessWidget {
  const AppEntryWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      return AuthPage();
    }

    return StreamBuilder<DocumentSnapshot>(
      stream: FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .snapshots(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final data =
            snapshot.data!.data() as Map<String, dynamic>? ?? {};

        final riskLevel = data['risk_level'];

        if (riskLevel == null) {
          return const RiskSelectionPage();
        }

        return const NavigationView();
      },
    );
  }
}
