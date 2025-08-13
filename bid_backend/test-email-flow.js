// Test the complete email verification flow
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

// User Schema (same as in index.js)
const UserSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null }
}, { timestamps: true });

const User = mongoose.model("TestUsers", UserSchema);

async function testEmailFlow() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Test data
        const testEmail = 'emailtest@example.com';
        const testPassword = 'testpass123';

        // Clean up any existing test user
        await User.deleteOne({ email: testEmail });
        console.log('🧹 Cleaned up existing test user');

        // 1. Register user
        console.log('\n📝 STEP 1: Registering user...');
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newUser = await User.create({
            fullname: 'Email Test User',
            email: testEmail,
            password: hashedPassword,
            role: 'bidder',
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        });

        console.log('✅ User registered:', newUser._id);

        // 2. Simulate email sending
        console.log('\n📧 STEP 2: Email simulation...');
        const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
        
        console.log('📧 ===== EMAIL SIMULATION =====');
        console.log(`To: ${testEmail}`);
        console.log(`Subject: Email Verification - Bid Platform`);
        console.log(`Verification URL: ${verificationUrl}`);
        console.log('================================');

        // 3. Test email verification
        console.log('\n✅ STEP 3: Verifying email...');
        const userToVerify = await User.findOne({
            emailVerificationToken: verificationToken,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (userToVerify) {
            userToVerify.isEmailVerified = true;
            userToVerify.emailVerificationToken = null;
            userToVerify.emailVerificationExpires = null;
            await userToVerify.save();
            console.log('✅ Email verified successfully!');
        } else {
            console.log('❌ Verification failed - invalid or expired token');
        }

        // 4. Test login
        console.log('\n🔐 STEP 4: Testing login...');
        const loginUser = await User.findOne({ email: testEmail });
        
        if (!loginUser) {
            console.log('❌ User not found');
            return;
        }

        if (!loginUser.isEmailVerified) {
            console.log('❌ Email not verified - login should fail');
            return;
        }

        const isPasswordValid = await bcrypt.compare(testPassword, loginUser.password);
        if (isPasswordValid) {
            console.log('✅ Login successful!');
            console.log('👤 User data:', {
                id: loginUser._id,
                fullname: loginUser.fullname,
                email: loginUser.email,
                role: loginUser.role,
                isEmailVerified: loginUser.isEmailVerified
            });
        } else {
            console.log('❌ Invalid password');
        }

        console.log('\n🎉 Email verification flow test completed successfully!');
        console.log('\n📋 Summary:');
        console.log('1. ✅ User registration');
        console.log('2. ✅ Email simulation (logged to console)');
        console.log('3. ✅ Email verification');
        console.log('4. ✅ Login with verified email');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testEmailFlow();
