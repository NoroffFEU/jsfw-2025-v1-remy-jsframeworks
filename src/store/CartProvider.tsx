import { useEffect, useMemo, useReducer, useCallback } from 'react';
import type { CartItem, CartSelectors, CartState } from '../types/cart';
import { effectivePrice } from '../types/cart';
import { loadJSON, saveJSON } from '../utils/storage';
import { CartContext, type CartContextValue } from './cart-context';

const CART_KEY = 'cart:v1';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'SET_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR' };

const initialState: CartState = loadJSON<CartState>(CART_KEY, { items: [] });

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === exists.id ? { ...i, qty: i.qty + action.payload.qty } : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'SET_QTY': {
      const { id, qty } = action.payload;
      if (qty <= 0) return { items: state.items.filter((i) => i.id !== id) };
      return { items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)) };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // persist to localStorage
  useEffect(() => {
    saveJSON(CART_KEY, state);
  }, [state]);

  // stable action creators
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    dispatch({ type: 'SET_QTY', payload: { id, qty } });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  // derived selectors
  const selectors: CartSelectors = useMemo(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce(
      (sum, i) => sum + effectivePrice(i) * i.qty,
      0
    );
    return { itemCount, subtotal };
  }, [state.items]);

  const value: CartContextValue = useMemo(
    () => ({
      state,
      addItem,
      removeItem,
      setQty,
      clear,
      selectors,
    }),
    [state, selectors, addItem, removeItem, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}