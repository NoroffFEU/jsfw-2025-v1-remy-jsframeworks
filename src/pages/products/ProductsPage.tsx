import { useMemo, useState } from 'react';
import { ONLINE_SHOP } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';
import { ApiListResponse, Product } from '../../types/product';
import ProductCard from '../../ui/ProductCard';

type SortOption = 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc';

function effectivePrice(p: Product) {
  return Math.min(p.discountedPrice ?? p.price, p.price);
}

export default function ProductsPage() {
  const { data, isLoading, isError } = useApi<ApiListResponse<Product>>(ONLINE_SHOP);

  // UI state
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('title-asc');

  // Derived data (filter + sort) — recalculates on data or controls change
  const products = useMemo(() => {
    const items = data?.data ?? [];

    // 1) Filter (dynamic search across title/description/tags)
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter((p) => {
          const haystack = [
            p.title,
            p.description ?? '',
            ...(p.tags ?? []),
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        })
      : items;

    // 2) Sort
    const [key, dir] = sort.split('-') as ['title' | 'price', 'asc' | 'desc'];

    const sorted = [...filtered].sort((a, b) => {
      if (key === 'title') {
        const cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        return dir === 'asc' ? cmp : -cmp;
      } else {
        const aPrice = effectivePrice(a);
        const bPrice = effectivePrice(b);
        const cmp = aPrice - bPrice;
        return dir === 'asc' ? cmp : -cmp;
      }
    });

    return sorted;
  }, [data, query, sort]);

  // States
  if (isLoading) return <div className="p-6">Loading products…</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load products.</div>;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>

      {/* Controls */}
      <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search (dynamic / as-you-type) */}
        <label className="flex-1">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-md border px-3 py-2"
            aria-label="Search products"
          />
        </label>

        {/* Sort */}
        <label className="sm:w-60">
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-full rounded-md border px-3 py-2"
            aria-label="Sort products"
          >
            <option value="title-asc">Name (A–Z)</option>
            <option value="title-desc">Name (Z–A)</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
          </select>
        </label>
      </section>

      {/* Empty state */}
      {!products?.length ? (
        <div className="p-6 text-neutral-600">
          {query ? 'No products match your search.' : 'No products found.'}
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
