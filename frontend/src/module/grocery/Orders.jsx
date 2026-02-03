import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './hooks/useAuth';

// Mock Data
const MOCK_ORDERS = [
    { 
        id: 'ORD-12345678', 
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        items: [
            { name: 'Amul Gold Milk', quantity: 2 },
            { name: 'Brown Bread', quantity: 1 },
            { name: 'Farm Fresh Eggs (6pcs)', quantity: 1 }
        ],
        totalAmount: 345
    },
    { 
        id: 'ORD-87654321', 
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        items: [
            { name: 'Fortune Sunlite Oil 1L', quantity: 1 },
            { name: 'Aashirvaad Atta 5kg', quantity: 1 }
        ],
        totalAmount: 890
    },
    { 
        id: 'ORD-11223344', 
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'Processing',
        items: [
            { name: 'Coke 750ml', quantity: 2 },
            { name: 'Lays Chips classic', quantity: 3 }
        ],
        totalAmount: 210
    }
];

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Keeping auth hook but not blocking render for demo
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
        setOrders(MOCK_ORDERS);
        setLoading(false);
    }, 600);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
        <header className="px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
             <button onClick={() => navigate("/grocery")} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
             </button>
             <h1 className="text-lg font-bold text-neutral-800">My Orders</h1>
        </header>

        <div className="p-4 space-y-4 max-w-2xl mx-auto">
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-100">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-lg font-bold text-neutral-900">No orders yet</h2>
                    <p className="text-neutral-500 mb-6 font-medium text-sm">When you place an order, it will appear here.</p>
                    <button 
                      onClick={() => navigate("/grocery")}
                      className="text-white bg-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      Start Shopping
                    </button>
                </div>
            ) : (
                orders.map((order) => (
                    <div 
                      key={order.id} 
                    //   onClick={() => navigate(`/grocery/orders/${order.id}`)}
                      className="bg-white p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border border-neutral-100 active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-2.5 rounded-xl">
                                    <span className="text-xl">🛍️</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 text-sm">Order #{order.id}</h3>
                                    <p className="text-xs text-neutral-500 font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' :
                                order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        
                        <div className="border-t border-dashed border-gray-100 my-3"></div>

                        <div className="space-y-1 mb-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-neutral-600">
                                    <span>{item.quantity} x {item.name}</span>
                                </div>
                            ))}
                            {order.items.length > 2 && <div className="text-xs text-neutral-400 italic">+ {order.items.length - 2} more items</div>}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                             <span className="text-xs font-semibold text-neutral-500">Total Bill</span>
                             <span className="font-bold text-neutral-900 text-lg">₹{order.totalAmount}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
