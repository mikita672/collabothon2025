import 'package:application/controllers/dashboard_controller.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:application/widgets/dashboard/add_funds_card.dart';
import 'package:application/widgets/dashboard/dashboard_header.dart';
import 'package:application/widgets/dashboard/dashboard_portfolio_info.dart';
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
              child: AddFundsCard(
                screenWidth: MediaQuery.of(context).size.width,
                screenHeight: MediaQuery.of(context).size.height,
                onAddFunds: () {
                  dashboardController.showFundsDialog(isAdd: true);
                  //userService.updateBalance(100);
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
                    Flexible(
                      flex: 0,
                      child: CustomCard(
                        width: screenWidth * 0.3,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Current \nBalance',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: screenWidth * 0.05,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.left,
                            ),
                            Spacer(),
                            Text(
                              '${userService.balance}€',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: screenWidth * 0.07,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.left,
                            ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    Flexible(
                      flex: 6,
                      child: Column(
                        children: [
                          Expanded(
                            child: CustomCard(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: Row(
                                  children: [
                                    Text(
                                      'Total \nInvested',
                                      style: TextStyle(
                                        color: AppColors.primary,
                                        fontSize: screenWidth * 0.05,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.left,
                                    ),
                                    Spacer(),
                                    Text(
                                      '${userService.invested}€',
                                      style: TextStyle(
                                        color: AppColors.primary,
                                        fontSize: screenWidth * 0.07,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.left,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 8),
                          Expanded(
                            child: CustomCard(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: Row(
                                  children: [
                                    Text(
                                      'Total \nReturn',
                                      style: TextStyle(
                                        color: AppColors.primary,
                                        fontSize: screenWidth * 0.05,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.left,
                                    ),
                                    Spacer(),
                                    Text(
                                      '0.00€',
                                      style: TextStyle(
                                        color: AppColors.primary,
                                        fontSize: screenWidth * 0.07,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.left,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
