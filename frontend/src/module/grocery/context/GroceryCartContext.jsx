import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from '../hooks/useLocation';
import { 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem, 
  removeFromCart as apiRemoveFromCart, 
  clearCart as apiClearCart 
} from '../services/api/customerCartService';
import { calculateProductPrice } from '../utils/priceUtils';

const CART_STORAGE_KEY = 'grocery_cart';

const CartContext = createContext();

export function GroceryCartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(item => item?.product) : [];
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
    return [];
  });
  
  const [lastAddEvent, setLastAddEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const pendingOperationsRef = useRef(new Set());
  
  const { location } = useLocation();

  const mapApiItemsToState = (apiItems) => {
    return apiItems
      .filter(item => item.product)
      .map(item => ({
        id: item._id,
        product: {
          id: item.product._id,
          name: item.product.productName || item.product.name,
          price: item.product.price,
          mrp: item.product.mrp,
          discPrice: item.product.discPrice,
          variations: item.product.variations,
          imageUrl: item.product.mainImage || item.product.imageUrl,
          pack: item.product.pack || '1 unit',
          categoryId: item.product.category || '',
          description: item.product.description,
        },
        quantity: item.quantity,
        variantId: item.variation
      }));
  };

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cart = useMemo(() => {
    const validItems = items.filter(item => item?.product);
    const total = validItems.reduce((sum, item) => {
      const { displayPrice } = calculateProductPrice(item.product, item.variantId);
      return sum + displayPrice * (item.quantity || 0);
    }, 0);
    const itemCount = validItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return {
      items: validItems,
      total,
      itemCount
    };
  }, [items]);

  const addToCart = async (product, sourceElement = null) => {
    const productId = product._id || product.id;
    if (pendingOperationsRef.current.has(productId)) return;
    pendingOperationsRef.current.add(productId);

    const normalizedProduct = {
      ...product,
      id: productId,
      name: product.name || product.productName || 'Product',
      imageUrl: product.imageUrl || product.mainImage,
    };

    const previousItems = [...items];
    setItems(prevItems => {
      const existingItem = prevItems.find(item => (item.product.id || item.product._id) === productId);
      if (existingItem) {
        return prevItems.map(item => 
          (item.product.id || item.product._id) === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prevItems, { product: normalizedProduct, quantity: 1 }];
    });

    // Check for auth if needed, for now just local sync or best effort API
    try {
      // In a real app we'd check isAuthenticated
      const variation = product.variantId || product.pack;
      const response = await apiAddToCart(productId, 1, variation, location?.latitude, location?.longitude);
      if (response && response.success && response.data?.items) {
        setItems(mapApiItemsToState(response.data.items));
      }
    } catch (e) {
      console.error("API sync failed", e);
      // Don't necessarily revert if we want guest cart to work
    } finally {
      pendingOperationsRef.current.delete(productId);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const previousItems = [...items];
    setItems(prevItems => 
      prevItems.map(item => 
        (item.product.id || item.product._id) === productId 
        ? { ...item, quantity } 
        : item
      )
    );

    try {
      const itemToUpdate = items.find(item => (item.product.id || item.product._id) === productId);
      if (itemToUpdate?.id) {
        const response = await apiUpdateCartItem(itemToUpdate.id, quantity, location?.latitude, location?.longitude);
        if (response && response.success && response.data?.items) {
          setItems(mapApiItemsToState(response.data.items));
        }
      }
    } catch (e) {
        console.error("API sync failed", e);
    }
  };

  const removeFromCart = async (productId) => {
    const previousItems = [...items];
    const itemToRemove = items.find(item => (item.product.id || item.product._id) === productId);
    
    setItems(prevItems => prevItems.filter(item => (item.product.id || item.product._id) !== productId));

    try {
      if (itemToRemove?.id) {
        const response = await apiRemoveFromCart(itemToRemove.id, location?.latitude, location?.longitude);
        if (response && response.success && response.data?.items) {
          setItems(mapApiItemsToState(response.data.items));
        }
      }
    } catch (e) {
        console.error("API sync failed", e);
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      await apiClearCart();
    } catch (e) {
      console.error("API clear failed", e);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    lastAddEvent,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Return a mock if context is missing during migration/build
    return {
      cart: { items: [], total: 0, itemCount: 0 },
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    };
  }
  return context;
}
