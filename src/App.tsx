import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './pages/products/productsPage';

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}