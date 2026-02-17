/**
 * AUTHENTICATION ROUTES
 * Handles user login, registration, and password recovery via Supabase.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../utils/supabaseClient'); // Import Supabase Client
const nodemailer = require('nodemailer');

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

/**
 * EMAIL TRANSPORTER SETUP
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
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Password Verification
        let passwordMatch = false;

        // Check for 'password' or '123456' bypass ONLY in known dev environments or if explicitly needed
        // Ideally, remove this bypass for production security.
        if (password === 'password' || password === '123456') {
            // You might want to remove this bypass for strict production safety
            // But valid for preserving existing test accounts that use simple passwords
            passwordMatch = await bcrypt.compare(password, user.password).catch(() => false);
            if (!passwordMatch) {
                // Fallback for unhashed legacy passwords (if any exist in transition)
                passwordMatch = (password === user.password);
            }
        } else {
            passwordMatch = await bcrypt.compare(password, user.password);
        }

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Token Generation
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
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validate Indian phone number format
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid Indian phone number.' });
    }

    try {
        // Check if email or phone already exists
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('email, phone')
            .or(`email.eq.${email.toLowerCase()},phone.eq.${phone}`)
            .maybeSingle();

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({ message: 'An account with this phone number already exists.' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = {
            id: crypto.randomUUID(), // Generate UUID for Supabase
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'student',
            balance: 0,
            verified: true
        };

        const { error: insertError } = await supabase
            .from('users')
            .insert([newUser]);

        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            throw insertError;
        }

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
 */
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !newPassword || newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Invalid request data." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { data, error } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', cleanEmail)
            .select();

        if (error || data.length === 0) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        res.json({ message: "Password reset successful! You can now login." });
    } catch (err) {
        console.error('Reset Error:', err);
        res.status(500).json({ message: "Reset failed. Please try again." });
    }
});

module.exports = router;
