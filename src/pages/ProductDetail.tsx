import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { Loader2, ChevronLeft, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { getYampiCheckoutUrl, getYampiCartCheckoutUrl } from "@/lib/yampi";

const BUNDLE_DISCOUNT = 0.10; // 10% de desconto no combo

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || "");
  const { data: allProducts } = useProducts();
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openTabs, setOpenTabs] = useState<Record<string, boolean>>({ design: true, envio: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center py-40"><Loader2 className="h-6 w-6 animate-spin text-neutral-400" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-neutral-500 text-sm uppercase tracking-widest">Produto não encontrado</p>
          <Link to="/produtos" className="text-xs underline mt-4 inline-block uppercase tracking-widest">Ver todos os produtos</Link>
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
    setTimeout(() => setSelectedOptions(initial), 0);
  }

  const selectedVariant = product.variants?.edges?.find(v =>
    v.node.selectedOptions.every(so => selectedOptions[so.name] === so.value)
  )?.node || product.variants?.edges?.[0]?.node;

  const currentPrice = parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount);

  // Check if a specific option value is available for sale
  const isOptionValueAvailable = (optionName: string, value: string) => {
    return product.variants?.edges?.some(v => {
      const matchesThisOption = v.node.selectedOptions.some(so => so.name === optionName && so.value === value);
      const matchesOtherOptions = v.node.selectedOptions.every(so => {
        if (so.name === optionName) return true;
        return selectedOptions[so.name] === so.value;
      });
      return matchesThisOption && matchesOtherOptions && v.node.availableForSale;
    });
  };

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

  const nextImage = () => setSelectedImageIndex(prev => (prev + 1) % images.length);
  const prevImage = () => setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Breadcrumb */}
      <div className="hidden md:block border-b border-neutral-200">
        <div className="container py-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">Início</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-black transition-colors">Todos os Produtos</Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>
      </div>

      <div className="container">
        <div className="grid md:grid-cols-2 gap-0">

          {/* Image Gallery - Full bleed, Pace-style */}
          <div className="relative border-r border-neutral-200">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-neutral-50 overflow-hidden relative group">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex].node.url}
                  alt={images[selectedImageIndex].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm uppercase tracking-widest">
                  Sem imagem
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-4 border-t border-neutral-200">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === selectedImageIndex ? 'bg-black' : 'bg-neutral-300'
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="hidden md:flex gap-1 px-4 pb-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-16 h-20 flex-shrink-0 overflow-hidden border transition-all ${i === selectedImageIndex ? 'border-black' : 'border-transparent hover:border-neutral-300'
                      }`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Pace-inspired layout */}
          <div className="flex flex-col">

            {/* Title + Price */}
            <div className="px-6 md:px-10 pt-8 pb-6 border-b border-neutral-200">
              <h1 className="text-base md:text-lg font-bold uppercase tracking-[0.15em]">
                {product.title}
              </h1>
              <p className="text-base mt-1">
                R$ {currentPrice.toFixed(2).replace('.', ',')}
              </p>
              {currentPrice >= 30 && (
                <p className="text-[11px] text-neutral-400 mt-1">
                  em até 3x de R$ {(currentPrice / 3).toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>

            {/* Size / Option Selectors */}
            {options.map(option => (
              option.values.length > 1 && (
                <div key={option.name} className="px-6 md:px-10 py-5 border-b border-neutral-200">
                  <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 block mb-3">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(value => {
                      const isSelected = selectedOptions[option.name] === value;
                      const isAvailable = isOptionValueAvailable(option.name, value);

                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          disabled={!isAvailable}
                          className={`min-w-[48px] h-11 px-4 border text-xs uppercase tracking-wider transition-all ${isSelected
                            ? 'border-black bg-black text-white'
                            : isAvailable
                              ? 'border-neutral-300 bg-white text-black hover:border-black'
                              : 'border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed line-through'
                            }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}

            {/* Add to Cart + Buy Now */}
            <div className="px-6 md:px-10 py-6 border-b border-neutral-200 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant?.availableForSale}
                className={`w-full h-14 text-xs uppercase tracking-[0.25em] font-medium transition-all ${!selectedVariant?.availableForSale
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]'
                  }`}
              >
                {cartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : !selectedVariant?.availableForSale ? (
                  'Esgotado'
                ) : (
                  'Adicionar ao Carrinho'
                )}
              </button>
              {selectedVariant?.availableForSale && (() => {
                const sizeOption = selectedVariant.selectedOptions.find(o => o.name === 'Size' || o.name === 'Tamanho');
                const yampiUrl = getYampiCheckoutUrl(product.title, sizeOption?.value || selectedVariant.title || 'M');
                if (!yampiUrl) return null;
                return (
                  <a
                    href={yampiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-14 border-2 border-black text-xs uppercase tracking-[0.25em] font-medium text-black hover:bg-neutral-100 transition-all flex items-center justify-center active:scale-[0.98]"
                  >
                    Comprar Agora
                  </a>
                );
              })()}
            </div>

            {/* Bundle Deal Section */}
            {(() => {
              const otherProducts = allProducts?.filter(p => p.node.handle !== product.handle) || [];
              if (otherProducts.length === 0) return null;
              const suggestedIndex = product.id ? product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % otherProducts.length : 0;
              const suggested = otherProducts[suggestedIndex];
              const suggestedImage = suggested.node.images?.edges?.[0]?.node;
              const currentImage = images[0]?.node;
              const suggestedPrice = parseFloat(suggested.node.priceRange.minVariantPrice.amount);
              const totalOriginal = currentPrice + suggestedPrice;
              const totalDiscounted = totalOriginal * (1 - BUNDLE_DISCOUNT);
              const savings = totalOriginal - totalDiscounted;

              const sizeOption = selectedVariant?.selectedOptions.find(o => o.name === 'Size' || o.name === 'Tamanho');
              const currentSize = sizeOption?.value || selectedVariant?.title || 'M';
              const suggestedDefaultSize = suggested.node.options?.find(o => o.name === 'Size' || o.name === 'Tamanho')?.values?.[0] || 'M';
              const comboUrl = getYampiCartCheckoutUrl([
                { productTitle: product.title, size: currentSize, quantity: 1 },
                { productTitle: suggested.node.title, size: suggestedDefaultSize, quantity: 1 },
              ]);

              return (
                <div className="px-6 md:px-10 py-6 border-b border-neutral-200">
                  {/* Placeholder Image Grid - adicione suas fotos do modelo aqui */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="aspect-[3/4] bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-300">Foto 1</span>
                    </div>
                    <div className="grid grid-rows-2 gap-2">
                      <div className="bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-300">Foto 2</span>
                      </div>
                      <div className="bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-300">Foto 3</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-neutral-200 p-5 space-y-4">
                    {/* Header */}
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-1">Oferta Especial</p>
                      <p className="text-sm text-black">Conjunto Linha Basic Oficial</p>
                    </div>

                    {/* Product Images Row */}
                    <div className="flex items-center justify-center gap-3">
                      {/* Current Product */}
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <div className="w-20 h-24 md:w-24 md:h-28 bg-neutral-50 overflow-hidden border border-neutral-100">
                          {currentImage ? (
                            <img src={currentImage.url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px]">Sem img</div>
                          )}
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 text-center truncate w-full">{product.title}</p>
                      </div>

                      {/* Plus Icon - sem círculo */}
                      <div className="flex-shrink-0">
                        <Plus className="w-4 h-4 text-neutral-400" />
                      </div>

                      {/* Suggested Product */}
                      <Link to={`/product/${suggested.node.handle}`} className="flex flex-col items-center gap-2 flex-1 min-w-0 group">
                        <div className="w-20 h-24 md:w-24 md:h-28 bg-neutral-50 overflow-hidden border border-neutral-100 group-hover:border-neutral-400 transition-colors">
                          {suggestedImage ? (
                            <img src={suggestedImage.url} alt={suggested.node.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px]">Sem img</div>
                          )}
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 text-center truncate w-full group-hover:text-black transition-colors">{suggested.node.title}</p>
                      </Link>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <div>
                        <p className="text-xs text-neutral-400 line-through">R$ {totalOriginal.toFixed(2).replace('.', ',')}</p>
                        <p className="text-base font-bold text-black">R$ {totalDiscounted.toFixed(2).replace('.', ',')}</p>
                        <p className="text-[10px] text-green-600">Economize R$ {savings.toFixed(2).replace('.', ',')}</p>
                      </div>
                      {comboUrl ? (
                        <a
                          href={comboUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 h-11 bg-black text-white text-[11px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-neutral-800 transition-all active:scale-[0.98]"
                        >
                          Comprar All Basic
                        </a>
                      ) : (
                        <span className="px-5 h-11 bg-neutral-200 text-neutral-400 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center cursor-not-allowed">
                          Indisponível
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Design Accordion Tab */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setOpenTabs(prev => ({ ...prev, design: !prev.design }))}
                className="w-full px-6 md:px-10 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-normal text-black">Design</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openTabs.design ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openTabs.design ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 md:px-10 pb-5">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {product.description || 'Design exclusivo Vaseu com acabamento premium e atenção aos detalhes.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Envio Accordion Tab */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setOpenTabs(prev => ({ ...prev, envio: !prev.envio }))}
                className="w-full px-6 md:px-10 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-normal text-black">Envio</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openTabs.envio ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openTabs.envio ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 md:px-10 pb-5">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Enviamos para todo o Brasil. Prazo de entrega de 5 a 15 dias úteis. Frete calculado no checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <div className="px-6 md:px-10 py-6">
              <Link
                to="/produtos"
                className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
              >
                ← Voltar para produtos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
