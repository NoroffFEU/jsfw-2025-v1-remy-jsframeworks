import { useParams, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { ONLINE_SHOP_ITEM } from '../../api/endpoints';
import { ApiItemResponse, Product } from '../../types/product';
import { formatCurrency } from '../../utils/currency';
import { getDiscountPercent } from '../../utils/discount';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const url = id ? ONLINE_SHOP_ITEM(id) : null;

  // Hook is called every render. 
  const { data, isLoading, isError } = useApi<ApiItemResponse<Product>>(url);

  // so now, I can render conditionally
  if (!id) return <div className="p-6">Invalid product id.</div>;
  if (isLoading) return <div className="p-6">Loading product…</div>;
  if (isError)   return <div className="p-6 text-red-600">Failed to load product.</div>;
  if (!data)     return <div className="p-6">No product data.</div>;

  const p = data.data;
  const hasDiscount = p.discountedPrice < p.price;
  const pct = getDiscountPercent(p.price, p.discountedPrice);

  return (
 <main className="mx-auto max-w-5xl p-4">
      <div className="mb-4">
        <Link to="/products" className="text-blue-600 underline">
          ← Back to products
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Image */}
        <div className="rounded-lg border p-2">
          {p.image?.url ? (
            <img
              src={p.image.url}
              alt={p.image.alt ?? p.title}
              className="w-full h-auto object-cover rounded"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-neutral-500">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>

          {/* Price & discount section */}
          <div className="mt-2 flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                {/* Discounted price */}
                <span className="text-2xl font-bold text-green-700">
                  {formatCurrency(p.discountedPrice)}
                </span>

                {/* Original price */}
                <span className="text-neutral-500 line-through">
                  {formatCurrency(p.price)}
                </span>

                {/* Discount percentage */}
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  -{pct}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {formatCurrency(p.price)}
              </span>
            )}
          </div>

          {/* Rating */}
          {typeof p.rating === 'number' && (
            <div className="mt-2 text-sm text-neutral-700">
                Rating: {p.rating.toFixed(1)}
            </div>
          )}

          {/* Description */}
          {p.description && (
            <p className="mt-4 whitespace-pre-wrap">{p.description}</p>
          )}

          {/* Tags */}
          {p.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          {/* Actions */}
          <div className="mt-6">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => {
                // placeholder; will be wired to cart in Milestone 3
                console.log('Add to cart:', { id: p.id, title: p.title });
                alert('Added to cart (placeholder)');
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {p.reviews?.length ? (
        <section className="mt-10">
          <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
          <ul className="space-y-2">
            {p.reviews.map((r) => (
              <li key={r.id} className="rounded border p-3">
                <div className="text-sm">Rating: {r.rating}</div>
                {r.description && (
                  <p className="mt-1 text-sm text-neutral-800">
                    {r.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}