import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

import { getProducts } from "./services/api/customerProductService";
import { getCategoryById } from "./services/api/categoryService";
import { useLocation } from "./hooks/useLocation";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { location: userLocation } = useLocation();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("Type");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Category Details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setCategoryLoading(true);
      setError(null);
      try {
        const response = await getCategoryById(id);
        if (response.success && response.data) {
          const {
            category: cat,
            subcategories: subs,
            currentSubcategory,
          } = response.data;

          let finalSubcategories = subs || [];

          setCategory(cat);
          setSubcategories([
            {
              _id: "all",
              id: "all",
              name: "All",
              icon: "📦",
              isActive: true,
            },
            ...finalSubcategories,
          ]);

          const subcategoryFromUrl = searchParams.get("subcategory");
          if (subcategoryFromUrl) {
            setSelectedSubcategory(subcategoryFromUrl);
          } else if (currentSubcategory) {
            setSelectedSubcategory(
              currentSubcategory._id || currentSubcategory.id
            );
          }
        } else {
          setError("Category not found or failed to load details.");
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Failed to load category information.");
      } finally {
        setCategoryLoading(false);
      }
    };

    if (id) {
      fetchCategoryDetails();
    }
  }, [id, searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { category: category?._id || id };
        if (selectedSubcategory !== "all") {
          params.subcategory = selectedSubcategory;
        }
        if (userLocation?.latitude && userLocation?.longitude) {
          params.latitude = userLocation.latitude;
          params.longitude = userLocation.longitude;
        }

        const response = await getProducts(params);
        if (response.success) {
          const safeProducts = response.data.map((p) => ({
            ...p,
            tags: Array.isArray(p.tags) ? p.tags : [],
            nameParts: p.name ? p.name.toLowerCase().split(" ") : [],
          }));
          setProducts(safeProducts);
        } else {
          setError("Failed to fetch products for this category.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Network error while loading products.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id, selectedSubcategory, category?._id, userLocation]);

  const categoryProducts = products;

  if ((categoryLoading || loading) && !products.length && !category) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (error && !products.length && !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center bg-white">
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

  if (!category && !categoryLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
          Category not found
        </h1>
        <p className="text-neutral-600 md:text-lg">
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex bg-white h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-24 bg-white border-r border-neutral-100 overflow-y-auto scrollbar-hide flex-shrink-0 py-2">
        <div className="space-y-1">
          {subcategories.map((subcat) => {
            const isSelected =
              selectedSubcategory === (subcat.id || subcat._id);
            return (
              <button
                key={subcat.id || subcat._id}
                type="button"
                onClick={() => setSelectedSubcategory(subcat.id || subcat._id)}
                className={`w-full flex flex-col items-center justify-center py-2 relative transition-all duration-200 group ${isSelected ? "bg-green-50" : "hover:bg-neutral-50"
                  }`}
                style={{ minHeight: "80px" }}>
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-green-600 rounded-r-full"></div>
                )}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-1.5 flex-shrink-0 overflow-hidden transition-all duration-200 shadow-sm ${isSelected
                      ? "ring-2 ring-green-600 ring-offset-2 bg-white"
                      : "bg-neutral-50 border border-neutral-100 group-hover:shadow-md"
                    }`}>
                  {subcat.image ? (
                    <img src={subcat.image} alt={subcat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{subcat.icon || "📦"}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] text-center leading-tight px-1 transition-colors ${isSelected
                      ? "font-bold text-green-700"
                      : "text-neutral-500 group-hover:text-neutral-900"
                    }`}
                  style={{
                    wordBreak: "break-word",
                    maxWidth: "100%",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                  {subcat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 flex-shrink-0">
          <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label="Go back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <h1 className="text-base md:text-xl font-bold text-neutral-900">{category?.name}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
          {categoryProducts.length > 0 ? (
            <div className="px-3 md:px-6 lg:px-8 py-4 md:py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                    showHeartIcon={false}
                    showStockInfo={false}
                    showBadge={true}
                    showOptionsText={true}
                    categoryStyle={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12 text-center">
              <p className="text-neutral-500 md:text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
