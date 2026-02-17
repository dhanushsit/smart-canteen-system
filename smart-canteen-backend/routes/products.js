const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    const { name, price, category, image, stock } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    try {
        const newProduct = {
            id: crypto.randomUUID(),
            name,
            price: parseFloat(price),
            category,
            image: image || '',
            stock: parseInt(stock) || 0
        };

        const { data, error } = await supabase
            .from('products')
            .insert([newProduct])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, image, stock } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (price !== undefined) updates.price = parseFloat(price);
        if (category) updates.category = category;
        if (image !== undefined) updates.image = image;
        if (stock !== undefined) updates.stock = parseInt(stock);

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'Product not found' });

        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});

// Update stock only
router.patch('/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    try {
        const { data, error } = await supabase
            .from('products')
            .update({ stock: parseInt(stock) })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'Product not found' });

        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error updating stock', error: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});

module.exports = router;
