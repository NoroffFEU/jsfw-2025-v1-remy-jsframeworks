import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/useCart';
import { formatCurrency } from '../../utils/currency';
import { effectivePrice } from '../../types/cart';

export default function CartPage() {
  const { state, setQty, removeItem, clear, selectors } = useCart();

  if (!state.items.length) {
    return (
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  function handleQtyChange(id: string, event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    const next = Number.isNaN(value) ? 0 : value;
    setQty(id, Math.max(0, next));
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>

      <ul className="divide-y rounded border">
        {state.items.map((item) => {
          const unitPrice = effectivePrice(item);
          const lineTotal = unitPrice * item.qty;

          return (
            <li key={item.id} className="flex flex-wrap items-center gap-4 p-3">
              <div className="h-16 w-16 overflow-hidden rounded bg-neutral-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{item.title}</div>
                <div className="text-sm text-neutral-600">
                  {formatCurrency(unitPrice)} x {item.qty} = {formatCurrency(lineTotal)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm">
                  <span className="sr-only">Quantity</span>
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(event) => handleQtyChange(item.id, event)}
                    className="w-20 rounded border px-2 py-1 text-right"
                    aria-label={`Quantity for ${item.title}`}
                  />
                </label>

                <button
                  type="button"
                  className="rounded border px-2 py-1 text-sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          Items in cart: {selectors.itemCount}
        </div>
        <div className="text-lg font-semibold">
          Subtotal: {formatCurrency(selectors.subtotal)}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="rounded-md border px-4 py-2"
          onClick={clear}
        >
          Clear cart
        </button>

        <Link
          to="/checkout-success"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Checkout
        </Link>
      </div>
    </main>
  );
}