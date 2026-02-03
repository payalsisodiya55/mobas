import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from './hooks/useAuth';
import { getOrderById } from './services/api/customerOrderService';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await getOrderById(id);
        if (response.success && response.data) {
          setOrder(response.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated]);

  if (loading) return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return (
    <div className="p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <button onClick={() => navigate("/grocery/orders")} className="text-green-600 font-bold">Back to My Orders</button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
        <header className="px-4 py-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
             <button onClick={() => navigate("/grocery/orders")} className="p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
             </button>
             <h1 className="text-xl font-bold">Order Details</h1>
        </header>

        <div className="p-4 space-y-4 max-w-2xl mx-auto">
            {/* Order details JSX */}
        </div>
    </div>
  );
}
