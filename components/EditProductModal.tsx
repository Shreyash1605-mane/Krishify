import React, { useState } from 'react';
import type { Product } from '../types';

interface EditProductModalProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onSave, onClose }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Product</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input-field" required />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field" required />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
            Save Changes
          </button>
        </div>
      </form>
       <style>{`.input-field { display: block; width: 100%; margin-top: 4px; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; }`}</style>
    </div>
  );
};

export default EditProductModal;