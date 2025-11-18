import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../client';
import { ONLINE_SHOP, ONLINE_SHOP_ITEM } from '../endpoints';
import type { ApiListResponse, ApiItemResponse, Product } from '../../types/product';

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiGet<ApiListResponse<Product>>(ONLINE_SHOP),
  });
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) {
        // Should never fire because of `enabled`, but keeps TS happy
        return Promise.reject(new Error('Missing product id'));
      }
      return apiGet<ApiItemResponse<Product>>(ONLINE_SHOP_ITEM(id));
    },
    enabled: Boolean(id), // don't run until id is known
  });
}