import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "./components/HomeHero";
import PromoStrip from "./components/PromoStrip";
import LowestPricesEver from "./components/LowestPricesEver";
import CategoryTileSection from "./components/CategoryTileSection";
import FeaturedThisWeek from "./components/FeaturedThisWeek";
import ProductCard from "./components/ProductCard";

import { getHomeContent } from "./services/api/customerHomeService";
import { getHeaderCategoriesPublic } from "./services/api/categoryService";
import { useLocation } from "./hooks/useLocation";
import { useTheme } from "./hooks/useTheme";

const useLoading = () => ({ startRouteLoading: () => {}, stopRouteLoading: () => {} });
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-neutral-500 font-medium tracking-wide">Growing better for you...</p>
    </div>
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { activeCategory, setActiveCategory } = useTheme();
  const { startRouteLoading, stopRouteLoading } = useLoading();
  const activeTab = activeCategory; 
  const setActiveTab = setActiveCategory;
  const contentRef = useRef(null);
  const scrollHandledRef = useRef(false);
  const SCROLL_POSITION_KEY = 'home-scroll-position';

  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeData, setHomeData] = useState({
    bestsellers: [],
    categories: [],
    homeSections: [], 
    shops: [],
    promoBanners: [],
    trending: [],
    cookingIdeas: [],
  });

  const [products, setProducts] = useState([]);

  // Function to save scroll position before navigation
  const saveScrollPosition = () => {
    const mainElement = document.querySelector('main');
    const scrollPos = Math.max(
      mainElement ? mainElement.scrollTop : 0,
      window.scrollY || 0,
      document.documentElement.scrollTop || 0
    );
    if (scrollPos > 0) {
      sessionStorage.setItem(SCROLL_POSITION_KEY, scrollPos.toString());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        startRouteLoading();
        setLoading(true);
        setError(null);
        // Pass the activeTab as the headerCategorySlug
        const response = await getHomeContent(
          activeTab,
          location?.latitude,
          location?.longitude
        );
        if (response.success && response.data) {
          setHomeData(response.data);

          if (response.data.bestsellers) {
            setProducts(response.data.bestsellers);
          }
        } else {
            // Using mock data for now to show something
            setHomeData({
                bestsellers: [],
                categories: [],
                homeSections: [],
                shops: [],
                lowestPrices: []
            });
        }
      } catch (error) {
        console.error("Failed to fetch home content", error);
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
        stopRouteLoading();
      }
    };

    fetchData();

    const preloadHeaderCategories = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const headerCategories = await getHeaderCategoriesPublic(true);
        const slugsToPreload = ['all', ...headerCategories.map(cat => cat.slug)];

        const batchSize = 2;
        for (let i = 0; i < slugsToPreload.length; i += batchSize) {
          const batch = slugsToPreload.slice(i, i + batchSize);
          await Promise.all(
            batch.map(slug =>
              getHomeContent(
                slug,
                location?.latitude,
                location?.longitude,
                true,
                5 * 60 * 1000,
                true
              ).catch(err => {
                console.debug(`Failed to preload data for ${slug}:`, err);
              })
            )
          );
          if (i + batchSize < slugsToPreload.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      } catch (error) {
        console.debug("Failed to preload header categories:", error);
      }
    };

    preloadHeaderCategories();
  }, [location?.latitude, location?.longitude, activeTab]);

  useEffect(() => {
    if (!loading && homeData.shops) {
      if (scrollHandledRef.current) return;
      scrollHandledRef.current = true;

      const savedScrollPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10);

        const performScroll = () => {
          const mainElement = document.querySelector('main');
          if (mainElement) {
            mainElement.scrollTop = scrollY;
          }
          window.scrollTo(0, scrollY);
        };

        requestAnimationFrame(() => {
          performScroll();
          requestAnimationFrame(() => {
            performScroll();
            setTimeout(performScroll, 100);
            setTimeout(performScroll, 300);
          });
        });

        setTimeout(() => {
          sessionStorage.removeItem(SCROLL_POSITION_KEY);
        }, 1000);
      } else {
        const performReset = () => {
          const mainElement = document.querySelector('main');
          if (mainElement) {
            mainElement.scrollTop = 0;
          }
          window.scrollTo(0, 0);
        };
        requestAnimationFrame(performReset);
        setTimeout(performReset, 100);
      }
    }
  }, [loading, homeData.shops]);

  useEffect(() => {
    const handleNavigationEvent = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.cursor-pointer')) {
        saveScrollPosition();
      }
    };

    window.addEventListener('click', handleNavigationEvent, { capture: true });
    window.addEventListener('touchstart', handleNavigationEvent, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleNavigationEvent, { capture: true });
      window.removeEventListener('touchstart', handleNavigationEvent, { capture: true });
    };
  }, []);

  const getFilteredProducts = (tabId) => {
    if (tabId === "all") {
      return products;
    }
    return products.filter(
      (p) =>
        p.categoryId === tabId ||
        (p.category && (p.category._id === tabId || p.category.slug === tabId))
    );
  };

  const filteredProducts = useMemo(
    () => getFilteredProducts(activeTab),
    [activeTab, products]
  );

  if (loading && !products.length && !homeData.homeSections?.length) {
    return <PageLoader />;
  }

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6 max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0" ref={contentRef}>
      <HomeHero activeTab={activeTab} onTabChange={setActiveTab} />
      <PromoStrip activeTab={activeTab} />
      <LowestPricesEver activeTab={activeTab} products={homeData.lowestPrices} />

      <div className="bg-emerald-50/30 -mt-2 pt-1 space-y-5 md:space-y-8 md:pt-4">
        {homeData.homeSections && homeData.homeSections.length > 0 && (
          <>
            {homeData.homeSections.map((section) => {
              const columnCount = Number(section.columns) || 4;

              if (section.displayType === "products" && section.data && section.data.length > 0) {
                const gridClass = {
                  2: "grid-cols-2",
                  3: "grid-cols-3",
                  4: "grid-cols-4",
                  6: "grid-cols-6",
                  8: "grid-cols-8"
                }[columnCount] || "grid-cols-4";

                const isCompact = columnCount >= 4;
                const gapClass = columnCount >= 4 ? "gap-2" : "gap-3 md:gap-4";

                return (
                  <div key={section.id} className="mt-6 mb-6 md:mt-8 md:mb-8">
                    {section.title && (
                      <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6 px-4 md:px-6 lg:px-8 tracking-tight capitalize">
                        {section.title}
                      </h2>
                    )}
                    <div className="px-4 md:px-6 lg:px-8">
                      <div className={`grid ${gridClass} ${gapClass}`}>
                        {section.data.map((product) => (
                          <ProductCard
                            key={product.id || product._id}
                            product={product}
                            categoryStyle={true}
                            showBadge={true}
                            showPackBadge={false}
                            showStockInfo={false}
                            compact={isCompact}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <CategoryTileSection
                  key={section.id}
                  title={section.title}
                  tiles={section.data || []}
                  columns={columnCount}
                  showProductCount={false}
                />
              );
            })}
          </>
        )}

        {activeTab !== "all" && filteredProducts.length > 0 && homeData.homeSections?.length === 0 && (
          <div data-products-section className="mt-6 mb-6 md:mt-8 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6 px-4 md:px-6 lg:px-8 tracking-tight capitalize">
              {activeTab === "grocery" ? "Grocery Items" : activeTab}
            </h2>
            <div className="px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryStyle={true}
                    showBadge={true}
                    showPackBadge={false}
                    showStockInfo={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "all" && (
          <>
            <div className="mt-2 md:mt-4">
              <CategoryTileSection
                title="Bestsellers"
                tiles={
                  homeData.bestsellers && homeData.bestsellers.length > 0
                    ? homeData.bestsellers
                      .slice(0, 6)
                      .map((card) => {
                        return {
                          id: card.id,
                          categoryId: card.categoryId,
                          name: card.name || "Category",
                          productImages: card.productImages || [],
                          productCount: card.productCount || 0,
                        };
                      })
                    : []
                }
                columns={3}
                showProductCount={true}
              />
            </div>

            <FeaturedThisWeek />

            <div className="mb-6 mt-6 md:mb-8 md:mt-8">
              <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6 px-4 md:px-6 lg:px-8 tracking-tight">
                Shop by Store
              </h2>
              <div className="px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4">
                  {(homeData.shops || []).map((tile) => {
                    const hasImages =
                      tile.image ||
                      (tile.productImages &&
                        tile.productImages.filter(Boolean).length > 0);

                    return (
                      <div key={tile.id} className="flex flex-col">
                        <div
                          onClick={() => {
                            const storeSlug =
                              tile.slug || tile.id.replace("-store", "");
                            saveScrollPosition();
                            navigate(`/store/${storeSlug}`);
                          }}
                          className="block bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                          {hasImages ? (
                            <img
                              src={
                                tile.image ||
                                (tile.productImages
                                  ? tile.productImages[0]
                                  : "")
                              }
                              alt={tile.name}
                              className="w-full h-16 object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-16 flex items-center justify-center text-3xl text-neutral-300 ${tile.bgColor || "bg-neutral-50"
                                }`}>
                              {tile.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="mt-1.5 text-center">
                          <span className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-tight">
                            {tile.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
