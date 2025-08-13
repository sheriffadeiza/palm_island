const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./mongo');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Minimal registration endpoint without email
app.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration request received:', req.body);
        
        const { User } = require('./model/user.model');
        const crypto = require('crypto');
        const bcrypt = require('bcryptjs');
        
        const { fullname, email, password, role } = req.body;
        
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
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
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
        
        // Simulate email success
        console.log('📧 Email simulation - Verification URL:');
        console.log(`http://localhost:3000/verify-email?token=${verificationToken}`);
        
        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
            userId: newUser._id,
            verificationToken: verificationToken // For testing only
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Test endpoint
app.get('/', (req, res) => {
    res.send('Minimal server is running...');
});

// Start server
async function startServer() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Minimal server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
