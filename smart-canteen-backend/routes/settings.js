const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// Get all settings
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;

        // Return defaults if no settings found (though migration should have inserted them)
        if (!data) {
            return res.json({ breakfast: true, lunch: true, dinner: true, snacks: true });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching settings', error: err.message });
    }
});

// Update settings
router.patch('/', async (req, res) => {
    try {
        const updates = req.body;

        // Ensure we are updating row with ID 1
        const { data, error } = await supabase
            .from('settings')
            .update(updates)
            .eq('id', 1)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error updating settings', error: err.message });
    }
});

module.exports = router;
