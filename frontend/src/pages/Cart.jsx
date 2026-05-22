import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Dedicated /cart URL opens the side bag (consistent with swipe-aside pattern) then returns home.
 */

const Cart = () => {
  const { openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    openCart();
    navigate('/', { replace: true });
  }, [openCart, navigate]);

  return null;
};

export default Cart;
