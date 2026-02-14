const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get all users
router.get('/', (req, res) => {
    const users = db.users.getAll().map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
    res.json(users);
});

// Create user
router.post('/', (req, res) => {
    const { name, email, password, role, balance } = req.body;
    let users = db.users.getAll();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        password, // In real app, hash this
        role: role || 'student',
        balance: parseFloat(balance) || 0,

    };

    db.users.create(newUser);
    res.status(201).json(newUser);
});

// Update user
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, role, balance } = req.body;

    let users = db.users.getAll();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        role: role || users[userIndex].role,
        balance: balance !== undefined ? parseFloat(balance) : users[userIndex].balance,

    };

    db.users.save(users);
    res.json(users[userIndex]);
});

// Delete user
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let users = db.users.getAll();
    const filteredUsers = users.filter(u => u.id !== id);

    if (users.length === filteredUsers.length) {
        return res.status(404).json({ message: 'User not found' });
    }

    db.users.save(filteredUsers);
    res.json({ message: 'User deleted successfully' });
});

module.exports = router;
