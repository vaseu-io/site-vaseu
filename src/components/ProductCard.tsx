import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const priceValue = parseFloat(price.amount);
  const installmentValue = (priceValue / 3).toFixed(2);

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }}
    >
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
      <div className="space-y-1">
        <h3 className="font-medium text-sm uppercase tracking-wide truncate">{node.title}</h3>
        <p className="text-sm font-mono">
          R$ {priceValue.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">
          ou 3x de R$ {installmentValue}
        </p>
      </div>
    </Link>
  );
};
