import groceryAPI from "../../../../lib/groceryApi";

export const getProfile = async () => {
    const response = await groceryAPI.get('/customer/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await groceryAPI.put('/customer/profile', profileData);
    return response.data;
};

export const getAddresses = async () => {
    const response = await groceryAPI.get('/customer/addresses');
    return response.data;
};

export const addAddress = async (addressData) => {
    const response = await groceryAPI.post('/customer/addresses', addressData);
    return response.data;
};

export const deleteAddress = async (addressId) => {
    const response = await groceryAPI.delete(`/customer/addresses/${addressId}`);
    return response.data;
};

export default {
    getProfile,
    updateProfile,
    getAddresses,
    addAddress,
    deleteAddress
};
