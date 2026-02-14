import api from './api';

export const createOrder = async (orderData) => {
    return api.post('/orders', orderData);
};

export const getUserOrders = async (userId) => {
    return api.get(`/orders/user/${userId}`);
};

export const getAllOrders = async () => {
    return api.get('/orders');
};

export const updateOrderStatus = async (orderId, status) => {
    return api.patch(`/orders/${orderId}/status`, { status });
};

export const swapOrder = async (orderId, swapData) => {
    return api.patch(`/orders/${orderId}/swap`, swapData);
};
