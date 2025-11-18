import { Link } from 'react-router-dom';
import { useCart } from '../store/useCart';

export default function CartBadge() {
  const { selectors } = useCart();

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center gap-2 rounded-md border px-3 py-2"
      aria-label="View cart"
    >
      <span>My Cart</span>
      <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
        {selectors.itemCount}
      </span>
    </Link>
  );
}