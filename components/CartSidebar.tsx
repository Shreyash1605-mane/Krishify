
import React, { useState } from 'react';
import type { CartItem, Product, PaymentMethod } from '../types';
import CheckoutModal from './CheckoutModal';

interface CartSidebarProps {
  cart: CartItem[];
  products: Product[];
  onUpdateCart: (productId: string, newQuantity: number) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, products, onUpdateCart, onCheckout }) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cart.length > 0) {
      setIsCheckoutModalOpen(true);
    }
  };

  const handleConfirmCheckout = (paymentMethod: PaymentMethod) => {
    onCheckout(paymentMethod);
    setIsCheckoutModalOpen(false);
  };
  
  return (
    <>
      <aside className="w-full md:w-80 lg:w-96 bg-white border-l border-green-200 p-4 flex flex-col shrink-0 h-full md:h-auto">
        <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <ul className="space-y-4">
              {cart.map(item => (
                <li key={item.productId} className="flex items-center space-x-3">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} x {item.quantity.toFixed(1)}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateCart(item.productId, parseFloat(e.target.value))}
                      min="0.5"
                      step="0.5"
                      className="w-16 p-1 border border-gray-300 rounded-md text-center"
                    />
                    <button onClick={() => onUpdateCart(item.productId, 0)} className="ml-2 text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckoutClick}
            disabled={cart.length === 0}
            className="w-full mt-4 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </aside>
      {isCheckoutModalOpen && (
        <CheckoutModal
          cart={cart}
          total={cartTotal}
          onClose={() => setIsCheckoutModalOpen(false)}
          onConfirm={handleConfirmCheckout}
        />
      )}
    </>
  );
};

export default CartSidebar;
