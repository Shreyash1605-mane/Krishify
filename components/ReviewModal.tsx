import React, { useState } from 'react';
import type { Order, Review } from '../types';

interface ReviewModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (productId: string, review: Omit<Review, 'buyerName' | 'date'>) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(order.productId, { rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review for {order.productName}</h2>
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <button type="button" key={i} onClick={() => setRating(i + 1)} className="text-3xl">
                        <span className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    </button>
                ))}
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm h-28"
                placeholder="Share your experience..."
                required
            />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewModal;