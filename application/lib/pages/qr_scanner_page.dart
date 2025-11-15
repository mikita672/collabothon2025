import 'package:application/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QrScannerPage extends StatefulWidget {
  const QrScannerPage({super.key});

  @override
  State<QrScannerPage> createState() => _QrScannerPageState();
}

class _QrScannerPageState extends State<QrScannerPage> {
  final MobileScannerController cameraController = MobileScannerController();
  bool _isScanning = true;
  String? scannedData;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _isScanning = true;
  }

  void _onDetect(BarcodeCapture capture) {
    if (_isScanning && capture.barcodes.isNotEmpty) {
      final String? code = capture.barcodes.first.rawValue;
      if (code == "futuredata") {
        setState(() {
          scannedData = code;
          _isScanning = false;
        });

      }
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
          MobileScanner(
            controller: cameraController,
            onDetect: (capture) => _onDetect(capture),
          ),
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
              children: [
                SizedBox(height: 16),
                Text(
                  'Scan QR on website',
                  style: const TextStyle(
                    color: Color.fromARGB(255, 0, 0, 0),
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'You`ll be logged instantly',
                  style: const TextStyle(
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