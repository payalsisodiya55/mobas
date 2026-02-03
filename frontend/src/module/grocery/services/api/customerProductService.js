import groceryAPI from "../../../../lib/groceryApi";
import { apiCache } from "../../utils/apiCache";

/**
 * Get products with filters (Public)
 * Location (latitude/longitude) is required to filter products by seller's service radius
 */
export const getProducts = async (params) => {
    const response = await groceryAPI.get('/customer/products', { params });
    return response.data;
};

/**
 * Get product details by ID (Public)
 * Location (latitude/longitude) is required to verify product availability
 */
export const getProductById = async (id, latitude, longitude) => {
    const params = {};
    if (latitude !== undefined && longitude !== undefined) {
        params.latitude = latitude;
        params.longitude = longitude;
    }
    const response = await groceryAPI.get(`/customer/products/${id}`, { params });
    return response.data;
};

/**
 * Get category details by ID or slug (Public)
 */
export const getCategoryById = async (id) => {
    const response = await groceryAPI.get(`/customer/categories/${id}`);
    return response.data;
};

/**
 * Get all categories (Public)
 */
export const getCategories = async (tree = false) => {
    const cacheKey = `customer-categories-${tree ? 'tree' : 'list'}`;
    return apiCache.getOrFetch(
        cacheKey,
        async () => {
    const url = tree ? '/customer/categories/tree' : '/customer/categories';
    const response = await groceryAPI.get(url);
    return response.data;
        },
        10 * 60 * 1000 // 10 minutes cache
    );
};

export default {
    getProducts,
    getProductById,
    getCategoryById,
    getCategories
};
