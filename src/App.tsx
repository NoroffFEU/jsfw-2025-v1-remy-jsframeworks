import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductsPage from './pages/products/ProductsPage';
import ProductPage from './pages/product/ProductPage';
import CartPage from './pages/cart/CartPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import ContactPage from './pages/contact/ContactPage';
import CartBadge from './ui/CartBadge';

export default function App() {
  return (
    <>
      {/* Global toaster for notifications */}
      <Toaster position="top-right" />

      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-lg font-semibold">
              Shop
            </Link>
            <Link to="/contact" className="text-lg text-blue-700 hover:underline">
              Contact
            </Link>
          </div>
          <CartBadge />
        </div>
      </header>

      <Routes>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </>
  );
}