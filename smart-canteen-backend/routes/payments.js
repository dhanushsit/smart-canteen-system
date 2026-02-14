const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: 'rzp_test_SFfFd7GvtIYSn4',
    key_secret: '7pVTa0qmjr3hEvyAPoyufM98',
});

// Create an order
router.post('/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise for INR)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order' });
    }
});

// Verify payment signature
router.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', '7pVTa0qmjr3hEvyAPoyufM98')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ status: 'ok' });
    } else {
        res.status(400).json({ status: 'failed', message: 'Invalid payment signature' });
    }
});

module.exports = router;
