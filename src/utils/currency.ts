export const formatCurrency = (value: number, locale = 'nb-NO', currency = 'NOK') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);


export const getDiscountPercent = (price: number, discounted: number) => {
  if (price <= 0 || discounted >= price) return 0;
  return Math.round(((price - discounted) / price) * 100);
};