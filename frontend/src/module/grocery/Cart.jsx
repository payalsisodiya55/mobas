import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/GroceryCartContext';
import { calculateProductPrice } from './utils/priceUtils';

// Mocking some internal components and configs for now
const Button = ({ children, variant, size, className, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      variant === 'outline' ? 'border border-neutral-300' : 'bg-green-600 text-white'
    } ${className}`}
  >
    {children}
  </button>
);

const appConfig = {
  freeDeliveryThreshold: 500,
  deliveryFee: 40,
  platformFee: 5,
  estimatedDeliveryTime: '20-30 mins'
};


export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cart.total >= appConfig.freeDeliveryThreshold ? 0 : appConfig.deliveryFee;
  const platformFee = appConfig.platformFee;
  const totalAmount = cart.total + deliveryFee + platformFee;

  const handleCheckout = () => {
    navigate('/grocery/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="px-4 py-8 md:py-16 text-center h-screen flex flex-col items-center justify-center">
        <div className="text-6xl md:text-8xl mb-4">🛒</div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-600 mb-6 md:mb-8 md:text-lg">Add some items to get started!</p>
        <Link to="/grocery">
          <Button variant="default" size="lg" className="md:px-8 md:py-3 md:text-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-4 md:pb-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-white border-b border-neutral-200 mb-4 md:mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900">Your Basket</h1>
          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm md:text-base text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-xs md:text-sm text-neutral-600">Delivered in {appConfig.estimatedDeliveryTime}</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 md:px-6 lg:px-8 space-y-4 md:space-y-6 mb-4 md:mb-6 max-w-4xl mx-auto">
        {cart.items.map((item) => {
          const { displayPrice, mrp, hasDiscount } = calculateProductPrice(item.product);
          return (
            <div
              key={item.product.id || item.product._id}
              className="bg-white rounded-lg border border-neutral-200 p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4 md:gap-6">
                {/* Product Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {(item.product.imageUrl || item.product.mainImage) ? (
                    <img
                      src={item.product.imageUrl || item.product.mainImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl text-neutral-400">
                      {(item.product.name || 'P').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 mb-1 md:mb-2 line-clamp-2 md:text-lg">
                    {item.product.name || item.product.productName}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 mb-2">{item.product.pack || product.unit}</p>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="text-base md:text-lg font-bold text-neutral-900">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs md:text-sm text-neutral-500 line-through">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={() => updateQuantity(item.product.id || item.product._id, item.quantity - 1)}
                      className="w-8 h-8 md:w-10 md:h-10 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-600 hover:border-green-600 hover:text-green-600"
                    >
                      −
                    </button>
                    <span className="text-base md:text-lg font-semibold text-neutral-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id || item.product._id, item.quantity + 1)}
                      className="w-8 h-8 md:w-10 md:h-10 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-600 hover:border-green-600 hover:text-green-600"
                    >
                      +
                    </button>
                    <div className="ml-auto text-right">
                      <div className="text-sm md:text-base font-bold text-neutral-900">
                        ₹{(displayPrice * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product.id || item.product._id)}
                  className="text-neutral-400 hover:text-red-600 transition-colors self-start"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="px-4 md:px-6 lg:px-8 mb-24 md:mb-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-4 md:mb-6">Order Summary</h2>
          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div className="flex justify-between text-neutral-700 md:text-base">
              <span>Subtotal</span>
              <span className="font-medium">₹{cart.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-700 md:text-base">
              <span>Platform Fee</span>
              <span className="font-medium">₹{platformFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-700 md:text-base">
              <span>Delivery Charges</span>
              <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-4 md:pt-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <span className="text-lg md:text-xl font-bold text-neutral-900">Total</span>
              <span className="text-xl md:text-2xl font-bold text-neutral-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleCheckout}
              className="w-full md:py-3 md:text-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
