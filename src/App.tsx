import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProductsPage from './pages/products/ProductsPage';
import ProductPage from './pages/product/ProductPage';
import CartPage from './pages/cart/CartPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import ContactPage from './pages/contact/ContactPage';
import CartBadge from './ui/CartBadge';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/products" className="text-lg font-semibold">
            Shop
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/products" className="hover:underline">
              Products
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/cart" className="relative">
              <CartBadge />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl p-4">
          <Routes>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<div className="p-6">Not found</div>} />
          </Routes>
        </div>
      </main>

      {/* Sticky footer (flex pushes it to bottom when content is short) */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} JS Frameworks React Webshop</span>
          <span>Built with React, TypeScript & Noroff API</span>
        </div>
      </footer>
    </div>
  );
}