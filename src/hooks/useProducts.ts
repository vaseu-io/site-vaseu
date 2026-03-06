import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';

export function useProducts() {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products'],
    queryFn: () => fetchProducts(20),
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
