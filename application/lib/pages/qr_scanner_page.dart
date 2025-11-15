import 'package:application/app_constants.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:application/theme/app_colors.dart';

Future<String?> generateCustomToken(String uid) async {
  try {
    final response = await http.post(
      Uri.parse(
        'https://tepidly-unwandering-charlyn.ngrok-free.dev/generateToken',
      ),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'uid': uid}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token'];
    } else {
      print('Server error: ${response.body}');
      return null;
    }
  } catch (e) {
    print('HTTP error: $e');
    return null;
  }
}

class QrScannerPage extends StatefulWidget {
  const QrScannerPage({super.key});

  @override
  State<QrScannerPage> createState() => _QrScannerPageState();
}

class _QrScannerPageState extends State<QrScannerPage> {
  final MobileScannerController cameraController = MobileScannerController();
  bool _isProcessing = false;
  String? scannedData;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  String extractSessionId(String scanned) {
    final uri = Uri.tryParse(scanned);
    if (uri != null && uri.queryParameters.containsKey('session')) {
      return uri.queryParameters['session']!;
    }
    return scanned;
  }

  String sanitizeKey(String key) {
    return key.replaceAll(RegExp(r'[.#$\[\]]'), '_');
  }

  void _onDetect(BarcodeCapture capture) async {
    if (capture.barcodes.isEmpty || _isProcessing) return;

    final scannedRaw = capture.barcodes.first.rawValue;
    if (scannedRaw == null) return;

    final sessionId = sanitizeKey(extractSessionId(scannedRaw));

    setState(() {
      scannedData = sessionId;
      _isProcessing = true;
    });

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw Exception('No logged-in user');

      final customToken = await generateCustomToken(user.uid);
      if (customToken == null) throw Exception('Failed to get custom token');

      final dbRef = FirebaseDatabase.instanceFor(
        app: FirebaseDatabase.instance.app,
        databaseURL: AppConstants.firebaseDatabaseUrl,
      ).ref('qr_sessions/$sessionId');

      await dbRef.set({'authenticated': true, 'token': customToken});

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login succesfull!'),
          duration: const Duration(seconds: 3),
        ),
      );

      final snapshot = await dbRef.get();
      print('Snapshot exists: ${snapshot.exists}, value: ${snapshot.value}');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          duration: const Duration(seconds: 2),
        ),
      );
    } finally {
      Future.delayed(const Duration(seconds: 1), () {
        setState(() {
          _isProcessing = false;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final overlaySize = screenWidth * 0.7;
    final double squareTopOffset = 150.0;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          MobileScanner(controller: cameraController, onDetect: _onDetect),
          CustomPaint(
            size: MediaQuery.of(context).size,
            painter: ScannerOverlayPainter(
              overlaySize: overlaySize,
              squareTopOffset: squareTopOffset,
            ),
          ),
          Positioned(
            top: squareTopOffset + overlaySize + 20,
            left: 0,
            right: 0,
            child: Column(
              children: const [
                SizedBox(height: 16),
                Text(
                  'Scan QR on website',
                  style: TextStyle(
                    color: Color.fromARGB(255, 0, 0, 0),
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'You\'ll be logged instantly',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 20,
                    fontWeight: FontWeight.w400,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ScannerOverlayPainter extends CustomPainter {
  final double overlaySize;
  final double borderRadius;
  final double squareTopOffset;

  ScannerOverlayPainter({
    required this.overlaySize,
    this.borderRadius = 20,
    this.squareTopOffset = 150.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final rRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(
        (size.width - overlaySize) / 2,
        squareTopOffset,
        overlaySize,
        overlaySize,
      ),
      Radius.circular(borderRadius),
    );

    final path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(rRect)
      ..fillType = PathFillType.evenOdd;

    canvas.drawPath(path, paint);

    final borderPaint = Paint()
      ..color = AppColors.primary
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke;

    final double borderOffset = 8.0;
    final RRect borderRRect = rRect.inflate(borderOffset);
    drawDashedRRect(canvas, borderRRect, borderPaint, 25, 5);
  }

  void drawDashedRRect(
    Canvas canvas,
    RRect rRect,
    Paint paint,
    double dashWidth,
    double dashSpace,
  ) {
    final path = Path()..addRRect(rRect);
    final pathMetrics = path.computeMetrics();

    for (final metric in pathMetrics) {
      double distance = 0.0;
      while (distance < metric.length) {
        final next = distance + dashWidth;
        final extractPath = metric.extractPath(
          distance,
          next.clamp(0.0, metric.length),
        );
        canvas.drawPath(extractPath, paint);
        distance = next + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
