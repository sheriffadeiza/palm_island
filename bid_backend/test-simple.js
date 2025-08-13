// Simple test for email service
const { sendVerificationEmail } = require('./services/emailService');

async function testEmail() {
    console.log('Testing email service...');
    
    try {
        const result = await sendVerificationEmail('test@example.com', 'test-token-123', 'Test User');
        console.log('Email result:', result);
        
        if (result.success) {
            console.log('✅ Email service working correctly');
        } else {
            console.log('❌ Email service failed:', result.error);
        }
    } catch (error) {
        console.log('❌ Error testing email:', error);
    }
}

testEmail();
