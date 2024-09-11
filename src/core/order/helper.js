import { OrderDB } from '@/database/models/order';

export function _formatOrder(order) {
  return {
    id: order._id,
    address: order.address,
    paymentMethod: order.paymentMethod,
    price: order.price,
    tax: order.tax,
    totalPrice: order.totalPrice,
    totalQuantity: order.totalQuantity,
    status: order.status,
  };
}
