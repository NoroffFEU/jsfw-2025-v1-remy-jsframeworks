import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartProvider from './CartProvider';
import { useCart } from './useCart';
import { toCartItem } from '../types/cart';
import type { Product } from '../types/product';

const mockProduct: Product = {
  id: '1',
  title: 'Waterproof Jacket',
  price: 1999,
  discountedPrice: 1499,
  image: { url: 'test.jpg', alt: 'Jacket' },
  rating: 4.5,
  description: '',
  tags: [],
  reviews: [],
};

function CartTestHarness() {
  const { state, addItem, removeItem, setQty, clear, selectors } = useCart();
  const item = toCartItem(mockProduct, 1);

  return (
    <div>
      <div data-testid="item-count">{selectors.itemCount}</div>

      <button type="button" onClick={() => addItem(item)}>
        add
      </button>

      <button type="button" onClick={() => removeItem(item.id)}>
        remove
      </button>

      <button type="button" onClick={() => setQty(item.id, 3)}>
        set-qty-3
      </button>

      <button type="button" onClick={() => clear()}>
        clear
      </button>

      {/* Optional debug output if you ever need it */}
      <pre data-testid="raw-items" style={{ display: 'none' }}>
        {JSON.stringify(state.items)}
      </pre>
    </div>
  );
}

function renderWithCart() {
  return render(
    <CartProvider>
      <CartTestHarness />
    </CartProvider>
  );
}

describe('useCart + CartProvider', () => {
  it('starts with an empty cart', () => {
    renderWithCart();
    const count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('0');
  });

  it('adds an item to the cart', () => {
    renderWithCart();

    fireEvent.click(screen.getByText('add'));

    const count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('1');
  });

  it('updates quantity with setQty', () => {
    renderWithCart();

    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('set-qty-3'));

    const count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('3');
  });

  it('removes items and clears the cart', () => {
    renderWithCart();

    // add once
    fireEvent.click(screen.getByText('add'));
    let count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('1');

    // remove that item
    fireEvent.click(screen.getByText('remove'));
    count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('0');

    // add again and then clear
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('clear'));
    count = screen.getByTestId('item-count');
    expect(count.textContent).toBe('0');
  });
});