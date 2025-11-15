import 'package:application/main.dart';
import 'package:application/services/AuthService.dart';
import 'package:application/services/UserService.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/theme/input_decorations.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

class AuthPage extends StatefulWidget {
  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();

  final AuthService _authService = AuthService();
  bool isLogin = true;
  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: screenHeight * 0.07),
                Image.asset(
                  'assets/images/commerzbank_logo.png',
                  width: screenWidth * 0.3,
                  height: screenHeight * 0.2,
                  fit: BoxFit.contain,
                ),
                Text(
                  'INVESTMENT PORTFOLIO MANAGER',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: screenWidth * 0.06,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'Your intelligent investment companion',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: screenWidth * 0.05,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: screenHeight * 0.03),
                Column(
                  children: [
                    TextField(
                      controller: _emailController,
                      style: TextStyle(fontSize: screenWidth * 0.05),
                      decoration: InputDecorations.roundedOutline(
                        hintText: 'Your Email',
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.01),
                    TextField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      style: TextStyle(fontSize: screenWidth * 0.05),
                      decoration: InputDecorations.roundedOutline(
                        hintText: 'Password',
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? LucideIcons.eyeOff
                                : LucideIcons.eye,
                            color: Colors.black,
                          ),
                          onPressed: () {
                            setState(() => _obscurePassword = !_obscurePassword);
                          },
                        ),
                      ),
                    ),
                    if (!isLogin) ...[
                      SizedBox(height: screenHeight * 0.01),
                      TextField(
                        controller: _nameController,
                        style: TextStyle(fontSize: screenWidth * 0.05),
                        decoration: InputDecorations.roundedOutline(
                          hintText: 'Username',
                        ),
                      ),
                    ],
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          final email = _emailController.text.trim();
                          final password = _passwordController.text.trim();

                          if (isLogin) {
                            // Login flow
                            final user = await _authService.login(email, password);
                            if (!mounted) return;

                            if (user != null) {
                              final userService = Provider.of<UserService>(
                                context,
                                listen: false,
                              );
                              userService.startListening();

                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Login successful!')),
                              );

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const NavigationView(),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Login failed!')),
                              );
                            }
                          } else {
                            // Signup flow
                            final name = _nameController.text.trim();
                            final user = await _authService.signUp(email, password, name);
                            if (!mounted) return;

                            if (user != null) {
                              final userService = Provider.of<UserService>(
                                context,
                                listen: false,
                              );
                              userService.startListening();

                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Sign up successful!')),
                              );

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const NavigationView(),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Sign up failed!')),
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        child: Text(
                          isLogin ? 'Log In' : 'Sign Up',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: screenWidth * 0.05,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: () => setState(() => isLogin = !isLogin),
                      child: RichText(
                        text: TextSpan(
                          children: isLogin
                              ? [
                                  TextSpan(
                                    text: "Don’t have an account? ",
                                    style: TextStyle(
                                      fontSize: screenWidth * 0.04,
                                      color: Colors.black,
                                    ),
                                  ),
                                  TextSpan(
                                    text: "Create it!",
                                    style: TextStyle(
                                      fontSize: screenWidth * 0.045,
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ]
                              : [
                                  TextSpan(
                                    text: "Already have an account? ",
                                    style: TextStyle(
                                      fontSize: screenWidth * 0.04,
                                      color: Colors.black,
                                    ),
                                  ),
                                  TextSpan(
                                    text: "Log in!",
                                    style: TextStyle(
                                      fontSize: screenWidth * 0.045,
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
