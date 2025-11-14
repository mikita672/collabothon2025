import 'package:application/main.dart';
import 'package:application/services/AuthService.dart';
import 'package:application/widgets/common/custom_card.dart';
import 'package:flutter/material.dart';

class AuthPage extends StatefulWidget {
  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _authService = AuthService();

  bool isLogin = true;

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Column(
                  children: [
                    SizedBox(height: 16),
                    Text(
                      isLogin ? 'Witamy z Powrotem!' : 'Dołącz do EcoPoint',
                      style: TextStyle(
                        color: Color.fromARGB(255, 0, 0, 0),
                        fontSize: screenWidth * 0.07,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      isLogin
                          ? 'Zaloguj się do swojego eko-konta'
                          : 'Utwórz konto i zacznij zbierać punkty',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: screenWidth * 0.04,
                        fontWeight: FontWeight.w400,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                SizedBox(height: screenHeight * 0.03),
                CustomCard(
                  child: Column(
                    children: [
                      if (!isLogin) ...[
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Imię i nazwisko',
                            style: TextStyle(
                              fontSize: screenWidth * 0.05,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        SizedBox(height: screenHeight * 0.01),
                        TextField(
                          controller: _nameController,
                        ),
                        SizedBox(height: screenHeight * 0.01),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Username',
                            style: TextStyle(
                              fontSize: screenWidth * 0.05,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        TextField(
                          controller: _usernameController,
                        ),
                      ],
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Email',
                          style: TextStyle(
                            fontSize: screenWidth * 0.05,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(height: screenHeight * 0.01),
                      TextField(
                        controller: _emailController,
                      ),
                      SizedBox(height: screenHeight * 0.01),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Hasło',
                          style: TextStyle(
                            fontSize: screenWidth * 0.05,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(height: screenHeight * 0.01),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                      ),

                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () async {
                            final email = _emailController.text.trim();
                            final password = _passwordController.text.trim();
                            if (isLogin) {
                              final user = await _authService.login(
                                email,
                                password,
                              );
                              if (!mounted) return;
                              if (user != null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Login successful!'),
                                  ),
                                );

                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(builder: (_) => const NavigationView()),
                                );
                              }
                            } else {
                              final name = _nameController.text.trim();
                              final user = await _authService.signUp(
                                email,
                                password,
                                name,
                              );
                              if (!mounted) return;
                              if (user != null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Sign up successful!'),
                                  ),
                                );
                                
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(builder: (_) => const NavigationView()),
                                );                                
                              }

                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            isLogin ? 'Zaloguj się' : 'Zarejestruj się',
                            style: TextStyle(color: Colors.white),
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
      ),
      bottomNavigationBar: SafeArea(
        child: TextButton(
          onPressed: () => setState(() => isLogin = !isLogin),
          child: Text(
            isLogin ? 'Nie masz konta? Utwórz' : 'Już masz konto? Zaloguj się',
          ),
        ),
      ),
    );
  }
}