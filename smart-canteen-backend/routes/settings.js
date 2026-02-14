const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get all settings
router.get('/', (req, res) => {
    const settings = db.settings.get();
    res.json(settings);
});

// Update settings
router.patch('/', (req, res) => {
    const currentSettings = db.settings.get();
    const newSettings = { ...currentSettings, ...req.body };
    db.settings.save(newSettings);
    res.json(newSettings);
});

module.exports = router;
