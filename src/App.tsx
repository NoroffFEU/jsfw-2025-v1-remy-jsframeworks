import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './pages/products/ProductsPage';
import ProductPage from './pages/product/ProductPage';

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
