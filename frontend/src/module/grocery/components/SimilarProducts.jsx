import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function SimilarProducts({ products, loading }) {
  if (loading) {
    return <div className="p-4 text-center">Loading similar products...</div>;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <h3 className="text-lg font-bold mb-4 px-4">You might also like</h3>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id || product._id} className="min-w-[160px] w-40">
            <ProductCard product={product} compact={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
