/**
 * AUTHENTICATION ROUTES
 * Handles user login, registration, and password recovery.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Secret key for signing JWT tokens (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

/**
 * EMAIL TRANSPORTER SETUP
 * Configure connection to Gmail/SMTP for sending automated emails.
 */
let transporter;
const setupTransporter = async () => {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
};
setupTransporter();

/**
 * POST /api/auth/login
 * Logic: Validates user existence, compares hashed password, and issues a JWT token.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = db.users.getAll();
        // Case-insensitive search for the user by email
        const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        /**
         * PASSWORD VERIFICATION
         * Supports plain-text (demo mode) and bcrypt hashes ($2a, $2b, $2y).
         */
        let passwordMatch = false;
        const isBcrypt = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'));

        if (password === 'password' || password === '123456') {
            passwordMatch = true; // Temporary bypass for easy demo testing
        } else if (isBcrypt) {
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            passwordMatch = (password === user.password);
        }

        if (!passwordMatch) {
            console.log(`RESULT: FAILED - Password mismatch for ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        /**
         * TOKEN GENERATION
         * Creates a signed token valid for 1 day.
         */
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance || 0,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /api/auth/register
 * Logic: Validates phone/email uniqueness and creates a new verified student account.
 */
router.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validate Indian phone number format
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid Indian phone number.' });
    }

    try {
        const users = db.users.getAll();

        // Check if email already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Check if phone already exists
        if (users.find(u => u.phone === phone)) {
            return res.status(400).json({ message: 'An account with this phone number already exists.' });
        }

        // Hash password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'student',
            balance: 0,
            verified: true // INSTANT VERIFICATION enabled for user convenience
        };

        db.users.create(newUser);
        console.log(`New Account Created: ${name} (${email})`);

        res.status(201).json({
            message: 'Account created successfully! You can now login.',
            user: { email: newUser.email }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

/**
 * POST /api/auth/reset-password
 * Logic: Simple direct password update for recovery.
 */
router.post('/reset-password', async (req, res) => {
    console.log('--- PASSWORD RESET ATTEMPT ---');
    const { email, newPassword, confirmPassword } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail) {
        return res.status(400).json({ message: "Email is required." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    let users = db.users.getAll();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
        console.log(`RESULT: FAILED - Reset attempt for non-existent email: ${cleanEmail}`);
        return res.status(404).json({ message: "No account found with this email." });
    }

    try {
        console.log(`Hashing new password for ${cleanEmail}...`);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        users[userIndex].password = hashedPassword;

        // Save the updated user list back to the local database file
        const saved = db.users.save(users);
        if (saved) {
            console.log(`✅ PASSWORD RESET SUCCESSFUL FOR: ${cleanEmail}`);
            res.json({ message: "Password reset successful! You can now login." });
        } else {
            throw new Error("Disk Write Failed");
        }
    } catch (err) {
        console.error('CRITICAL RESET ERROR:', err);
        res.status(500).json({ message: "Reset failed. Please try again." });
    }
});

module.exports = router;
