import { useNavigate, useLocation, Link } from "react-router-dom";
import { Home, Grid, ShoppingBag, User, ArrowUpRight } from "lucide-react";

export default function GroceryBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2 text-xs font-medium">
        <button
          onClick={() => navigate("/grocery")}
          className={`flex flex-col items-center gap-1 min-w-[64px] ${
            isActive("/grocery") ? "text-emerald-600" : "text-neutral-500"
          }`}
        >
          <Home className="w-6 h-6" strokeWidth={isActive("/grocery") ? 2.5 : 2} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate("/grocery/categories")}
          className={`flex flex-col items-center gap-1 min-w-[64px] ${
            isActive("/grocery/categories") ? "text-emerald-600" : "text-neutral-500"
          }`}
        >
          <Grid className="w-6 h-6" strokeWidth={isActive("/grocery/categories") ? 2.5 : 2} />
          <span>Categories</span>
        </button>
        
        {/* Food Switcher Button */}
        <Link
          to="/"
          className="flex flex-col items-center gap-1 min-w-[64px] text-neutral-500 hover:text-orange-500 transition-colors"
        >
           <div className="bg-orange-50 p-1.5 rounded-xl">
             <ArrowUpRight className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
           </div>
          <span className="font-bold text-[10px] text-orange-600">Food</span>
        </Link>

        <button
          onClick={() => navigate("/grocery/orders")}
          className={`flex flex-col items-center gap-1 min-w-[64px] ${
            isActive("/grocery/orders") ? "text-emerald-600" : "text-neutral-500"
          }`}
        >
          <ShoppingBag className="w-6 h-6" strokeWidth={isActive("/grocery/orders") ? 2.5 : 2} />
          <span>Orders</span>
        </button>

        <button
          onClick={() => navigate("/grocery/account")}
          className={`flex flex-col items-center gap-1 min-w-[64px] ${
            isActive("/grocery/account") ? "text-emerald-600" : "text-neutral-500"
          }`}
        >
          <User className="w-6 h-6" strokeWidth={isActive("/grocery/account") ? 2.5 : 2} />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
}
