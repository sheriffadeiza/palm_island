// Test registration without server
const dotenv = require('dotenv');
const connectDB = require('./mongo');
const { User } = require('./model/user.model');
const { sendVerificationEmail } = require('./services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

dotenv.config();

async function testRegistration() {
    try {
        console.log('🔌 Connecting to database...');
        await connectDB();
        
        console.log('👤 Testing user creation...');
        
        const testData = {
            fullname: 'Test User',
            email: 'test-direct@example.com',
            password: 'testpassword123',
            role: 'bidder'
        };
        
        // Check if user exists
        const existingUser = await User.findOne({email: testData.email});
        if (existingUser) {
            console.log('🗑️ Deleting existing test user...');
            await User.deleteOne({email: testData.email});
        }
        
        // Hash password
        console.log('🔐 Hashing password...');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(testData.password, saltRounds);
        
        // Generate verification token
        console.log('🎫 Generating verification token...');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Create user
        console.log('💾 Creating user in database...');
        const newUser = await User.create({
            fullname: testData.fullname,
            email: testData.email,
            password: hashedPassword,
            role: testData.role,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        });
        
        console.log('✅ User created:', newUser._id);
        
        // Send verification email
        console.log('📧 Testing email sending...');
        const emailResult = await sendVerificationEmail(testData.email, verificationToken, testData.fullname);
        
        console.log('📧 Email result:', emailResult);
        
        if (emailResult.success) {
            console.log('🎉 Registration test completed successfully!');
        } else {
            console.log('❌ Email sending failed:', emailResult.error);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Registration test failed:', error);
        process.exit(1);
    }
}

testRegistration();
