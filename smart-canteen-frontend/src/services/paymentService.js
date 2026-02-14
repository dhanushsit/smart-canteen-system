import api from './api';

export const createRazorpayOrder = async (orderData) => {
    return api.post('/payment/create-order', orderData);
};

export const verifyRazorpayPayment = async (paymentData) => {
    return api.post('/payment/verify-payment', paymentData);
};
