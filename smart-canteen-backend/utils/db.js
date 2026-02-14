/**
 * DATABASE UTILITY
 * Handles reading/writing to local JSON files using Node.js 'fs' module.
 * This acts as a lightweight database for the canteen system.
 */
const fs = require('fs');
const path = require('path');

// Helper to get the absolute path to a JSON data file located in the /data directory
const getDataPath = (filename) => path.join(__dirname, '../data', filename);

/**
 * GENERIC DB OPERATIONS
 * A reusable function template to create standard Read/Write operations for any entity (Users, Orders, etc.).
 */
const createCollection = (filename) => ({
    // Read all records from the JSON file
    getAll: () => {
        try {
            const filePath = getDataPath(filename);
            const dir = path.dirname(filePath);

            // Ensure data directory exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // If file doesn't exist, initialize with an empty array []
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '[]');
                return [];
            }

            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Error reading ${filename}:`, err);
            return [];
        }
    },

    // Overwrite the JSON file with a new array of objects
    save: (data) => {
        try {
            const filePath = getDataPath(filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error(`Error saving ${filename}:`, err);
            return false;
        }
    },

    // Append a single new object to the existing array
    create: (newItem) => {
        try {
            const data = createCollection(filename).getAll();
            data.push(newItem);
            createCollection(filename).save(data);
            return newItem;
        } catch (err) {
            console.error(`Error creating in ${filename}:`, err);
            return null;
        }
    }
});

/**
 * EXPORTED DATA COLLECTIONS
 * Each object maps to a specific JSON file in the /data folder.
 * These are imported by routes to perform database operations.
 */
module.exports = {
    // User login accounts, roles, and digital balances
    users: createCollection('users.json'),

    // Menu items, prices, descriptions, and stock availability
    products: createCollection('products.json'),

    // Transaction history including items, total cost, and order status
    orders: createCollection('orders.json'),

    // System-wide configurations (e.g., Opening/Closing specific canteen services)
    settings: {
        ...createCollection('settings.json'),
        get: () => {
            try {
                const filePath = getDataPath('settings.json');
                if (!fs.existsSync(filePath)) {
                    const defaultSettings = { breakfast: true, lunch: true, dinner: true, snacks: true };
                    fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2));
                    return defaultSettings;
                }
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            } catch (err) {
                return { breakfast: true, lunch: true, dinner: true, snacks: true };
            }
        }
    },

    // Student feedback logs and reported technical issues
    complaints: createCollection('complaints.json')
};
