import React, { useState } from 'react';
import type { Product, UserRole } from '../types';

interface ProductCardProps {
  product: Product;
  userRole: UserRole;
  isMyProductPage?: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, userRole, isMyProductPage, onAddToCart, onEdit, onDelete }) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;
  const isRental = product.type === 'rental';

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCartClick = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity);
      setQuantity(1); // Reset after adding
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        {isOutOfStock && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-lg">Out of Stock</div>}
        {isRental && <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">RENTAL</div>}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">from {product.farmer}</p>
        <div className="flex items-center space-x-1 mb-2">
            {avgRating > 0 ? <StarRating rating={avgRating} /> : <span className="text-xs text-gray-400">No reviews</span>}
            <span className="text-xs text-gray-500">({product.reviews.length})</span>
        </div>
        <p className="text-xs text-gray-400 mb-2">Available: {product.stock.toFixed(0)} units</p>
        <div className="flex-grow"></div>
        <div className="mt-4">
          <p className="text-xl font-semibold text-green-600">₹{product.price.toFixed(2)} / {isRental ? 'day' : (product.category === 'produce' ? 'kg' : 'unit')}</p>
          {(userRole === 'buyer' || userRole === 'farmer' && !isMyProductPage) && (
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                min="1"
                step="1"
                max={product.stock}
                className="w-16 p-2 border border-gray-300 rounded-md"
                disabled={isOutOfStock}
              />
              <button
                onClick={handleAddToCartClick}
                className="flex-grow px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isOutOfStock || quantity > product.stock}
              >
                Add to Cart
              </button>
            </div>
          )}
          {userRole === 'farmer' && isMyProductPage && (
            <div className="flex items-center space-x-2 mt-2">
                <button onClick={() => onEdit(product)} className="flex-1 text-sm py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100">Edit</button>
                <button onClick={() => onDelete(product.id)} className="flex-1 text-sm py-2 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
