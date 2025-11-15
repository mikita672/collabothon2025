import 'package:application/controllers/dashboard_controller.dart';
import 'package:application/pages/risk_selection_page.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:application/widgets/dashboard/add_funds_card.dart';
import 'package:application/widgets/dashboard/current_balance_card.dart';
import 'package:application/widgets/dashboard/dashboard_header.dart';
import 'package:application/widgets/dashboard/dashboard_portfolio_info.dart';
import 'package:application/widgets/dashboard/total_invested_card.dart';
import 'package:application/widgets/dashboard/total_return_card.dart';
import 'package:application/widgets/dashboard/wallet_chart_card.dart';
import 'package:application/widgets/dashboard/wallet_growth_chart_card.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:application/services/UserService.dart';
import 'package:application/pages/auth_page.dart';
import 'package:application/services/AuthService.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

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
              child: userService.invested <= 0 ? AddFundsCard(
                screenWidth: MediaQuery.of(context).size.width,
                screenHeight: MediaQuery.of(context).size.height,
                onAddFunds: () {
                  dashboardController.showFundsDialog(isAdd: true);
                },
              ) : WalletChartGrowthCard(screenWidth: screenWidth, screenHeight: screenHeight),
            ),
            SizedBox(height: screenHeight * 0.02),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: SizedBox(
                height: screenHeight * 0.2,
                child: Row(
                  children: [
                    CurrentBalanceCard(balance: userService.balance, screenWidth: screenWidth),
                    SizedBox(width: 8),
                    Flexible(
                      flex: 6,
                      child: Column(
                        children: [
                          TotalInvestedCard(invested: userService.invested, screenWidth: screenWidth),
                          SizedBox(height: 8),
                          TotalReturnCard(totalReturn: 0, screenWidth: screenWidth)
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
            const Icon(Icons.arrow_forward_ios, size: 20, color: Colors.grey),
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
