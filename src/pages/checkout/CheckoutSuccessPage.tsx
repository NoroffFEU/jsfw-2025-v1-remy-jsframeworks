import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/useCart';

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // Clear the cart once when we land on this page
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Thank you for your purchase</h1>
      <p>Your order has been placed successfully.</p>

      <div className="mt-6">
        <Link
          to="/products"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to products
        </Link>
      </div>
    </main>
  );
}