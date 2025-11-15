class SimulationConfig {
  String symbol;
  String trend;
  int shares;
  double price; // new starting price

  SimulationConfig({
    required this.symbol,
    required this.trend,
    required this.shares,
    required this.price,
  });
}

class SimulationResult {
  double portfolioStart;
  double portfolioFinalValue;
  double portfolioChangeRate;
  List<double> portfolioSeries;
  Map<String, List<double>> components; 

  SimulationResult({
    required this.portfolioStart,
    required this.portfolioFinalValue,
    required this.portfolioChangeRate,
    required this.portfolioSeries,
    required this.components,
  });

  factory SimulationResult.fromJson(Map<String, dynamic> json) {
    Map<String, List<double>> componentsMap = {};
    for (var comp in json['components']) {
      componentsMap[comp['symbol']] = List<double>.from(comp['prices']);
    }
    return SimulationResult(
      portfolioStart: json['portfolio_start'],
      portfolioFinalValue: json['portfolio_final_value'],
      portfolioChangeRate: json['portfolio_change_rate'],
      portfolioSeries: List<double>.from(json['portfolio_series']),
      components: componentsMap,
    );
  }
}
