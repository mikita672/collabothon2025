import 'package:application/theme/app_buttons.dart';
import 'package:application/theme/app_colors.dart';
import 'package:application/theme/input_decorations.dart';
import 'package:flutter/material.dart';
import 'package:application/services/UserService.dart';

class DashboardController {
  final BuildContext context;
  final UserService userService;

  DashboardController({required this.context, required this.userService});

  Future<void> showFundsDialog({bool isAdd = true}) async {
    final TextEditingController amountController = TextEditingController();

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(
            isAdd ? "Add Funds to Your Portfolio" : "Withdraw to Commerzbank",
            style: TextStyle(
              color: AppColors.primary,
              fontSize: 25,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                isAdd
                    ? "Transfer money from your Commerzbank account to start investing"
                    : "Transfer funds from your portfolio back to your Commerzbank account",
                style: TextStyle(color: Colors.grey, fontSize: 20),
                textAlign: TextAlign.center,
              ),
              if (!isAdd) ...[
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 91, 132, 254).withAlpha(30),
                    border: Border.all(color:Color.fromARGB(255, 91, 132, 254).withAlpha(90)),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Available balance: ${userService.balance.toStringAsFixed(2)}€",
                          style: TextStyle(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Amount (EUR)",
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.left,
                ),
              ),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                decoration: InputDecorations.greyRounded(hintText: "0.00€"),
              ),
            ],
          ),
          actions: [
            SizedBox(
              width: double.infinity,
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextButton(
                      onPressed: () => Navigator.of(ctx).pop(),
                      style: AppButtons.primary(
                        radius: 25,
                        background: const Color.fromARGB(255, 58, 58, 58),
                      ),
                      child: const Text(
                        "Cancel",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 7,
                    child: ElevatedButton(
                      onPressed: () {
                        final amount = double.tryParse(amountController.text);
                        if (amount != null && amount > 0) {
                          if (isAdd) {
                            userService.updateBalance(amount);
                          } else {
                            if (userService.balance >= amount) {
                              userService.updateBalance(-amount);
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text("Insufficient balance!")),
                              );
                            }
                          }
                          Navigator.of(ctx).pop();
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Enter a valid amount!")),
                          );
                        }
                      },
                      style: AppButtons.primary(radius: 25),
                      child: Text(
                        isAdd ? "Add Funds" : "Withdraw",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
