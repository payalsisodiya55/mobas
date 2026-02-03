import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
// For now, we can try to reuse the user CartProvider if it supports grocery items
// or create a new one. Let's create a new one to keep it clean.
import { GroceryCartProvider } from "../context/GroceryCartContext";
import GroceryBottomNav from "./GroceryBottomNav";

export default function GroceryLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search, location.hash]);

  // Show bottom navigation on main pages
  const showBottomNav = location.pathname === "/grocery" || 
                        location.pathname === "/grocery/categories" ||
                        location.pathname === "/grocery/orders" ||
                        location.pathname === "/grocery/account";

  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      <GroceryCartProvider>
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
        {showBottomNav && <GroceryBottomNav />}
      </GroceryCartProvider>
    </div>
  );
}
