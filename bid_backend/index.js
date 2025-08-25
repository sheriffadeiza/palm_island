import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Schema, model, connect } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import sendWelcomeEmail from './services/emailService';



config();

// User Schema
const UserSchema = Schema({
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

const User = model("Users", UserSchema);

// Player Schema
import { Player } from './model/player.model.js'; 

// Training and Match Schemas
import { TrainingSession } from './model/training.model.js';
import { Match } from './model/match.model.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://project-neon-rho.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(json());


// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration request received');

        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);

        const verificationToken = randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: true  // Auto-verify users upon registration
        });

        console.log('✅ User created:', newUser._id);

        // Send welcome email (no verification needed)
        const emailResult = await sendWelcomeEmail(email, fullname);

        if (emailResult.success) {
            console.log('✅ Welcome email sent successfully');
        } else {
            console.error('❌ Failed to send welcome email:', emailResult.error);
        }

        // Always return success since user is auto-verified
        res.status(201).json({
            message: "Registration successful! Welcome to Palm Island Football Academy. You can now login to your account.",
            userId: newUser._id
        });

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

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        console.log('🎉 Email verified for user:', user.email);

        // Send welcome email
        const { sendWelcomeEmail } = require('./services/emailService').default;
        const welcomeResult = await sendWelcomeEmail(user.email, user.fullname);

        if (welcomeResult.success) {
            console.log('✅ Welcome email sent successfully');
        } else {
            console.error('❌ Failed to send welcome email:', welcomeResult.error);
        }

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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Email verification check removed - users are auto-verified upon registration

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

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

// Resend verification email endpoint
app.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // All users are now auto-verified, so just send a welcome email
        const { sendWelcomeEmail } = require('./services/emailService').default;
        const emailResult = await sendWelcomeEmail(email, user.fullname);

        if (emailResult.success) {
            res.status(200).json({
                message: "Welcome email sent successfully! Your account is already active."
            });
        } else {
            console.error('❌ Failed to send welcome email:', emailResult.error);
            res.status(500).json({
                message: "Failed to send welcome email. Please try again later."
            });
        }

    } catch (error) {
        console.error('❌ Resend verification error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Player Management Endpoints

// Get all players for a coach
app.get('/players/:coachId', async (req, res) => {
    try {
        const { coachId } = req.params;

        const players = await Player.find({ coachId, isActive: true })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Players retrieved successfully",
            players: players
        });
    } catch (error) {
        console.error('❌ Error fetching players:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Add new player
app.post('/players', async (req, res) => {
    try {
        const {
            fullname, email, age, position, phoneNumber,
            emergencyContact, medicalInfo, coachId, notes
        } = req.body;

        // Validate required fields
        if (!fullname || !email || !age || !position || !phoneNumber || !coachId) {
            return res.status(400).json({
                message: "Required fields: fullname, email, age, position, phoneNumber, coachId"
            });
        }

        // Check if player email already exists
        const existingPlayer = await Player.findOne({ email });
        if (existingPlayer) {
            return res.status(400).json({ message: "Player with this email already exists" });
        }

        // Verify coach exists
        const coach = await User.findById(coachId);
        if (!coach || coach.role !== 'coach') {
            return res.status(400).json({ message: "Invalid coach ID" });
        }

        const newPlayer = await Player.create({
            fullname,
            email,
            age,
            position,
            phoneNumber,
            emergencyContact: emergencyContact || { name: '', phone: '', relationship: '' },
            medicalInfo: medicalInfo || { allergies: 'None', medications: 'None', conditions: 'None' },
            coachId,
            notes: notes || ''
        });

        console.log('✅ Player created:', newPlayer._id);

        res.status(201).json({
            message: "Player added successfully!",
            player: newPlayer
        });

    } catch (error) {
        console.error('❌ Error adding player:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Update player
app.put('/players/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const updateData = req.body;

        const updatedPlayer = await Player.findByIdAndUpdate(
            playerId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.status(200).json({
            message: "Player updated successfully",
            player: updatedPlayer
        });

    } catch (error) {
        console.error('❌ Error updating player:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Delete player (soft delete)
app.delete('/players/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;

        const updatedPlayer = await Player.findByIdAndUpdate(
            playerId,
            { isActive: false },
            { new: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.status(200).json({
            message: "Player removed successfully"
        });

    } catch (error) {
        console.error('❌ Error removing player:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Training Session Management Endpoints

// Get all training sessions for a coach
app.get('/training/:coachId', async (req, res) => {
    try {
        const { coachId } = req.params;

        const sessions = await TrainingSession.find({ coachId })
            .populate('participants.playerId', 'fullname position')
            .sort({ date: -1 });

        res.status(200).json({
            message: "Training sessions retrieved successfully",
            sessions: sessions
        });
    } catch (error) {
        console.error('❌ Error fetching training sessions:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Add new training session
app.post('/training', async (req, res) => {
    try {
        const {
            title, description, date, startTime, endTime, location,
            type, intensity, maxParticipants, equipment, objectives,
            coachId, notes, isRecurring, recurringPattern
        } = req.body;

        // Validate required fields
        if (!title || !description || !date || !startTime || !endTime || !location || !type || !coachId) {
            return res.status(400).json({
                message: "Required fields: title, description, date, startTime, endTime, location, type, coachId"
            });
        }

        // Verify coach exists
        const coach = await User.findById(coachId);
        if (!coach || coach.role !== 'coach') {
            return res.status(400).json({ message: "Invalid coach ID" });
        }

        const newSession = await TrainingSession.create({
            title,
            description,
            date,
            startTime,
            endTime,
            location,
            type,
            intensity: intensity || 'Medium',
            maxParticipants: maxParticipants || 25,
            equipment: equipment || [],
            objectives: objectives || [],
            coachId,
            notes: notes || '',
            isRecurring: isRecurring || false,
            recurringPattern: recurringPattern || {}
        });

        console.log('✅ Training session created:', newSession._id);

        res.status(201).json({
            message: "Training session created successfully!",
            session: newSession
        });

    } catch (error) {
        console.error('❌ Error creating training session:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Update training session
app.put('/training/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const updateData = req.body;

        const updatedSession = await TrainingSession.findByIdAndUpdate(
            sessionId,
            updateData,
            { new: true, runValidators: true }
        ).populate('participants.playerId', 'fullname position');

        if (!updatedSession) {
            return res.status(404).json({ message: "Training session not found" });
        }

        res.status(200).json({
            message: "Training session updated successfully",
            session: updatedSession
        });

    } catch (error) {
        console.error('❌ Error updating training session:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Delete training session
app.delete('/training/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const deletedSession = await TrainingSession.findByIdAndDelete(sessionId);

        if (!deletedSession) {
            return res.status(404).json({ message: "Training session not found" });
        }

        res.status(200).json({
            message: "Training session deleted successfully"
        });

    } catch (error) {
        console.error('❌ Error deleting training session:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Match Management Endpoints

// Get all matches for a coach
app.get('/matches/:coachId', async (req, res) => {
    try {
        const { coachId } = req.params;

        const matches = await Match.find({ coachId })
            .populate('squad.playerId', 'fullname position')
            .populate('events.playerId', 'fullname')
            .sort({ date: -1 });

        res.status(200).json({
            message: "Matches retrieved successfully",
            matches: matches
        });
    } catch (error) {
        console.error('❌ Error fetching matches:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Add new match
app.post('/matches', async (req, res) => {
    try {
        const {
            title, opponent, date, time, venue, type, ageGroup,
            coachId, notes, importance, preparation
        } = req.body;

        // Validate required fields
        if (!title || !opponent?.name || !date || !time || !venue?.name || !venue?.address || !type || !ageGroup || !coachId) {
            return res.status(400).json({
                message: "Required fields: title, opponent.name, date, time, venue.name, venue.address, type, ageGroup, coachId"
            });
        }

        // Verify coach exists
        const coach = await User.findById(coachId);
        if (!coach || coach.role !== 'coach') {
            return res.status(400).json({ message: "Invalid coach ID" });
        }

        const newMatch = await Match.create({
            title,
            opponent,
            date,
            time,
            venue,
            type,
            ageGroup,
            coachId,
            notes: notes || '',
            importance: importance || 'Medium',
            preparation: preparation || {}
        });

        console.log('✅ Match created:', newMatch._id);

        res.status(201).json({
            message: "Match created successfully!",
            match: newMatch
        });

    } catch (error) {
        console.error('❌ Error creating match:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Update match
app.put('/matches/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        const updateData = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            matchId,
            updateData,
            { new: true, runValidators: true }
        ).populate('squad.playerId', 'fullname position')
         .populate('events.playerId', 'fullname');

        if (!updatedMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.status(200).json({
            message: "Match updated successfully",
            match: updatedMatch
        });

    } catch (error) {
        console.error('❌ Error updating match:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

// Delete match
app.delete('/matches/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;

        const deletedMatch = await Match.findByIdAndDelete(matchId);

        if (!deletedMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.status(200).json({
            message: "Match deleted successfully"
        });

    } catch (error) {
        console.error('❌ Error deleting match:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});

app.get('/', (req, res) => {
    res.send('✅ Palm Island Football Academy API is running...');
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
