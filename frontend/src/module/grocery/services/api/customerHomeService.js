import groceryAPI from "../../../../lib/groceryApi";
import { apiCache } from "../../utils/apiCache";

/**
 * Get home page content with caching
 * @param headerCategorySlug - Optional header category slug to filter categories (e.g., 'winter', 'wedding')
 */
export const getHomeContent = async (
  headerCategorySlug,
  latitude,
  longitude,
  useCache = true,
  cacheTTL = 5 * 60 * 1000, // 5 minutes
  skipLoader = false
) => {
  const cacheKey = `home-content-${headerCategorySlug || 'all'}-${latitude || 0}-${longitude || 0}`;

  const fetchFn = async () => {
    const params = headerCategorySlug ? { headerCategorySlug } : {};
    if (latitude !== undefined && longitude !== undefined) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    const response = await groceryAPI.get("/customer/home", {
      params,
      skipLoader
    });
    return response.data;
  };

  if (useCache) {
    return apiCache.getOrFetch(cacheKey, fetchFn, cacheTTL);
  }

  return fetchFn();
};

/**
 * Get products for a specific "shop" (e.g. Spiritual Store)
 */
export const getStoreProducts = async (
  storeId,
  latitude,
  longitude
) => {
  const params = {};
  if (latitude !== undefined && longitude !== undefined) {
    params.latitude = latitude;
    params.longitude = longitude;
  }
  const response = await groceryAPI.get(`/customer/home/store/${storeId}`, { params });
  return response.data;
};

export default {
  getHomeContent,
  getStoreProducts
};
