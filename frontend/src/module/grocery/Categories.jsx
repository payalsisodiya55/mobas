import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock Data
const MOCK_CATEGORIES = [
    { id: '1', name: 'Fruits & Veggies', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2670&auto=format&fit=crop' },
    { id: '2', name: 'Dairy & Bread', imageUrl: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=2680&auto=format&fit=crop' },
    { id: '3', name: 'Snacks & Munchies', imageUrl: 'https://images.unsplash.com/photo-1621939514649-28b12e816fa0?q=80&w=2664&auto=format&fit=crop' },
    { id: '4', name: 'Cold Drinks', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2660&auto=format&fit=crop' },
    { id: '5', name: 'Instant Food', imageUrl: 'https://images.unsplash.com/photo-1619860860774-1e2e1737e342?q=80&w=2667&auto=format&fit=crop' },
    { id: '6', name: 'Tea, Coffee & Health', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2521&auto=format&fit=crop' },
    { id: '7', name: 'Bakery & Biscuits', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=2565&auto=format&fit=crop' },
    { id: '8', name: 'Sweet Tooth', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2578&auto=format&fit=crop' },
    { id: '9', name: 'Atta, Rice & Dal', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2670&auto=format&fit=crop' },
    { id: '10', name: 'Masala, Oil & More', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2670&auto=format&fit=crop' },
];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
        setCategories(MOCK_CATEGORIES);
        setLoading(false);
    }, 500);
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
             <h1 className="text-lg font-bold text-neutral-800">All Categories</h1>
        </header>

        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => navigate(`/grocery/category/${cat.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-square relative cursor-pointer group hover:shadow-md transition-all duration-200"
                >
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                        <span className="text-white font-bold text-base md:text-lg leading-tight block">{cat.name}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
