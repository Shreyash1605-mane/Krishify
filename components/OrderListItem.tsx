
import React from 'react';
import type { Order, UserRole, OrderStatus } from '../types';
import { OrderStatus as OrderStatusEnum } from '../types';

interface OrderListItemProps {
  order: Order;
  userRole: UserRole;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewTracking: () => void;
  onAddReview: () => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusStyles: Record<OrderStatus, string> = {
    [OrderStatusEnum.PLACED]: 'bg-blue-100 text-blue-800',
    [OrderStatusEnum.PROCESSING]: 'bg-purple-100 text-purple-800',
    [OrderStatusEnum.SHIPPED]: 'bg-yellow-100 text-yellow-800',
    [OrderStatusEnum.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatusEnum.CANCELLED]: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge: React.FC<{ status: 'Paid' | 'Unpaid' }> = ({ status }) => {
    const statusStyles = {
        Paid: 'bg-green-100 text-green-800',
        Unpaid: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};


const FarmerStatusControl: React.FC<{ order: Order; onUpdateStatus: (orderId: string, status: OrderStatus) => void }> = ({ order, onUpdateStatus }) => {
  return (
    <select 
      value={order.status}
      onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      {Object.values(OrderStatusEnum).map(status => <option key={status}>{status}</option>)}
    </select>
  );
};


const OrderListItem: React.FC<OrderListItemProps> = ({ order, userRole, onUpdateStatus, onViewTracking, onAddReview }) => {
  return (
    <li className="p-4 sm:p-6 hover:bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
        
        <div className="col-span-2 md:col-span-2">
          <p className="text-sm font-medium text-indigo-600 truncate">{order.productName}</p>
          <p className="text-xs text-gray-500">ID: {order.id.slice(-6)}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>

        <div className="text-sm text-gray-700">
          <p>Qty: {order.quantity} {order.productName.includes("Tractor") ? "days" : "kg"}</p>
          <p>Total: <span className="font-semibold">₹{order.totalPrice.toFixed(2)}</span></p>
        </div>

        <div className="text-sm text-gray-500">
          <p>{userRole === 'farmer' ? `To: ${order.buyerName}` : `From: ${order.farmer}`}</p>
        </div>
        
        <div className="flex flex-col items-start md:items-end space-y-2">
           <OrderStatusBadge status={order.status} />
           <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        
        <div className="col-span-2 md:col-span-1 text-right flex flex-col items-end space-y-2">
           {userRole === 'farmer' ? (
                <FarmerStatusControl order={order} onUpdateStatus={onUpdateStatus} />
            ) : (
                <button onClick={onViewTracking} className="text-sm text-blue-600 hover:underline">View Tracking</button>
            )}
           {userRole === 'buyer' && order.status === OrderStatusEnum.DELIVERED && (
               <button onClick={onAddReview} className="text-sm text-green-600 hover:underline">Add Review</button>
           )}
           {userRole === 'farmer' && <button onClick={onViewTracking} className="text-sm text-blue-600 hover:underline">View Tracking</button>}

        </div>

      </div>
    </li>
  );
};

export default OrderListItem;
