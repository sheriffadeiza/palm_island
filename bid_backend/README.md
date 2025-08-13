# Bid Backend - Email Verification System

A Node.js/Express backend application for a bidding platform with email verification functionality.

## Features

- User registration with email verification
- Email verification via secure tokens
- Password hashing with bcrypt
- MongoDB integration with Mongoose
- Email sending with Nodemailer
- Resend verification email functionality
- Login with email verification check

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the following environment variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/bid_backend

# Server
PORT=5000

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

### 4. Start the Server

```bash
npm start
# or
node index.js
```

## API Endpoints

### User Registration
```http
POST /register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "bidder"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "userId": "user_id_here"
}
```

### Email Verification
```http
GET /verify-email?token=verification_token_here
```

**Response:**
```json
{
  "message": "Email verified successfully! You can now login to your account.",
  "isVerified": true
}
```

### Resend Verification Email
```http
POST /resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### User Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (if email not verified):**
```json
{
  "message": "Please verify your email before logging in",
  "emailVerified": false
}
```

**Response (successful login):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "bidder",
    "isEmailVerified": true
  }
}
```

## Email Verification Flow

1. **User Registration**: User submits registration form
2. **Account Creation**: User account created with `isEmailVerified: false`
3. **Email Sent**: Verification email sent with unique token
4. **User Clicks Link**: User clicks verification link in email
5. **Email Verified**: Account marked as verified, welcome email sent
6. **Login Allowed**: User can now login to the platform

## Database Schema

### User Model
```javascript
{
  fullname: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (required),
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  timestamps: true
}
```

## Security Features

- Passwords are hashed using bcrypt
- Email verification tokens expire after 24 hours
- Unique verification tokens using crypto.randomBytes
- Email verification required before login
- Input validation and error handling

## Email Templates

The system includes HTML email templates for:
- **Verification Email**: Welcome message with verification button
- **Welcome Email**: Confirmation after successful verification

## Error Handling

- Duplicate email registration prevention
- Token expiration handling
- Email sending failure handling
- Comprehensive error messages

## Future Enhancements

- JWT token-based authentication
- Password reset functionality
- Rate limiting for email sending
- Email template customization
- Multi-language support
