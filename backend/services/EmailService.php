<?php
class EmailService {
    /**
     * Simulate sending an email.
     * In a real application, this would use PHPMailer or an API like SendGrid/Mailgun.
     */
    public static function sendVerificationEmail($email, $name, $token) {
        $verificationLink = "http://localhost:5173/verify-email?token=" . $token;
        
        $subject = "Welcome to StockFlow - Please verify your email";
        $message = "Hello $name,\n\n";
        $message .= "Your StockFlow staff account has been created.\n";
        $message .= "Please click the following link to verify your email address and continue with your profile setup:\n\n";
        $message .= "$verificationLink\n\n";
        $message .= "Thank you,\nThe StockFlow Admin Team";

        // Simulate logging the email to a file for development purposes
        $logFile = __DIR__ . '/../../email_logs.txt';
        $logEntry = "--- EMAIL NOTIFICATION ---\nDate: " . date('Y-m-d H:i:s') . "\nTo: $email\nSubject: $subject\nMessage:\n$message\n--------------------------\n\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        return true;
    }

    public static function sendSetupConfirmation($email, $name, $staffId) {
        $subject = "StockFlow - Profile Setup Complete";
        $message = "Hello $name,\n\n";
        $message .= "Your staff profile setup is complete!\n";
        $message .= "Your unique Staff ID is: $staffId\n\n";
        $message .= "You can now log in and access your dashboard.\n\n";
        $message .= "Best regards,\nThe StockFlow Admin Team";

        $logFile = __DIR__ . '/../../email_logs.txt';
        $logEntry = "--- EMAIL NOTIFICATION ---\nDate: " . date('Y-m-d H:i:s') . "\nTo: $email\nSubject: $subject\nMessage:\n$message\n--------------------------\n\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        return true;
    }
    
    public static function notifyAdminOfNewStaff($adminEmail, $staffName, $staffId) {
        $subject = "StockFlow Admin Alert - New Staff Profile Completed";
        $message = "Admin Alert,\n\n";
        $message .= "A new staff member has successfully completed their profile setup.\n";
        $message .= "Name: $staffName\n";
        $message .= "Staff ID: $staffId\n\n";
        $message .= "Please log in to the admin dashboard to review their details.\n";

        $logFile = __DIR__ . '/../../email_logs.txt';
        $logEntry = "--- EMAIL NOTIFICATION ---\nDate: " . date('Y-m-d H:i:s') . "\nTo: $adminEmail\nSubject: $subject\nMessage:\n$message\n--------------------------\n\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        return true;
    }
}
?>
