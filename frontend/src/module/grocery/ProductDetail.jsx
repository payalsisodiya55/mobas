import {
  useParams,
  useNavigate,
  useLocation as useRouterLocation,
} from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from './context/GroceryCartContext';
import { useLocation } from './hooks/useLocation';
import { getProductById } from './services/api/customerProductService';
import { calculateProductPrice } from './utils/priceUtils';

const useLoading = () => ({ startLoading: () => {}, stopLoading: () => {} });
const Button = ({ children, onClick, className }) => <button onClick={onClick} className={`px-4 py-3 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl transition-all font-bold ${className}`}>{children}</button>;
const Badge = ({ children, className }) => <span className={`px-2 py-1 rounded-full text-xs ${className}`}>{children}</span>;
const StarRating = () => <div>⭐⭐⭐⭐⭐</div>;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { cart, addToCart, updateQuantity } = useCart();
  const { location } = useLocation();
  const { startLoading, stopLoading } = useLoading();
  const addButtonRef = useRef(null);
  const [isProductDetailsExpanded, setIsProductDetailsExpanded] =
    useState(false);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvailableAtLocation, setIsAvailableAtLocation] =
    useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      startLoading();
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          const productData = response.data;
          setProduct({
            ...productData,
            id: productData._id || productData.id,
            name: productData.productName || productData.name || "Product",
            imageUrl: productData.mainImage || productData.imageUrl || "",
          });
          setSimilarProducts(response.data.similarProducts || []);
        } else {
          setProduct(null);
          setError(response.message || "Product not found");
        }
      } catch (error) {
          console.error("Failed to fetch product", error);
          setError("Something went wrong");
      } finally {
          setLoading(false);
          stopLoading();
      }
    };
    fetchProduct();
  }, [id]);

  if (loading && !product) return <div className="p-10 text-center">Loading product...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
       <header className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b">
         <button onClick={() => navigate(-1)} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </button>
         <h1 className="font-bold truncate max-w-[200px]">{product.name}</h1>
         <div className="w-8"></div>
       </header>

       <div className="p-4">
          <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-neutral-100">
             <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center gap-2 mb-4">
             <span className="text-xl font-bold text-green-600">₹{product.price}</span>
             {product.mrp > product.price && <span className="text-neutral-400 line-through text-sm">₹{product.mrp}</span>}
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl mb-6">
             <h3 className="font-bold mb-2">Product Description</h3>
             <p className="text-neutral-600 text-sm">{product.description || "Fresh and high-quality product carefully selected for you."}</p>
          </div>

          <Button onClick={() => addToCart(product)} className="w-full py-4 text-lg font-bold">
             Add to Basket
          </Button>
       </div>
    </div>
  );
}
