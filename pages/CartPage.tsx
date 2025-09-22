import React, { useState } from 'react';
import type { CartItem, Product, PaymentMethod } from '../types';
import CheckoutModal from '../components/CheckoutModal';

interface CartPageProps {
  cart: CartItem[];
  products: Product[];
  onUpdateCart: (productId: string, newQuantity: number) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, products, onUpdateCart, onCheckout }) => {
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
      <main className="w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Shopping Cart</h1>
            {cart.length === 0 ? (
            <div className="flex-grow flex items-center justify-center h-64 bg-white rounded-lg shadow">
                <p className="text-gray-500">Your cart is empty.</p>
            </div>
            ) : (
            <div className="bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                {cart.map(item => (
                    <li key={item.productId} className="flex items-center space-x-3 p-4">
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
                        className="w-20 p-1 border border-gray-300 rounded-md text-center"
                        />
                        <button onClick={() => onUpdateCart(item.productId, 0)} className="ml-3 text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button>
                    </div>
                    </li>
                ))}
                </ul>
                <div className="border-t p-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckoutClick}
                        disabled={cart.length === 0}
                        className="w-full mt-4 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
            )}
        </div>
      </main>
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

export default CartPage;
