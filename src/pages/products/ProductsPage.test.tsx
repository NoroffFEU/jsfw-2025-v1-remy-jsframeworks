import type { ReactElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProductsPage from './ProductsPage';
import type { Product } from '../../types/product';
import { useProductsQuery } from '../../api/queries/products';

// Mock the query hook module
vi.mock('../../api/queries/products');

const useProductsQueryMock = vi.mocked(useProductsQuery);

// Helper to render with a router so ProductCard Links work
function renderWithRoute(ui: ReactElement, initialEntry = '/products') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/products" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

// Base mock products
const baseProducts: Product[] = [
  {
    id: '1',
    title: 'Alpha Jacket',
    price: 2000,
    discountedPrice: 1500,
    image: { url: 'alpha.jpg', alt: 'Alpha' },
    rating: 4.2,
    description: 'Good jacket for rainy days',
    tags: ['alpha', 'outdoor'],
    reviews: [],
  },
  {
    id: '2',
    title: 'Bravo Jacket',
    price: 1000,
    discountedPrice: 1000,
    image: { url: 'bravo.jpg', alt: 'Bravo' },
    rating: 4.8,
    description: 'Cheaper jacket',
    tags: ['bravo'],
    reviews: [],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProductsPage', () => {
  it('shows loading state', () => {
    useProductsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useProductsQuery>);

    renderWithRoute(<ProductsPage />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useProductsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useProductsQuery>);

    renderWithRoute(<ProductsPage />);

    expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
  });

  it('renders a list of products when loaded', () => {
    useProductsQueryMock.mockReturnValue({
      data: { data: baseProducts },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProductsQuery>);

    renderWithRoute(<ProductsPage />);

    // Page heading
    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();

    // Product titles from ProductCard
    expect(screen.getByText(/alpha jacket/i)).toBeInTheDocument();
    expect(screen.getByText(/bravo jacket/i)).toBeInTheDocument();
  });

  it('filters products by search query and shows empty state when no matches', async () => {
    useProductsQueryMock.mockReturnValue({
      data: { data: baseProducts },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProductsQuery>);

    renderWithRoute(<ProductsPage />);

    const search = screen.getByRole('searchbox', { name: /search products/i });

    // Filter down to "Alpha"
    await userEvent.type(search, 'alpha');

    expect(screen.getByText(/alpha jacket/i)).toBeInTheDocument();
    expect(screen.queryByText(/bravo jacket/i)).not.toBeInTheDocument();

    // Now type something that matches nothing
    await userEvent.clear(search);
    await userEvent.type(search, 'zzz');

    expect(
      screen.getByText(/no products match your search/i)
    ).toBeInTheDocument();
  });

  it('sorts products by price low→high and high→low', async () => {
    const products: Product[] = [
      {
        id: '1',
        title: 'Alpha Jacket',
        price: 2000,
        discountedPrice: 1500, // effectivePrice = 1500
        image: { url: 'alpha.jpg', alt: 'Alpha' },
        rating: 4.2,
        description: '',
        tags: [],
        reviews: [],
      },
      {
        id: '2',
        title: 'Bravo Jacket',
        price: 1000,
        discountedPrice: 900, // effectivePrice = 900 (cheapest)
        image: { url: 'bravo.jpg', alt: 'Bravo' },
        rating: 4.8,
        description: '',
        tags: [],
        reviews: [],
      },
    ];

    useProductsQueryMock.mockReturnValue({
      data: { data: products },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProductsQuery>);

    renderWithRoute(<ProductsPage />);

    const sort = screen.getByRole('combobox', { name: /sort products/i });

    // Default sort = title-asc → Alpha, Bravo
    let headings = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent ?? '');

    expect(headings[0]).toMatch(/alpha jacket/i);
    expect(headings[1]).toMatch(/bravo jacket/i);

    // Sort by price (Low → High) → Bravo (900) then Alpha (1500)
    await userEvent.selectOptions(sort, 'price-asc');
    headings = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent ?? '');

    expect(headings[0]).toMatch(/bravo jacket/i);
    expect(headings[1]).toMatch(/alpha jacket/i);

    // Sort by price (High → Low) → Alpha then Bravo
    await userEvent.selectOptions(sort, 'price-desc');
    headings = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent ?? '');

    expect(headings[0]).toMatch(/alpha jacket/i);
    expect(headings[1]).toMatch(/bravo jacket/i);
  });
});