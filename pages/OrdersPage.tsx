import React, { useState } from 'react';
import type { User, Order, OrderStatus, Review, Product } from '../types';
import OrderListItem from '../components/OrderListItem';
import OrderTrackingModal from '../components/OrderTrackingModal';
import ReviewModal from '../components/ReviewModal';

interface OrdersPageProps {
  user: User;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAddReview: (productId: string, review: Omit<Review, 'buyerName'|'date'>) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ user, orders, onUpdateStatus, onAddReview }) => {
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);

  const relevantOrders = user.role === 'farmer'
    ? orders.filter(order => order.farmerId === user.uid)
    : orders.filter(order => order.buyerId === user.uid);

  const title = user.role === 'farmer' ? 'Incoming Orders' : 'My Order History';
  const emptyMessage = user.role === 'farmer'
    ? "You haven't received any orders yet."
    : "You haven't placed any orders yet.";

  return (
    <>
      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>

          {relevantOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {relevantOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order => (
                  <OrderListItem 
                    key={order.id}
                    order={order}
                    userRole={user.role}
                    onUpdateStatus={onUpdateStatus}
                    onViewTracking={() => setTrackingOrder(order)}
                    onAddReview={() => setReviewingOrder(order)}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>
      
      {trackingOrder && (
          <OrderTrackingModal 
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
          />
      )}
      
      {reviewingOrder && (
          <ReviewModal
            order={reviewingOrder}
            onClose={() => setReviewingOrder(null)}
            onSubmit={onAddReview}
          />
      )}
    </>
  );
};

export default OrdersPage;
