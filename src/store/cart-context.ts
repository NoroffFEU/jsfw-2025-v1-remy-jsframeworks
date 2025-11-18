import { createContext } from 'react';
import type { CartItem, CartSelectors, CartState } from '../types/cart';

export type CartContextValue = {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  selectors: CartSelectors;
};

export const CartContext = createContext<CartContextValue | null>(null);
