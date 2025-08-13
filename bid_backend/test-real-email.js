// Test real email sending
const { sendVerificationEmail } = require('./services/emailService');
require('dotenv').config();

async function testRealEmail() {
    console.log('🧪 Testing real email sending...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
    
    try {
        const result = await sendVerificationEmail(
            'devrachaelojo@gmail.com', 
            'test-token-123', 
            'Rachael Test'
        );
        
        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log('📧 Message ID:', result.messageId);
            console.log('📬 Check your email inbox!');
        } else {
            console.log('❌ Email sending failed:');
            console.log('🔍 Error:', result.error);
        }
    } catch (error) {
        console.log('❌ Test failed with error:');
        console.log('🔍 Error:', error.message);
        console.log('📋 Full error:', error);
    }
}

testRealEmail();
