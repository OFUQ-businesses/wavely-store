import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';

/* eslint-disable react-refresh/only-export-components -- provider + hook in one module */

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(
        item => item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item._cartId !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item._cartId === action.payload._cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'SAVE_FOR_LATER': {
      const item = state.cart.find(i => i._cartId === action.payload);
      if (!item) return state;
      return {
        ...state,
        cart: state.cart.filter(i => i._cartId !== action.payload),
        savedForLater: [...state.savedForLater, item]
      };
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find(i => i._cartId === action.payload);
      if (!item) return state;
      return {
        ...state,
        savedForLater: state.savedForLater.filter(i => i._cartId !== action.payload),
        cart: [...state.cart, item]
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
};

const initialState = { cart: [], savedForLater: [] };

let cartIdCounter = Date.now();
const genCartId = () => `cart_${cartIdCounter++}`;

const FREE_SHIPPING_AT = 150;

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen(o => !o), []);

  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('wavely_cart');
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem('wavely_cart', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    const onEsc = e => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [cartOpen, closeCart]);

  const addToCart = (product, quantity = 1, selectedColor = 0) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity,
        selectedColor,
        _cartId: genCartId()
      }
    });
  };

  const removeFromCart = (_cartId) => dispatch({ type: 'REMOVE_FROM_CART', payload: _cartId });

  const updateQuantity = (_cartId, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { _cartId, quantity } });
  };

  const saveForLater = (_cartId) => dispatch({ type: 'SAVE_FOR_LATER', payload: _cartId });
  const moveToCart = (_cartId) => dispatch({ type: 'MOVE_TO_CART', payload: _cartId });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_AT - cartSubtotal);
  const freeShippingProgress =
    FREE_SHIPPING_AT <= 0 ? 1 : Math.min(1, cartSubtotal / FREE_SHIPPING_AT);

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      savedForLater: state.savedForLater,
      cartCount,
      cartSubtotal,
      cartOpen,
      openCart,
      closeCart,
      toggleCart,
      freeShippingAt: FREE_SHIPPING_AT,
      freeShippingRemaining,
      freeShippingProgress,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
