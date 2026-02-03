import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';

import { getProducts } from './services/api/customerProductService';
import { getHomeContent } from './services/api/customerHomeService';
import { useLocation } from './hooks/useLocation';

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { location } = useLocation();
  const searchQuery = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [cookingIdeas, setCookingIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const params = { search: searchQuery };
        if (location?.latitude && location?.longitude) {
          params.latitude = location.latitude;
          params.longitude = location.longitude;
        }
        const response = await getProducts(params);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, location]);

  // Fetch trending/home content for initial view
  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        const response = await getHomeContent(
          undefined,
          location?.latitude,
          location?.longitude
        );
        if (response.success && response.data) {
          setTrendingItems(response.data.trending || []);
          setCookingIdeas(response.data.cookingIdeas || []);
        }
      } catch (error) {
        console.error("Error fetching search initial content", error);
      } finally {
        setContentLoading(false);
      }
    };

    if (!searchQuery.trim()) {
      fetchInitialContent();
    }
  }, [searchQuery, location?.latitude, location?.longitude]);

  return (
    <div className="pb-24 md:pb-8 bg-white min-h-screen">
      {/* Search Bar Placeholder or content */}
      <div className="px-4 py-4 md:px-6 md:py-6 border-b border-neutral-100 sticky top-0 bg-white z-10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
        <div className="flex-1 text-lg font-bold">Search Products</div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6">
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  categoryStyle={true}
                  showBadge={true}
                  showPackBadge={false}
                  showStockInfo={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 text-neutral-500">
              <p className="text-lg md:text-xl mb-2">No products found</p>
              <p className="text-sm md:text-base">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Trending in your city */}
      {!searchQuery.trim() && (
        <>
          {contentLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          {!contentLoading && trendingItems.length > 0 && (
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
              <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6">Trending in your city</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                {trendingItems.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="bg-white rounded-lg border-2 border-green-600 p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(item.type === 'category' ? `/grocery/category/${item.id || item._id}` : `/grocery/product/${item.id || item._id}`)}
                  >
                    <div className="w-full h-24 rounded-lg mb-2 overflow-hidden bg-neutral-50 flex items-center justify-center">
                      {(item.image || item.imageUrl) ? (
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain bg-white rounded-sm"
                        />
                      ) : (
                        <div className="text-4xl">🔥</div>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-neutral-900 text-center line-clamp-2">
                      {item.name || item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* See all products */}
          <div className="px-4 md:px-6 lg:px-8 py-2 md:py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 cursor-pointer" onClick={() => navigate('/grocery/categories')}>
              <span className="text-sm md:text-base text-neutral-700 font-medium whitespace-nowrap">Browse all categories ▸</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
