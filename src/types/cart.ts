import type { Product } from './product';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  discountedPrice: number;
  imageUrl?: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }              // +1 if exists
  | { type: 'REMOVE_ITEM'; payload: { id: string } }     // remove entirely
  | { type: 'SET_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR' };

export interface CartSelectors {
  itemCount: number;    // total qty
  subtotal: number;     // sum of effective prices * qty
}

export function toCartItem(p: Product, qty = 1): CartItem {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    discountedPrice: p.discountedPrice,
    imageUrl: p.image?.url,
    qty,
  };
}

export function effectivePrice(item: Pick<CartItem, 'price'|'discountedPrice'>) {
  return Math.min(item.discountedPrice ?? item.price, item.price);
}