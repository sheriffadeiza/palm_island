const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

dotenv.config();

// User Schema
const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email:{
        required: true,
        type: String,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model("Users", UserSchema);

// Email simulation function
const simulateEmailSending = (email, verificationToken, fullname) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    console.log('\n📧 ===== EMAIL SIMULATION =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Email Verification - Bid Platform`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('================================\n');
    
    return { success: true, messageId: 'simulated-' + Date.now() };
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

const app = express();
app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration request received');
        
        const { fullname, email, password, role } = req.body;
        
        // Validate input
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Create user
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        });
        
        console.log('✅ User created:', newUser._id);
        
        // Simulate email sending
        try {
            const emailResult = simulateEmailSending(email, verificationToken, fullname);
            console.log('📧 Email simulation result:', emailResult);

            // Always return success for development
            res.status(201).json({
                message: "Registration successful! Please check your email to verify your account.",
                userId: newUser._id,
                verificationToken: verificationToken // For testing only
            });
        } catch (emailError) {
            console.log('❌ Email simulation error:', emailError);
            res.status(201).json({
                message: "Registration successful! Please check your email to verify your account.",
                userId: newUser._id,
                verificationToken: verificationToken // For testing only
            });
        }
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Email verification endpoint
app.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }
        
        // Find user with the verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }
        
        // Update user as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();
        
        console.log('🎉 Email verified for user:', user.email);
        
        res.status(200).json({
            message: "Email verified successfully! You can now login to your account.",
            isVerified: true
        });
        
    } catch (error) {
        console.error('❌ Email verification error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in",
                emailVerified: false
            });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Login successful
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Test endpoint
app.get('/', (req, res) => {
    res.send('✅ Email Verification API is running...');
});

// Start server
async function startServer() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📧 Email verification system ready!`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
