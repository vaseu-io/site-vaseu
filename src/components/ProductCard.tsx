import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  originalPrice?: number;
  isFeatured?: boolean;
}

export const ProductCard = ({ product, originalPrice, isFeatured }: ProductCardProps) => {
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const priceValue = parseFloat(price.amount);
  const installmentValue = (priceValue / 3).toFixed(2);
  const hasDiscount = originalPrice && originalPrice > priceValue;

  return (
    <Link
      to={`/product/${node.handle}`}
      className={`group block transition-all duration-300 ${isFeatured ? 'p-4 border border-neutral-200' : ''}`}
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }}
    >
      <div className={`${isFeatured ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[3/4]'} overflow-hidden bg-muted mb-4`}>
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={isFeatured ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm uppercase tracking-wide truncate w-full">{node.title}</h3>
        <div className="flex flex-col gap-0.5">
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground line-through decoration-neutral-400">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-green-600 font-medium">
                Economize R$ {(originalPrice - priceValue).toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
          <p className="text-sm font-mono text-black">
            R$ {priceValue.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          ou 3x de R$ {installmentValue.replace('.', ',')}
        </p>
      </div>
    </Link>
  );
};
