import { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';
import { getDiscountPercent } from '../utils/discount';
import { Link } from 'react-router-dom';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { id, title, price, discountedPrice, rating, image } = product;
  const hasDiscount = discountedPrice < price;
  const discountPct = getDiscountPercent(price, discountedPrice);

  return (
    <article className="relative rounded-xl border p-3 hover:shadow-md transition">
      {hasDiscount && (
        <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
          -{discountPct}%
        </span>
      )}

      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.alt ?? title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-medium">{title}</h3>

        <div className="mt-2 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span data-testid="price-discounted"  className="text-lg font-semibold">
                {formatCurrency(product.discountedPrice)}
              </span>
              <span data-testid="price-original" className="text-sm text-neutral-500 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold">{formatCurrency(price)}</span>
          )}
        </div>

        {typeof rating === 'number' && (
          <div className="mt-1 text-sm text-neutral-600"> {rating.toFixed(1)}</div>
        )}
      </Link>
    </article>
  );
}