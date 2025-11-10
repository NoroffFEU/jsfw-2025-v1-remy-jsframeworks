export const getDiscountPercent = (price: number, discounted: number) => {
  if (price <= 0 || discounted >= price) return 0;
  return Math.round(((price - discounted) / price) * 100);
};