import 'package:application/controllers/dashboard_controller.dart';
import 'package:application/models/SimulationModel.dart';
import 'package:application/pages/risk_selection_page.dart';
import 'package:application/services/SimulationService.dart';
import 'package:application/widgets/dashboard/add_funds_card.dart';
import 'package:application/widgets/dashboard/current_balance_card.dart';
import 'package:application/widgets/dashboard/dashboard_header.dart';
import 'package:application/widgets/dashboard/dashboard_portfolio_info.dart';
import 'package:application/widgets/dashboard/growth_chart_card.dart';
import 'package:application/widgets/dashboard/total_invested_card.dart';
import 'package:application/widgets/dashboard/total_return_card.dart';
import 'package:application/widgets/dashboard/wallet_chart_card.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:application/services/UserService.dart';
import 'package:application/pages/auth_page.dart';
import 'package:application/services/AuthService.dart';
import 'package:simple_icons/simple_icons.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final SimulationService simulationService = SimulationService(
    baseUrl: "http://10.124.206.134:8000",
  );

  late SimulationResult simulationResult;

  List<SimulationConfig> configs = [
    SimulationConfig(symbol: "AAPL", price: 120, trend: "standard", shares: 1),
    SimulationConfig(symbol: "GOOG", price: 230, trend: "standard", shares: 1),
  ];

  bool isLoading = true;

  final Map<String, GlobalKey<ChartGrowthCardState>> _chartKeys = {};

  @override
  void initState() {
    super.initState();
    for (var c in configs) {
      _chartKeys[c.symbol] = GlobalKey<ChartGrowthCardState>();
    }
    _fetchSimulation();
  }

  Future<void> _fetchSimulation() async {
    setState(() => isLoading = true);
    simulationResult = await simulationService.fetchSimulation(configs);
    setState(() => isLoading = false);
  }

  Future<void> _changeTrend(String symbol, String newTrend) async {
    final config = configs.firstWhere((c) => c.symbol == symbol);
    config.trend = newTrend;

    final chartState = _chartKeys[symbol]!.currentState!;
    final lastVisibleIndex = chartState.visiblePoints - 1;
    final lastValue = chartState.series[lastVisibleIndex];

    final remainingPoints = 390 - chartState.visiblePoints;
    if (remainingPoints <= 0) return;

    final result = await simulationService.fetchSimulation(
      [
        SimulationConfig(
          symbol: symbol,
          price: lastValue,
          trend: newTrend,
          shares: config.shares,
        ),
      ],
      portfolioStart: lastValue,
      remainingSteps: remainingPoints,
      useStartP0: false,
    );
    final newSeries = result.components[symbol]?.toList() ?? [];

    if (newSeries.isNotEmpty) {
      newSeries[0] = lastValue;
    }

    chartState.replaceFuturePoints(newSeries);
  }

  void _logout(BuildContext context) async {
    await AuthService().signOut();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => AuthPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final userService = Provider.of<UserService>(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    final dashboardController = DashboardController(
      context: context,
      userService: userService,
    );

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            DashboardHeader(
              dashboardController: dashboardController,
              userName: userService.name ?? '',
              onLogout: () => _logout(context),
            ),
            const SizedBox(height: 16),
            const DashboardPortfolioInfo(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: userService.invested <= 0
                  ? AddFundsCard(
                      screenWidth: screenWidth,
                      screenHeight: screenHeight,
                      onAddFunds: () {
                        dashboardController.showFundsDialog(isAdd: true);
                      },
                    )
                  : isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : Builder(
                      builder: (_) {
                        // Compute portfolio series: sum of all stocks' series * shares
                        final int seriesLength =
                            simulationResult.components.values.first.length;
                        final List<double> portfolioSeries = List.generate(
                          seriesLength,
                          (i) {
                            double sum = 0;
                            for (var c in configs) {
                              final series =
                                  simulationResult.components[c.symbol] ?? [];
                              if (i < series.length) {
                                sum += series[i] * c.shares;
                              }
                            }
                            return sum;
                          },
                        );

                        return ChartGrowthCard(
                          key: GlobalKey<ChartGrowthCardState>(),
                          width: screenWidth,
                          height: screenHeight * 0.3,
                          symbol: "Portfolio",
                          series: portfolioSeries,
                          onTrendChange: (trend) {},
                        );
                      },
                    ),
            ),
            SizedBox(height: screenHeight * 0.02),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: SizedBox(
                height: screenHeight * 0.2,
                child: Row(
                  children: [
                    CurrentBalanceCard(
                      balance: userService.balance,
                      screenWidth: screenWidth,
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      flex: 6,
                      child: Column(
                        children: [
                          TotalInvestedCard(
                            invested: userService.invested,
                            screenWidth: screenWidth,
                          ),
                          const SizedBox(height: 8),
                          TotalReturnCard(
                            totalReturn: 0,
                            screenWidth: screenWidth,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Material(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const RiskSelectionPage(canPop: true),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.settings, color: Colors.blueGrey),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Text(
                            "Change your risk tolerance",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios,
                          size: 20,
                          color: Colors.grey,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
