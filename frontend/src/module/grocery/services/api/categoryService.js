import groceryAPI from "../../../../lib/groceryApi";
import { apiCache } from "../../utils/apiCache";

/**
 * Get all categories (parent categories only by default)
 * Cached for 10 minutes as categories don't change frequently
 */
export const getCategories = async (params) => {
  const cacheKey = `categories-${JSON.stringify(params || {})}`;
  return apiCache.getOrFetch(
    cacheKey,
    async () => {
      const response = await groceryAPI.get("/categories", {
        params,
      });
      return response.data;
    },
    10 * 60 * 1000 // 10 minutes cache
  );
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id) => {
  const response = await groceryAPI.get(`/categories/${id}`);
  return response.data;
};

/**
 * Get subcategories by parent category ID
 */
export const getSubcategories = async (categoryId, params) => {
  const response = await groceryAPI.get(
    `/categories/${categoryId}/subcategories`,
    { params }
  );
  return response.data;
};

/**
 * Get sub-subcategories by subcategory ID
 */
export const getSubSubCategories = async (subCategoryId, params) => {
  const response = await groceryAPI.get(
    `/categories/${subCategoryId}/sub-subcategories`,
    { params }
  );
  return response.data;
};

/**
 * Get all subcategories (across all categories)
 */
export const getAllSubcategories = async (params) => {
  const response = await groceryAPI.get(
    "/categories/subcategories",
    { params }
  );
  return response.data;
};

/**
 * Get all categories with nested subcategories
 */
export const getAllCategoriesWithSubcategories = async () => {
  const response = await groceryAPI.get(
    "/categories/all-with-subcategories"
  );
  return response.data;
};

/**
 * Get public header categories
 */
export const getHeaderCategoriesPublic = async () => {
  const response = await groceryAPI.get("/customer/categories");
  return response.data?.success ? response.data.data : [];
};

export default {
  getCategories,
  getCategoryById,
  getSubcategories,
  getSubSubCategories,
  getAllSubcategories,
  getAllCategoriesWithSubcategories,
  getHeaderCategoriesPublic
};
