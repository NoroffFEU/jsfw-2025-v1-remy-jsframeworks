import type { ReactElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProductPage from './ProductPage';
import type { Product } from '../../types/product';
import { useProductQuery } from '../../api/queries/products';
import { useCart } from '../../store/useCart';

// --- Module mocks ---

vi.mock('../../api/queries/products');
vi.mock('../../store/useCart');
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// --- Shared mock data ---

const mockProduct: Product = {
  id: '1',
  title: 'Waterproof Jacket',
  price: 1999,
  discountedPrice: 1499,
  image: { url: 'test.jpg', alt: 'Jacket' },
  rating: 4.5,
  description: 'A very waterproof jacket.',
  tags: ['outdoor', 'rain'],
  reviews: [],
};

function renderWithRoute(ui: ReactElement, initialEntry = '/product/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/product/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

// Strongly-typed mocked versions of the hooks
const useProductQueryMock = vi.mocked(useProductQuery);
const useCartMock = vi.mocked(useCart);

beforeEach(() => {
  vi.clearAllMocks();

  // Default useCart mock for ALL tests (so loading/error don't blow up)
  useCartMock.mockReturnValue({
    state: { items: [] },
    addItem: vi.fn(),
    removeItem: vi.fn(),
    setQty: vi.fn(),
    clear: vi.fn(),
    selectors: {
      itemCount: 0,
      total: 0,
    },
  } as unknown as ReturnType<typeof useCart>);
});

describe('ProductPage', () => {
  it('shows loading state', () => {
    useProductQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useProductQuery>);

    renderWithRoute(<ProductPage />);

    expect(screen.getByText(/loading product/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useProductQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useProductQuery>);

    renderWithRoute(<ProductPage />);

    expect(screen.getByText(/failed to load product/i)).toBeInTheDocument();
  });

  it('renders product details when loaded', () => {
    useProductQueryMock.mockReturnValue({
      data: { data: mockProduct },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProductQuery>);

    renderWithRoute(<ProductPage />);

    // Title
    expect(
      screen.getByRole('heading', { name: /waterproof jacket/i })
    ).toBeInTheDocument();

    // Description
    expect(
      screen.getByText(/a very waterproof jacket/i)
    ).toBeInTheDocument();

    // Tags
    expect(screen.getByText('#outdoor')).toBeInTheDocument();
    expect(screen.getByText('#rain')).toBeInTheDocument();

    // Rating label
    expect(screen.getByText(/rating:/i)).toBeInTheDocument();

    // Add to cart button
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it('calls addItem when "Add to cart" is clicked', async () => {
    const addItemSpy = vi.fn();

    useProductQueryMock.mockReturnValue({
      data: { data: mockProduct },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProductQuery>);

    useCartMock.mockReturnValue({
      state: { items: [] },
      addItem: addItemSpy,
      removeItem: vi.fn(),
      setQty: vi.fn(),
      clear: vi.fn(),
      selectors: {
        itemCount: 0,
        total: 0,
      },
    } as unknown as ReturnType<typeof useCart>);

    renderWithRoute(<ProductPage />);

    const btn = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(btn);

    expect(addItemSpy).toHaveBeenCalledTimes(1);
    expect(addItemSpy.mock.calls[0][0]).toMatchObject({
      id: mockProduct.id,
      title: mockProduct.title,
    });
  });
});