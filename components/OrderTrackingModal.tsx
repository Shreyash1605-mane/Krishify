import React from 'react';
import type { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order;
  onClose: () => void;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div>
            <p className="text-lg font-semibold">{order.productName}</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {order.id.slice(-6)}</p>

            <ul className="space-y-4">
                {order.trackingHistory.map((event, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                            <div className="w-5 h-5 bg-green-500 rounded-full ring-4 ring-green-100 z-10"></div>
                            {index < order.trackingHistory.length - 1 && <div className="w-0.5 h-12 bg-gray-300"></div>}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">{event.status}</p>
                            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;