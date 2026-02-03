import groceryAPI from "../../../../lib/groceryApi";

export const getCart = async (params) => {
    const response = await groceryAPI.get('/customer/cart', { params });
    return response.data;
};

export const addToCart = async (productId, quantity, variation, latitude, longitude) => {
    const response = await groceryAPI.post('/customer/cart/add', {
        productId,
        quantity,
        variation,
        latitude,
        longitude
    });
    return response.data;
};

export const updateCartItem = async (cartItemId, quantity, latitude, longitude) => {
    const response = await groceryAPI.put(`/customer/cart/item/${cartItemId}`, {
        quantity,
        latitude,
        longitude
    });
    return response.data;
};

export const removeFromCart = async (cartItemId, latitude, longitude) => {
    const response = await groceryAPI.delete(`/customer/cart/item/${cartItemId}`, {
        params: { latitude, longitude }
    });
    return response.data;
};

export const clearCart = async () => {
    const response = await groceryAPI.delete('/customer/cart');
    return response.data;
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
