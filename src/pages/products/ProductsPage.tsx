import { ONLINE_SHOP } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';
import { ApiListResponse, Product } from '../../types/product';
import ProductCard from '../../ui/productCard';

export default function ProductsPage() {
  const { data, isLoading, isError } = useApi<ApiListResponse<Product>>(ONLINE_SHOP);

  if (isLoading) return <div className="p-6">Loading products…</div>;
  if (isError)   return <div className="p-6 text-red-600">Failed to load products.</div>;
  if (!data || !data.data?.length) return <div className="p-6">No products found.</div>;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.data.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}