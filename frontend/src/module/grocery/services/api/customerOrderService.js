import groceryAPI from "../../../../lib/groceryApi";

export const getOrders = async () => {
    const response = await groceryAPI.get('/customer/orders');
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await groceryAPI.get(`/customer/orders/${orderId}`);
    return response.data;
};

export const placeOrder = async (orderData) => {
    const response = await groceryAPI.post('/customer/orders', orderData);
    return response.data;
};

export default {
    getOrders,
    getOrderById,
    placeOrder
};
