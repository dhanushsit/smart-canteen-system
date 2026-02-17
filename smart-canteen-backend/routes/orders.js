const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// Get all orders (for distributor/admin)
router.get('/', async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user orders', error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const { userId, items, total, isTestMode } = req.body;

    // 1. Check stock availability for ALL items first
    // This part is critical to prevent race conditions or partial updates in a simple client impl
    // Ideally, use a PostgreSQL function (RPC) for atomic transactions.
    // For now, we'll do best-effort validation.

    try {
        // Fetch current stock for all requested items
        const itemIds = items.map(i => i.id);
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('id, name, stock')
            .in('id', itemIds);

        if (productError) throw productError;

        const outOfStockItems = [];
        const productsMap = new Map(products.map(p => [p.id, p]));

        items.forEach(orderItem => {
            const product = productsMap.get(orderItem.id);
            if (!product || product.stock < orderItem.qty) {
                outOfStockItems.push(orderItem.name);
            }
        });

        if (outOfStockItems.length > 0) {
            return res.status(400).json({
                message: `The following items are out of stock or have insufficient quantity: ${outOfStockItems.join(', ')}`
            });
        }

        // 2. Deduct stock sequentially (Naive approach without transactions)
        for (const item of items) {
            const product = productsMap.get(item.id);
            await supabase
                .from('products')
                .update({ stock: product.stock - item.qty })
                .eq('id', item.id);
        }

        // 3. Generate Order ID
        const prefix = isTestMode ? 'SAM' : 'ORD';
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

        // Count today's orders for sequence number
        // Note: This is not race-condition proof without a DB sequence, but works for low traffic
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('date', startOfDay)
            .lte('date', endOfDay)
            .like('id', `${prefix}%`);

        if (countError) console.error('Error counting orders:', countError); // Non-critical, just risk duplicate ID

        const nextNumber = String((count || 0) + 1).padStart(2, '0');
        const orderId = `${prefix}-${dateStr}-${nextNumber}-${crypto.randomUUID().slice(0, 4)}`; // Extra random suffix for safety

        const newOrder = {
            id: orderId,
            user_id: userId,
            items: items, // JSONB
            total: total,
            status: 'Pending',
            date: new Date().toISOString(),
            // paymentMode: isTestMode ? 'Test Mode' : 'Razorpay' // Add column if needed
        };

        const { data: savedOrder, error: insertError } = await supabase
            .from('orders')
            .insert([newOrder])
            .select()
            .single();

        if (insertError) throw insertError;

        // Fetch User for notification name
        const { data: user } = await supabase.from('users').select('name').eq('id', userId).single();

        // Trigger real-time notification
        if (req.io) {
            req.io.emit('order_received', {
                orderId: savedOrder.id,
                userName: user ? user.name : 'Unknown User',
                total: savedOrder.total
            });
        }

        res.status(201).json(savedOrder);

    } catch (err) {
        console.error('Order Creation Error:', err);
        res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
});

// Update order status (for distributor)
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Get old status to check for changes
        const { data: existingOrder, error: findError } = await supabase
            .from('orders')
            .select('status, user_id')
            .eq('id', id)
            .single();

        if (findError || !existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = existingOrder.status;

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        // Trigger real-time notification
        if (req.io && oldStatus !== status) {
            console.log(`Emitting status update for order ${id}: ${oldStatus} -> ${status}`);
            req.io.emit('order_status_updated', {
                orderId: updatedOrder.id,
                userId: String(updatedOrder.user_id),
                status: status
            });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error updating order status', error: err.message });
    }
});

module.exports = router;
