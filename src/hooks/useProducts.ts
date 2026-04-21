import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';

export function useProducts() {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products'],
    queryFn: () => fetchProducts(20),
  });
}

export function useProduct(handle: string) {
  const mappedHandle = handle === 'oferta-pack-3-t-shirt-oversized-basic' 
    ? 't-shirt-oversized-basic-black-white' 
    : handle;

  return useQuery({
    queryKey: ['shopify-product', mappedHandle],
    queryFn: () => fetchProductByHandle(mappedHandle),
    enabled: !!mappedHandle,
  });
}
