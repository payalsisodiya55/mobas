import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./context/GroceryCartContext";
import { placeOrder } from "./services/api/customerOrderService";
import { getAddresses } from "./services/api/profileService";

// Mocking components for now
const Button = ({ children, onClick, className, disabled }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`px-4 py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl transition-all font-bold disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  const deliveryFee = 40;
  const platformFee = 5;
  const totalAmount = cart.total + deliveryFee + platformFee;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        if (response.success && response.data) {
          setAddresses(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0]);
          }
        }
      } catch (e) {
        console.error("Error fetching addresses", e);
      } finally {
        setFetchingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: { id: item.product._id || item.product.id },
          quantity: item.quantity,
          variant: item.variant || item.variation
        })),
        address: selectedAddress,
        paymentMethod: 'COD',
        fees: {
          deliveryFee,
          platformFee
        }
      };
      
      const response = await placeOrder(orderData);
      if (response.success) {
        clearCart();
        navigate("/grocery/orders");
      } else {
        alert(response.message || "Failed to place order");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/grocery" className="text-green-600 font-medium">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
        <header className="px-4 py-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
             </button>
             <h1 className="text-xl font-bold">Checkout</h1>
        </header>

        <div className="p-4 space-y-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                <h2 className="font-bold mb-3 text-neutral-800">Delivery Address</h2>
                {fetchingAddresses ? (
                    <div className="h-16 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : selectedAddress ? (
                    <div className="text-sm p-3 border border-emerald-100 rounded-xl bg-emerald-50/30 flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="font-bold text-emerald-900">{selectedAddress.fullName || 'Default Address'}</p>
                            <p className="text-neutral-600 line-clamp-1">{selectedAddress.houseNo}, {selectedAddress.street}</p>
                            <p className="text-neutral-500 text-xs">{selectedAddress.pincode}, {selectedAddress.city}</p>
                        </div>
                        <button onClick={() => navigate("/grocery/checkout/address")} className="text-emerald-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">Change</button>
                    </div>
                ) : (
                    <div className="text-sm text-neutral-500 p-4 border border-dashed border-neutral-200 rounded-xl flex flex-col items-center gap-2">
                        <p>No addresses found</p>
                        <button onClick={() => navigate("/grocery/checkout/address")} className="text-emerald-600 font-bold">Add New Address</button>
                    </div>
                )}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold mb-3">Order Summary</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span>Items Total</span>
                        <span>₹{cart.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Platform Fee</span>
                        <span>₹{platformFee}</span>
                    </div>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>To Pay</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>

            <Button 
                onClick={handlePlaceOrder} 
                className="w-full py-4 text-lg font-bold shadow-lg shadow-green-200"
                disabled={loading}
            >
                {loading ? "Placing Order..." : `Pay ₹${totalAmount}`}
            </Button>
        </div>
    </div>
  );
}
