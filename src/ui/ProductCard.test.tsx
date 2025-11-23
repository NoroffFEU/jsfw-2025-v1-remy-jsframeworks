import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
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

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

function stripSpaces(str: string) {
  return str.replace(/\s/g, '');
}

describe('ProductCard', () => {
  it('renders product title', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/waterproof jacket/i)).toBeInTheDocument();
  });

  it('displays discounted price', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const el = screen.getByTestId('price-discounted');

    const raw = stripSpaces(el.textContent ?? '');
    expect(raw).toContain('1499');
  });

  it('displays original price', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const el = screen.getByTestId('price-original');

    const raw = stripSpaces(el.textContent ?? '');
    expect(raw).toContain('1999');
  });

  it('links to the product page', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });
});