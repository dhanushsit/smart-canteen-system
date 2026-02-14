const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get all products
router.get('/', (req, res) => {
    const products = db.products.getAll();
    res.json(products);
});

// Create a new product
router.post('/', (req, res) => {
    const { name, price, category, image, stock } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const products = db.products.getAll();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: parseFloat(price),
        category,
        image: image || '',
        stock: parseInt(stock) || 0
    };

    products.push(newProduct);
    db.products.save(products);

    res.status(201).json(newProduct);
});

// Update a product
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category, image, stock } = req.body;

    let products = db.products.getAll();
    const productIndex = products.findIndex(p => p.id == id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        price: price !== undefined ? parseFloat(price) : products[productIndex].price,
        category: category || products[productIndex].category,
        image: image !== undefined ? image : products[productIndex].image,
        stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock
    };

    products[productIndex] = updatedProduct;
    db.products.save(products);

    res.json(updatedProduct);
});

// Update stock only (existing route, kept for compatibility)
router.patch('/:id/stock', (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    let products = db.products.getAll();
    const productIndex = products.findIndex(p => p.id == id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex].stock = parseInt(stock);
    db.products.save(products);

    res.json(products[productIndex]);
});

// Delete a product
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    let products = db.products.getAll();
    const initialLength = products.length;
    products = products.filter(p => p.id != id);

    if (products.length === initialLength) {
        return res.status(404).json({ message: 'Product not found' });
    }

    db.products.save(products);
    res.json({ message: 'Product deleted' });
});

module.exports = router;
