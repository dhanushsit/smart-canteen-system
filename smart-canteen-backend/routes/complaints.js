const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// Get all complaints (for admin)
router.get('/', async (req, res) => {
    try {
        const { data: complaints, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching complaints', error: err.message });
    }
});

// Submit a new complaint (for student)
router.post('/', async (req, res) => {
    const { name, email, contact, message, photo } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    try {
        const newComplaint = {
            id: `COMP-${Date.now()}`,
            user_id: null, // Optional: link to logged in user if available
            message,
            status: 'Unread',
            // Note: Schema might need updates if you want to store name/email separately 
            // or just rely on the message content. For now, assuming schema supports these or we map them.
            // Based on previous schema: id, user_id, message, status, created_at.
            // To support 'name' and 'email' for anonymous/guest complaints, 
            // we should ideally add columns or pack them into 'message' or a metadata jsonb column.
            // checking schema: 
            // create table public.complaints (id text, user_id text, message text, status text, ...)
            // It seems the schema in Step 198 was minimal. 
            // I'll combine contact info into the message for safety or rely on user_id if logged in.
            // BUT, the frontend sends name/email/contact. 
            // Let's assume for now we append them to the message or the user adds columns.
            // Better strategy for migration continuity: Append to message for now.
            message: `[From: ${name} (${email}, ${contact || 'No Contact'})] ${message}`
        };

        const { data, error } = await supabase
            .from('complaints')
            .insert([newComplaint])
            .select()
            .single();

        if (error) throw error;

        // Trigger real-time notification to admin
        if (req.io) {
            req.io.emit('new_complaint', {
                id: newComplaint.id,
                name: name,
                message: message
            });
        }

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error submitting complaint', error: err.message });
    }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('complaints')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'Complaint not found' });

        res.json({ message: 'Complaint deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting complaint', error: err.message });
    }
});

module.exports = router;
