import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class UserService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? name;
  double balance = 0.0;
  double invested = 0.0;
  int? riskLevel; 
  bool shouldSelectRiskLevel = false;

  Map<String, dynamic> stocks = {};

  Stream<DocumentSnapshot<Map<String, dynamic>>>? _userStream;

  void startListening() {
    final user = _auth.currentUser;
    if (user == null) return;

    _userStream = _firestore.collection('users').doc(user.uid).snapshots();

    _userStream!.listen((doc) {
      if (!doc.exists) return;

      final data = doc.data()!;
      name = data['name'] as String?;

      final balanceValue = data['balance'];
      balance = balanceValue is int
          ? balanceValue.toDouble()
          : balanceValue is double
              ? double.parse(balanceValue.toStringAsFixed(2))
              : 0.0;

      final investedValue = data['invested'];
      invested = investedValue is int
          ? investedValue.toDouble()
          : investedValue is double
              ? double.parse(investedValue.toStringAsFixed(2))
              : 0.0;

      riskLevel = data['risk_level']; 


      shouldSelectRiskLevel = riskLevel == null;

      notifyListeners();
    });
  }

  Future<void> updateBalance(double value) async {
    final user = _auth.currentUser;
    if (user == null) return;

    balance += value;
    balance = double.parse(balance.toStringAsFixed(2));
    notifyListeners();

    await _firestore
        .collection('users')
        .doc(user.uid)
        .update({'balance': balance});
  }

  Future<void> updateInvested(double value) async {
    final user = _auth.currentUser;
    if (user == null) return;

    invested += value;
    invested = double.parse(invested.toStringAsFixed(2));
    notifyListeners();

    await _firestore
        .collection('users')
        .doc(user.uid)
        .update({'invested': invested});
  }

  Future<void> signOut() async {
    await _auth.signOut();
    name = null;
    balance = 0.0;
    invested = 0.0;
    riskLevel = 0;
    stocks = {};
    notifyListeners();
  }
}

