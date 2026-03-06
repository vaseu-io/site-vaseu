import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho", { position: "top-center" });
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm uppercase tracking-wide truncate">{node.title}</h3>
        <p className="text-sm font-mono text-muted-foreground">
          R$ {parseFloat(price.amount).toFixed(2)}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full uppercase tracking-wider text-xs"
          onClick={handleAddToCart}
          disabled={isLoading || !variant?.availableForSale}
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : !variant?.availableForSale ? "Esgotado" : <><ShoppingCart className="w-3 h-3 mr-2" />Adicionar</>}
        </Button>
      </div>
    </Link>
  );
};
