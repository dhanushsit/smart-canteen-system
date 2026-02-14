import api from './api';

export const getProducts = async () => {
    return api.get('/products');
};

export const createProduct = async (productData) => {
    return api.post('/products', productData);
};

export const updateProduct = async (id, productData) => {
    return api.put(`/products/${id}`, productData);
};

export const updateStock = async (productId, stock) => {
    return api.patch(`/products/${productId}/stock`, { stock });
};

export const deleteProduct = async (id) => {
    return api.delete(`/products/${id}`);
};
