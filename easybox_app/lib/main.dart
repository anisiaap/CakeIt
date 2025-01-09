import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
 
void main() {
  runApp(EasyboxApp());
}
 
class EasyboxApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Easybox',
      theme: ThemeData(
        primarySwatch: Colors.brown,
        scaffoldBackgroundColor: Color(0xFFFFF8E1),
      ),
      home: EasyboxScreen(),
    );
  }
}
 
class EasyboxScreen extends StatelessWidget {
  Future<bool> _controlLock(BuildContext context) async {
    try {
      print('Running solenoid lock control script...');
      final result = await Process.run(
        'python3',
        ['control_lock.py'],
        workingDirectory: '/home/anisiapirvulescu/Desktop/CakeIt/CakeIT/easybox_app', // Update the path if needed
      );

      print('Script stdout: ${result.stdout}');
      print('Script stderr: ${result.stderr}');
      print('Exit code: ${result.exitCode}');

      if (result.exitCode == 0) {
        print('Solenoid lock operation succeeded.');
        return true; // Lock operation succeeded
      } else {
        _showDialog(context, 'Failed to activate the solenoid lock.');
        return false; // Lock operation failed
      }
    } catch (e) {
      print('Error running lock control script: $e');
      _showDialog(context, 'Error running lock control script: $e');
      return false;
    }
  }
  Future<void> handleLeaveOrder(BuildContext context) async {
    try {
      // Step 1: Check Easybox Status
      final response = await http.post(
        Uri.parse('http://192.168.1.96:5001/api/easybox/reservations/status'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['isFull']) {
          _showDialog(context, 'Easybox is full');
          return;
        }
      } else {
        _showDialog(context, 'Failed to check Easybox availability');
        return;
      }

      // Step 2: Show Pop-up Message
      await _showCameraPrompt(context);

      // Step 3: Capture Image and Decode QR
      String? qrData = await _captureAndDecodeQR(context);

      if (qrData == null) {
        _showDialog(context, 'No QR code detected');
        return;
      }
      print(qrData);

      bool lockSuccess = await _controlLock(context);
      if (!lockSuccess) return; 

      // Step 4: Update Backend
      final updateResponse = await http.patch(
        Uri.parse('http://192.168.1.96:5001/api/easybox/update-box'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'orderId': qrData,
          'state': 'waiting for pickup',
          'orderStatus': 'waiting for pickup',
        }),
      );

      if (updateResponse.statusCode == 200) {
        _showDialog(context, 'Order left successfully');
      } else {
        _showDialog(context, 'Failed to update Easybox');
      }
    } catch (e) {
      _showDialog(context, 'Error: $e');
    }
  }
    Future<void> _showCameraPrompt(BuildContext context) async {
    await showDialog(
      context: context,
      barrierDismissible: false, // Prevent dismissal by tapping outside
      builder: (ctx) => AlertDialog(
        title: Text('Place QR Code'),
        content: Text(
          'Please place the QR code in front of the camera scanner.',
        ),
        actions: [
          TextButton(
            child: Text('OK'),
            onPressed: () {
              Navigator.of(ctx).pop(); // Close the dialog
            },
          ),
        ],
      ),
    );
  }Future<void> handlePickupOrder(BuildContext context) async {
    try {
      // Step 1: Check if Easybox has any orders
      final response = await http.post(
        Uri.parse('http://192.168.1.96:5001/api/easybox/reservations/status'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (!data['hasOrders']) {
          _showDialog(context, 'Easybox is empty');
          return;
        }
      } else {
        _showDialog(context, 'Failed to check Easybox availability');
        return;
      }

      // Step 2: Show Pop-up Message
      await _showCameraPrompt(context);

      // Step 3: Capture Image and Decode QR
      String? qrData = await _captureAndDecodeQR(context);

      if (qrData == null) {
        _showDialog(context, 'No QR code detected');
        return;
      }

      print('QR Data: $qrData');

      bool lockSuccess = await _controlLock(context);
      if (!lockSuccess) return; 
      
      // Step 4: Update Backend for Pickup
      final updateResponse = await http.patch(
        Uri.parse('http://192.168.1.96:5001/api/easybox/update-box'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'orderId': qrData,
          'state': 'completed',
          'orderStatus': 'completed',
        }),
      );

      if (updateResponse.statusCode == 200) {
        _showDialog(context, 'Order picked up successfully');
      } else {
        _showDialog(context, 'Failed to update Easybox');
      }
    } catch (e) {
      _showDialog(context, 'Error: $e');
    }
  }
  Future<String?> _captureAndDecodeQR(BuildContext context) async {
    try {
      print('Running QR script...');
      final result = await Process.run(
        'python3',
        ['decode_qr.py'],
        workingDirectory: '/home/anisiapirvulescu/Desktop/CakeIt/CakeIT/easybox_app', // Update the path if needed
      );

      print('Script stdout: ${result.stdout}');
      print('Script stderr: ${result.stderr}');
      print('Exit code: ${result.exitCode}');

      if (result.exitCode == 0) {
        final output = result.stdout.trim();

        // Extract only the value after 'orderid:'
         final regex = RegExp(r'OrderID:\s*(.+)'); // Match everything after 'orderid:'
        final match = regex.firstMatch(output);

        if (match != null) {
          return match.group(1)?.trim(); // Return the captured value, trimmed
        } else {
          _showDialog(context, 'Invalid QR code format.');
          return null;
        }
      } else {
        _showDialog(context, 'No QR code detected within the timeout.');
        return null;
      }
    } catch (e) {
      print('Error running QR script: $e');
      _showDialog(context, 'Error running QR script: $e');
      return null;
    }
  }
  void _showDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        content: Text(message),
        actions: [
          TextButton(
            child: Text('OK'),
            onPressed: () {
              Navigator.of(ctx).pop();
            },
          ),
        ],
      ),
    );
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text(
                    'Welcome to the Bakery Easybox',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.brown[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Please choose an action below',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.brown[500],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            Spacer(),
            ElevatedButton(
              onPressed: () => handleLeaveOrder(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.brown[400],
                foregroundColor: Colors.white,
                minimumSize: Size(300, 60),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: Text(
                'Leave an Order',
                style: TextStyle(fontSize: 18),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => handlePickupOrder(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.brown[600],
                foregroundColor: Colors.white,
                minimumSize: Size(300, 60),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: Text(
                'Pickup an Order',
                style: TextStyle(fontSize: 18),
              ),
            ),
            Spacer(),
            Text(
              'Powered by Easybox Solutions',
              style: TextStyle(
                fontSize: 12,
                color: Colors.brown[300],
              ),
            ),
            SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}