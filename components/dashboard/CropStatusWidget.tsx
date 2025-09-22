import React from 'react';
import { Product } from '../../types';

interface CropStatusWidgetProps {
    products: Product[];
}

const CropStatusWidget: React.FC<CropStatusWidgetProps> = ({ products }) => {
  
  const cropsForSale = products.filter(p => p.type === 'sale');

  const getHealthColor = (stock: number) => {
    if (stock > 50) return 'bg-green-500';
    if (stock > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
      <h3 className="font-bold text-lg text-gray-700 mb-2">My Product Stock</h3>
      <div className="space-y-3">
        {cropsForSale.length > 0 ? cropsForSale.map(crop => (
          <div key={crop.id}>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="font-medium text-gray-800">{crop.name}</span>
              <span className="text-gray-500">{crop.stock} kg available</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getHealthColor(crop.stock)} h-2.5 rounded-full`}
                style={{ width: `${Math.min(crop.stock, 100)}%` }}
              ></div>
            </div>
          </div>
        )) : <p className="text-sm text-gray-500">You have no products for sale.</p>}
      </div>
    </div>
  );
};

export default CropStatusWidget;