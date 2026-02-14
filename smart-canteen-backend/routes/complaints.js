const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get all complaints (for admin)
router.get('/', (req, res) => {
    const complaints = db.complaints.getAll();
    res.json(complaints);
});

// Submit a new complaint (for student)
router.post('/', (req, res) => {
    const { name, email, contact, message, photo } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newComplaint = {
        id: `COMP-${Date.now()}`,
        name,
        email,
        contact: contact || 'N/A',
        message,
        photo: photo || '', // Base64 or URL
        date: new Date().toISOString(),
        status: 'Unread'
    };

    db.complaints.create(newComplaint);

    // Trigger real-time notification to admin
    if (req.io) {
        req.io.emit('new_complaint', {
            id: newComplaint.id,
            name: newComplaint.name,
            message: newComplaint.message
        });
    }

    res.status(201).json(newComplaint);
});

// Delete a complaint
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let complaints = db.complaints.getAll();
    const initialLength = complaints.length;
    complaints = complaints.filter(c => c.id !== id);

    if (complaints.length === initialLength) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    db.complaints.save(complaints);
    res.json({ message: 'Complaint deleted' });
});

module.exports = router;
