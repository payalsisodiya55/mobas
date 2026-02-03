import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function PlaceholderPage({ title, description, backLink = "/grocery" }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={backLink} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <Link to="/grocery" className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Export all placeholder components
export function Category() {
  return <PlaceholderPage title="Category Products" description="Product listings for this category coming soon!" />;
}

export function ProductDetail() {
  return <PlaceholderPage title="Product Details" description="Detailed product information coming soon!" />;
}

export function Search() {
  return <PlaceholderPage title="Search Products" description="Search functionality coming soon!" />;
}

export function Checkout() {
  return <PlaceholderPage title="Checkout" description="Checkout process coming soon!" />;
}

export function Orders() { 
  return <PlaceholderPage title="My Orders" description="Order history coming soon!" />;
}

export function OrderDetail() {
  return <PlaceholderPage title="Order Details" description="Order details coming soon!" backLink="/grocery/orders" />;
}

export function Account() {
  return <PlaceholderPage title="My Account" description="Account management coming soon!" />;
}

// Default exports for individual files
export default Category;
