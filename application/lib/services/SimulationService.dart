import 'dart:convert';
import 'dart:math';
import 'package:application/models/SimulationModel.dart';
import 'package:http/http.dart' as http;

class SimulationService {
  final String baseUrl;

  SimulationService({required this.baseUrl});

Future<SimulationResult> fetchSimulation(
  List<SimulationConfig> configs, {
  double? portfolioStart,
  int? remainingSteps,
  bool useStartP0 = false,
}) async {
  final requestBody = {
    "portfolio_start": portfolioStart ?? configs.first.price,
    "count": configs.length,
    "configs": configs.asMap().entries.map((entry) {
      final i = entry.key;
      final c = entry.value;
      return {
        "symbol": c.symbol,
        "price": c.price,
        "mu_daily": 0.0005,
        "sigma_daily": 0.02,
        "useStartP0": useStartP0,
        "startP0": portfolioStart ?? c.price,
        "n_steps": remainingSteps ?? 390,
        "nu": 5,
        "clip_limit": 0.05,
        "seed": Random().nextInt(10000),
        "trend": c.trend,
      };
    }).toList(),
    "shares": configs.map((c) => c.shares).toList(),
  };


  final response = await http.post(
    Uri.parse('$baseUrl/simulate_portfolio'),
    headers: {"Content-Type": "application/json"},
    body: jsonEncode(requestBody),
  );

  if (response.statusCode == 200) {
    return SimulationResult.fromJson(jsonDecode(response.body));
  } else {
    print('Request body: ${jsonEncode(requestBody)}');
    print('Response body: ${response.body}');
    throw Exception('Failed to fetch simulation: ${response.statusCode}');
  }
}
}
