const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const supabase = require('./supabaseClient');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Load local JSON data
const usersPath = path.join(__dirname, '../data/users.json');
const productsPath = path.join(__dirname, '../data/products.json');
const ordersPath = path.join(__dirname, '../data/orders.json');

const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

const seedDatabase = async () => {
    console.log('🌱 Starting Database Seed...');

    // 1. Seed Users
    console.log(`\nProcessing ${users.length} users...`);
    for (const user of users) {
        try {
            // Handle Password Hashing
            let finalPassword = user.password;
            if (!user.password.startsWith('$2')) {
                // If not already hashed (starts with $2), hash it
                finalPassword = await bcrypt.hash(user.password, 10);
            }

            const { error } = await supabase.from('users').upsert({
                id: user.id.toString(), // Ensure string ID
                name: user.name,
                email: user.email,
                phone: user.phone || null,
                password: finalPassword,
                role: user.role,
                balance: user.balance,
                verified: user.verified
            }, { onConflict: 'email' });

            if (error) console.error(`Failed to insert user ${user.name}:`, error.message);
            else console.log(`✓ User synced: ${user.name}`);
        } catch (err) {
            console.error(`Error hashing password for ${user.name}:`, err);
        }
    }

    // 2. Seed Products
    console.log(`\nProcessing ${products.length} products...`);
    for (const product of products) {
        const { error } = await supabase.from('products').upsert({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description,
            stock: product.stock,
            // meals: product.meals // Schema needs 'meals' column (text[] or jsonb)
        }, { onConflict: 'id' });

        if (error) {
            if (error.message.includes('column "stock" does not exist')) {
                console.warn(`⚠️  Schema Error: 'stock' column missing in Supabase. Please run the migration script.`);
            } else {
                console.error(`Failed to insert product ${product.name}:`, error.message);
            }
        } else {
            console.log(`✓ Product synced: ${product.name}`);
        }
    }

    // 3. Seed Orders
    console.log(`\nProcessing ${orders.length} orders...`);
    for (const order of orders) {
        const { error } = await supabase.from('orders').upsert({
            id: order.id,
            user_id: order.userId.toString(),
            items: order.items, // JSONB
            total: order.total,
            status: order.status,
            date: order.date
        }, { onConflict: 'id' });

        if (error) console.error(`Failed to insert order ${order.id}:`, error.message);
        else console.log(`✓ Order synced: ${order.id}`);
    }

    console.log('\n✨ Seeding completed!');
};

seedDatabase();
