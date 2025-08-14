// Real email service with Gmail SMTP
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter with fallback
const createTransporter = async () => {
    // Try Gmail first
    if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== '"#Rachael"' && process.env.EMAIL_PASS.length >= 16) {
        console.log('📧 Using Gmail SMTP...');
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: 'gmail',
            secure: false,
            auth: {
                user:process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Use Ethereal Email for testing (creates temporary test accounts)
        console.log('⚠️  Gmail not properly configured. Using test email service...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log('✅ Test email account created:', testAccount.user);

            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        } catch (error) {
            console.log('❌ Failed to create test account, using console simulation');
            return null;
        }
    }
};

// Send email verification
const sendVerificationEmail = async (email, verificationToken, fullname) => {
    try {
        const transporter = await createTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"Palm Island Football Academy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Registration Confirmation from Palm Island Football Academy',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2563eb; margin-bottom: 10px;">🏆 Palm Island Football Academy</h1>
                        <h2 style="color: #333; margin-top: 0;">Welcome ${fullname}!</h2>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                           Thank you for joining Palm Island Football Academy!
                        </p>
                    </div>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

                    <div style="text-align: center;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            If you didn't create an account with us, please ignore this email.
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        // Handle case where no transporter is available
        if (!transporter) {
            console.log('\n📧 ===== EMAIL SIMULATION =====');
            console.log(`To: ${email}`);
            console.log(`Subject: Email Verification - Palm Island Football Academy`);
            console.log(`Verification URL: ${verificationUrl}`);
            console.log('================================\n');
            return { success: true, messageId: 'simulated-' + Date.now() };
        }

        console.log(`📧 Sending verification email to: ${email}`);
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);

        // If using test email service, show preview URL
        if (result.messageId && result.messageId.includes('@ethereal.email')) {
            const previewUrl = nodemailer.getTestMessageUrl(result);
            console.log('📧 Preview email at:', previewUrl);
        }

        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, fullname) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Palm Island Football Academy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Welcome to Palm Island Football Academy - Email Verified!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #059669; margin-bottom: 10px;">🎉 Welcome to the Team!</h1>
                        <h2 style="color: #333; margin-top: 0;">Hello ${fullname}!</h2>
                    </div>

                    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #059669;">
                        <p style="color: #065f46; font-size: 16px; line-height: 1.6; margin: 0;">
                            <strong>Congratulations!</strong> Your email has been successfully verified and your account is now active.
                        </p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
                           style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                            🔐 Login to Your Account
                        </a>
                    </div>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

                    <div style="text-align: center;">
                        <p style="color: #374151; font-size: 14px;">
                            Thank you for joining Palm Island Football Academy!
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        console.log(`🎉 Sending welcome email to: ${email}`);
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent successfully! Message ID: ${result.messageId}`);

        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail
};
