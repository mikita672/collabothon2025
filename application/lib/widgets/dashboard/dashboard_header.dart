import 'package:application/controllers/dashboard_controller.dart';
import 'package:flutter/material.dart';
import 'package:application/theme/app_colors.dart';
import 'dashboard_action_buttons.dart';

class DashboardHeader extends StatelessWidget {
  final String userName;
  final VoidCallback onLogout;
  final DashboardController dashboardController;

  const DashboardHeader({
    required this.userName,
    required this.onLogout,
    required this.dashboardController,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final radius = 24.0;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(radius),
          bottomRight: Radius.circular(radius),
        ),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: screenWidth * 0.12,
                    backgroundImage:
                        const AssetImage('assets/images/sample_avatar.png'),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome,',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: screenWidth * 0.08,
                          fontWeight: FontWeight.bold,
                          height: 1,
                        ),
                      ),
                      Text(
                        userName,
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: screenWidth * 0.085,
                          fontWeight: FontWeight.bold,
                          height: 1,
                        ),
                      ),
                      SizedBox(height: screenHeight * 0.005),
                      Text(
                        'User Number: 35433455',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: screenWidth * 0.04,
                          fontWeight: FontWeight.bold,
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              SizedBox(height: screenHeight * 0.01),
              DashboardActionButtons(screenWidth: screenWidth, screenHeight: screenHeight, dashboardController: dashboardController),
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: IconButton(
              iconSize: screenWidth * 0.08,
              color: AppColors.primary,
              icon: const Icon(Icons.logout),
              onPressed: onLogout,
              tooltip: "Logout",
            ),
          ),
        ],
      ),
    );
  }
}
