// Simple test script to verify email configuration
const { sendVerificationEmail } = require('./services/emailService');
require('dotenv').config();

async function testEmailConfiguration() {
    console.log('🧪 Testing email configuration...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Using default: http://localhost:3000');
    console.log('');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ Please set EMAIL_USER and EMAIL_PASS in your .env file');
        console.log('📖 See README.md for setup instructions');
        return;
    }
    
    // Test email sending
    console.log('📧 Sending test verification email...');
    
    const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
    const testToken = 'test-token-123456789';
    const testName = 'Test User';
    
    try {
        const result = await sendVerificationEmail(testEmail, testToken, testName);
        
        if (result.success) {
            console.log('✅ Test email sent successfully!');
            console.log('📬 Message ID:', result.messageId);
            console.log('📮 Check your email inbox for the verification email');
        } else {
            console.log('❌ Failed to send test email');
            console.log('Error:', result.error);
        }
    } catch (error) {
        console.log('❌ Error during email test:', error.message);
    }
}

// Run the test
testEmailConfiguration();
