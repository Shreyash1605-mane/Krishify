
import React, { useState } from 'react';
import type { CartItem, PaymentMethod } from '../types';

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, total, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');

  const handleConfirm = () => {
    onConfirm(paymentMethod);
  };
  
  const paymentOptions: {id: PaymentMethod, label: string}[] = [
      { id: 'credit-card', label: 'Credit Card' },
      { id: 'paypal', label: 'PayPal' },
      { id: 'bank-transfer', label: 'Bank Transfer' },
      { id: 'cod', label: 'Cash on Delivery' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Confirm Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {cart.map(item => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} ({item.quantity.toFixed(1)})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-3 mb-4">
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span className="text-green-600">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="space-y-2">
            {paymentOptions.map(opt => (
                <div key={opt.id}>
                    <input type="radio" id={opt.id} name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="mr-2" />
                    <label htmlFor={opt.id}>{opt.label}</label>
                </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
            {paymentMethod === 'cod' ? 'Place Order' : 'Confirm and Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
