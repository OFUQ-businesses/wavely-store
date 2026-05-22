import { createContext, useContext, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const placeOrder = useCallback(async (cart, shippingDetails, deliveryMethod) => {
    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      selectedColor: item.selectedColor,
      colorNames: item.colorNames,
    }));

    const { orderNumber, order } = await api.placeOrder({
      items,
      shippingDetails,
      deliveryMethod,
      email: shippingDetails?.email,
    });

    return { orderId: orderNumber, order };
  }, []);

  const fetchMyOrders = useCallback(async () => {
    if (!isAuthenticated) return [];
    const { orders } = await api.myOrders();
    return orders;
  }, [isAuthenticated]);

  const trackOrder = useCallback(async (orderNumber, email) => {
    const { order } = await api.trackOrder(orderNumber, email);
    return order;
  }, []);

  return (
    <OrdersContext.Provider value={{ placeOrder, fetchMyOrders, trackOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
};
