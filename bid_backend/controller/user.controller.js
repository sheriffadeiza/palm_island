import { User } from "../model/user.model.js";
import emailService from "../services/emailService.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";


const { sendVerificationEmail, sendWelcomeEmail } = emailService

export const registerUser = async (req, res) =>{

    const {fullname, email, password, role} = req.body

    try {

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message: "Email already exists"})
        }

        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create user with verification fields
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        })

        // Send verification email
        console.log('📧 Attempting to send verification email...')

        try {
            const emailResult = await sendVerificationEmail(email, verificationToken, fullname)
            console.log('📧 Email result:', emailResult)

            if (emailResult && emailResult.success) {
                res.status(201).json({
                    message: "Registration successful! Please check your email to verify your account.",
                    userId: newUser._id
                })
            } else {
                console.log('❌ Email failed:', emailResult ? emailResult.error : 'Unknown error')
                res.status(201).json({
                    message: "Registration successful, but there was an issue sending the verification email. Please contact support.",
                    userId: newUser._id
                })
            }
        } catch (emailError) {
            console.log('❌ Email service error:', emailError)
            res.status(201).json({
                message: "Registration successful, but there was an issue sending the verification email. Please contact support.",
                userId: newUser._id
            })
        }
 
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({message: error.message ?? "Something went wrong"})
    }

}

     export const verifyEmail = async (req, res) => {
    
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({message: "Verification token is required"})
        }

        // Find user with the verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() } // Token not expired
        })

        if (!user) {
            return res.status(400).json({message: "Invalid or expired verification token"})
        }

        // Update user as verified
        user.isEmailVerified = true
        user.emailVerificationToken = null
        user.emailVerificationExpires = null
        await user.save()

        // Send welcome email
        await sendWelcomeEmail(user.email, user.fullname)

        res.status(200).json({
            message: "Email verified successfully! You can now login to your account.",
            isVerified: true
        })

    } catch (error) {
        console.error('Email verification error:', error)
        res.status(500).json({message: error.message ?? "Something went wrong"})
    }
}

    export const resendVerificationEmail = async(req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({message: "Email is required"})
        }

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        if (user.isEmailVerified) {
            return res.status(400).json({message: "Email is already verified"})
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Update user with new token
        user.emailVerificationToken = verificationToken
        user.emailVerificationExpires = verificationExpires
        await user.save()

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken, user.fullname)

        if (emailResult.success) {
            res.status(200).json({
                message: "Verification email sent successfully! Please check your email."
            })
        } else {
            res.status(500).json({
                message: "Failed to send verification email. Please try again later."
            })
        }

    } catch (error) {
        console.error('Resend verification error:', error)
        res.status(500).json({message: error.message ?? "Something went wrong"})
    }
}

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"})
        }

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in",
                emailVerified: false
            })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid email or password"})
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
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({message: error.message ?? "Something went wrong"})
    }
}