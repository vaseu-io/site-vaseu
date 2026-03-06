import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || "");
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Produto não encontrado.</p>
          <Link to="/" className="text-sm underline mt-4 inline-block">Voltar</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.edges || [];
  const options = product.options || [];

  // Initialize selected options
  if (Object.keys(selectedOptions).length === 0 && options.length > 0) {
    const initial: Record<string, string> = {};
    options.forEach(opt => { initial[opt.name] = opt.values[0]; });
    // Set on next tick to avoid render-during-render
    setTimeout(() => setSelectedOptions(initial), 0);
  }

  const selectedVariant = product.variants?.edges?.find(v =>
    v.node.selectedOptions.every(so => selectedOptions[so.name] === so.value)
  )?.node || product.variants?.edges?.[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted overflow-hidden">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex].node.url}
                  alt={images[selectedImageIndex].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${i === selectedImageIndex ? 'border-foreground' : 'border-transparent'}`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">{product.title}</h1>
              <p className="text-2xl font-mono mt-2">
                R$ {parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
            </div>

            {options.map(option => (
              option.values.length > 1 && (
                <div key={option.name} className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(value => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                        className={`px-4 py-2 border text-xs uppercase tracking-wider transition-colors ${
                          selectedOptions[option.name] === value
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full uppercase tracking-[0.2em]"
              disabled={cartLoading || !selectedVariant?.availableForSale}
            >
              {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : !selectedVariant?.availableForSale ? "Esgotado" : <><ShoppingCart className="w-4 h-4 mr-2" />Adicionar ao Carrinho</>}
            </Button>

            {product.description && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Descrição</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
