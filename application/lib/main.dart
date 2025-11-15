import 'package:application/pages/auth_page.dart';
import 'package:application/pages/dashboard_page.dart';
import 'package:application/pages/learning_page.dart';
import 'package:application/pages/news_page.dart';
import 'package:application/pages/qr_scanner_page.dart';
import 'package:application/services/UserService.dart';
import 'package:application/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';

import 'package:firebase_auth/firebase_auth.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  final firebaseUser = FirebaseAuth.instance.currentUser;

  final userService = UserService();
  if (firebaseUser != null) {
    userService.startListening();
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<UserService>.value(value: userService),
      ],
      child: MyApp(initialUser: firebaseUser),
    ),
  );
}

class MyApp extends StatelessWidget {
  final User? initialUser;
  const MyApp({super.key, this.initialUser});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color.fromARGB(255, 220, 226, 252),
        ),
        fontFamily: 'Afacad',
      ),
      home: initialUser != null ? const NavigationView() : AuthPage(),
    );
  }
}

class NavigationView extends StatefulWidget {
  const NavigationView({super.key});

  @override
  State<NavigationView> createState() => _NavigationViewState();
}

class _NavigationViewState extends State<NavigationView> {
  int _selectedIndex = 0;

  final List<Widget> _pages = const [
    DashboardPage(),
    NewsPage(),
    LearningPage(),
    QrScannerPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(index: _selectedIndex, children: _pages),
      ),
      bottomNavigationBar: Theme(
        data: Theme.of(context).copyWith(
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          showUnselectedLabels: false,
          unselectedItemColor: AppColors.primary,
          selectedItemColor: AppColors.primary,
          unselectedLabelStyle: TextStyle(
            color: AppColors.primary,
            fontFamily: 'Afacad',
          ),
          selectedLabelStyle: TextStyle(
            color: AppColors.primary,
            fontFamily: 'Afacad',
          ),
          currentIndex: _selectedIndex,
          onTap: (int index) {
            setState(() {
              _selectedIndex = index;
            });
          },

          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.layoutDashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.newspaper),
              label: "News",
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.book),
              label: "Learning",
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.qrCode),
              label: "Login",
            ),
          ],
        ),
      ),
    );
  }
}
