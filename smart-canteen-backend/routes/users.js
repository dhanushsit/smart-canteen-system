const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;

        // Strip passwords
        const sanitizedUsers = users.map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });

        res.json(sanitizedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    const { name, email, password, role, balance } = req.body;

    try {
        // Check if email already exists
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            balance: parseFloat(balance) || 0,
            verified: true
        };

        const { data, error } = await supabase
            .from('users')
            .insert([newUser])
            .select();

        if (error) throw error;

        // Remove password from response
        const { password: _, ...userResponse } = data[0];
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, balance } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (balance !== undefined) updates.balance = parseFloat(balance);

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'User not found' });

        const { password: _, ...userResponse } = data[0];
        res.json(userResponse);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
