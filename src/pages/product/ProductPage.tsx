import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import { getDiscountPercent } from '../../utils/discount';
import { useProductQuery } from '../../api/queries/products';
import { useCart } from '../../store/useCart';
import { toCartItem } from '../../types/cart';
import { toast } from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProductQuery(id);
  const { addItem } = useCart();

  if (!id) return <div className="p-6">Invalid product id.</div>;
  if (isLoading) return <div className="p-6">Loading product…</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load product.</div>;
  if (!data) return <div className="p-6">No product data.</div>;

  const p = data.data;
  const hasDiscount = p.discountedPrice < p.price;
  const pct = getDiscountPercent(p.price, p.discountedPrice);

  function handleAddToCart() {
    addItem(toCartItem(p, 1));
    toast.success(`Added "${p.title}" to cart`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      {/* Back link */}
      <div className="mb-4">
        <Link
          to="/products"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to products
        </Link>
      </div>

      {/* Main card */}
      <section className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image */}
          <div className="rounded-lg border bg-neutral-50 p-2">
            {p.image?.url ? (
              <img
                src={p.image.url}
                alt={p.image.alt ?? p.title}
                className="h-full w-full max-h-[480px] rounded-md object-cover"
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
                No image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {/* Title + price + rating */}
            <header>
              <h1 className="text-2xl font-semibold leading-snug md:text-3xl">
                {p.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrency(p.discountedPrice)}
                    </span>
                    <span className="text-sm text-neutral-500 line-through">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                      -{pct}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">
                    {formatCurrency(p.price)}
                  </span>
                )}
              </div>

              {typeof p.rating === 'number' && (
                <p className="mt-2 text-sm text-neutral-700">
                  <span className="font-medium">Rating:</span>{' '}
                  {p.rating.toFixed(1)}
                </p>
              )}
            </header>

            {/* Description */}
            {p.description && (
              <section>
                <h2 className="mb-1 text-sm font-semibold text-neutral-700">
                  Description
                </h2>
                <p className="text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">
                  {p.description}
                </p>
              </section>
            )}

            {/* Tags */}
            {p.tags?.length ? (
              <section>
                <h2 className="mb-1 text-sm font-semibold text-neutral-700">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Actions */}
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {p.reviews?.length ? (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
          <ul className="space-y-3">
            {p.reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border bg-white p-3"
              >
                <div className="text-sm">
                  <span className="font-medium">Rating:</span> {r.rating}
                </div>
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