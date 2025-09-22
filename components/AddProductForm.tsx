
import React, { useState } from 'react';
import type { Product } from '../types';
import CameraModal from './CameraModal';

interface AddProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'farmer' | 'reviews' | 'category'>) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [type, setType] = useState<'sale' | 'rental'>('sale');
  const [city, setCity] = useState('');
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || (!imageUrl && !capturedImage) || !stock || !type) {
      alert('Please fill all fields');
      return;
    }
    // FIX: Added 'farmerName' to satisfy the type required by the onSubmit prop.
    // This value is overwritten by the parent component with the actual user's name.
    onSubmit({
      name,
      price: parseFloat(price),
      imageUrl: capturedImage || imageUrl,
      farmerName: '',
      stock: parseInt(stock, 10),
      type,
      location: { city },
    });
    // Reset form
    setName(''); setPrice(''); setImageUrl(''); setStock(''); setType('sale'); setCity(''); setCapturedImage(null);
  };
  
  const handleImageCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setImageUrl(''); // Clear manual URL input
    setIsCameraOpen(false);
  }

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add a New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="p-3 border border-gray-300 rounded-lg" required />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per kg" step="0.01" className="p-3 border border-gray-300 rounded-lg" required/>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock (units)" step="1" className="p-3 border border-gray-300 rounded-lg" required />
        
        <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
            <input type="text" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setCapturedImage(null); }} placeholder="Image URL" className="p-3 border border-gray-300 rounded-lg w-full" disabled={!!capturedImage}/>
            <button type="button" onClick={() => setIsCameraOpen(true)} className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300">📸</button>
        </div>

        <select value={type} className="p-3 border border-gray-300 rounded-lg bg-white" disabled>
            <option value="sale">For Sale (Produce)</option>
        </select>

        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your City/Town" className="p-3 border border-gray-300 rounded-lg" required />
        
        {capturedImage && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Image Preview:</p>
                <img src={capturedImage} alt="Captured preview" className="rounded-lg border max-h-40" />
            </div>
        )}

        <button type="submit" className="lg:col-span-3 w-full mt-2 p-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          Add Product
        </button>
      </form>
    </div>
    {isCameraOpen && <CameraModal onCapture={handleImageCapture} onClose={() => setIsCameraOpen(false)} />}
    </>
  );
};

export default AddProductForm;
