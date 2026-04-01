import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { Loader2, ChevronLeft, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { getYampiCheckoutUrl, getYampiCartCheckoutUrl, getBrandedCheckoutUrl } from "@/lib/yampi";
import { SizeChart } from "@/components/SizeChart";
import { ProductCard } from "@/components/ProductCard";

const BUNDLE_DISCOUNT = 0.10; // 10% de desconto no combo

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || "");
  const { data: allProducts } = useProducts();
  const targetColor = product?.title.toLowerCase().includes("white") ? "white" : "black";
  const bundleHandle = targetColor === "black" ? "conjunto-all-basic-black-1" : "conjunto-all-basic-black";
  const { data: bundleProduct } = useProduct(bundleHandle);
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const setIsOpen = useCartStore(state => state.setIsOpen);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [comboLoading, setComboLoading] = useState(false);
  const [openTabs, setOpenTabs] = useState<Record<string, boolean>>({ design: true, envio: false, sizeChart: false });
  const [bundleSize, setBundleSize] = useState('M');
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
    const timeoutId = window.setTimeout(resetScroll, 60);

    return () => window.clearTimeout(timeoutId);
  }, [handle]);

  useEffect(() => {
    if (!product) return;

    const options = product.options || [];
    if (options.length === 0) return;

    setSelectedOptions(prev => {
      if (Object.keys(prev).length > 0) return prev;

      const initial: Record<string, string> = {};
      options.forEach(opt => {
        initial[opt.name] = opt.values[0];
      });

      return initial;
    });
  }, [product]);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== selectedImageIndex) {
      setSelectedImageIndex(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
      setSelectedImageIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ overflowAnchor: "none" }}>
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

      <div className="container px-0">
        <div className="grid md:grid-cols-2 gap-0">

          {/* Image Gallery - Swipable */}
          <div className="relative border-r border-neutral-200 md:sticky md:top-[80px] md:h-[calc(100vh-80px)] flex flex-col">
            {/* Main Image Container */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="w-full flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full h-auto min-h-[50vh] md:h-auto snap-start flex items-center justify-center">
                  <img
                    src={img.node.url}
                    alt={img.node.altText || product.title}
                    className="w-full object-contain md:w-full md:h-full md:object-cover mix-blend-multiply"
                  />
                </div>
              ))}
              
              {images.length === 0 && (
                <div className="w-full h-full min-h-[50vh] flex items-center justify-center text-neutral-300 text-sm uppercase tracking-widest">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-4 border-t border-neutral-200 flex-shrink-0">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToImage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === selectedImageIndex ? 'bg-black' : 'bg-neutral-300'
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="hidden md:flex gap-1 px-4 pb-4 overflow-x-auto flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToImage(i)}
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
            <div className="px-4 md:px-6 lg:px-10 pt-8 pb-6 border-b border-neutral-200">
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
                <div key={option.name} className="px-4 md:px-6 lg:px-10 py-5 border-b border-neutral-200">
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
            <div className="px-4 md:px-6 lg:px-10 py-6 border-b border-neutral-200 space-y-3">
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
              {selectedVariant?.availableForSale && (
                <button
                  onClick={async () => {
                    setBuyNowLoading(true);
                    const sizeOption = selectedVariant.selectedOptions.find(o => o.name === 'Size' || o.name === 'Tamanho');
                    const currentSize = sizeOption?.value || selectedVariant.title || 'M';
                    
                    // Pre-calculate fallback URL (local tokens matching)
                    const fallback = getYampiCheckoutUrl(product.title, currentSize);

                    // Direct client-side Yampi redirect for better reliability
                    const yampiUrl = getYampiCheckoutUrl(product.title, currentSize, 1);
                    const finalUrl = getBrandedCheckoutUrl(yampiUrl) || yampiUrl || fallback;
                    
                    if (finalUrl) {
                      window.location.href = finalUrl;
                    } else {
                      toast.error("Erro ao gerar link de compra.");
                    }
                    setBuyNowLoading(false);
                  }}
                  disabled={buyNowLoading}
                  className="w-full h-14 border-2 border-black text-xs uppercase tracking-[0.25em] font-medium text-black hover:bg-neutral-100 transition-all flex items-center justify-center active:scale-[0.98]"
                >
                  {buyNowLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Comprar Agora'}
                </button>
              )}
            </div>

            {/* Oferta Especial - Bundle Deal Section */}
            {(() => {
              if (!allProducts) return null;
              
              const titleLower = product.title.toLowerCase();
              if (titleLower.includes("boxy") || titleLower.includes("2 t-shirt") || titleLower.includes("conjunto")) return null;

              const targetColor = (titleLower.includes("black") || titleLower.includes("preta")) ? "black" : 
                                 (titleLower.includes("white") || titleLower.includes("branca") || titleLower.includes("off-white")) ? "white" : "";
              const isShorts = titleLower.includes("shorts");
              const isTShirt = titleLower.includes("t-shirt") || titleLower.includes("oversized");

              if (!targetColor || (!isShorts && !isTShirt)) return null;

              const suggested = allProducts.find(p => {
                const pTitle = p.node.title.toLowerCase();
                const colorMatch = targetColor === "black" ? (pTitle.includes("black") || pTitle.includes("preto")) : (pTitle.includes("white") || pTitle.includes("branco") || pTitle.includes("off-white"));
                if (!colorMatch) return false;
                if (isShorts) return !pTitle.includes("boxy") && (pTitle.includes("t-shirt") || pTitle.includes("oversized"));
                return pTitle.includes("shorts");
              });

              if (!suggested || suggested.node.handle === product.handle) return null;
              
              const comboPrice = targetColor === "black" ? 249.90 : 247.00;
              const currentPriceRaw = parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount);
              const suggestedPriceRaw = parseFloat(suggested.node.priceRange.minVariantPrice.amount);
              const totalOriginal = currentPriceRaw + suggestedPriceRaw;
              const savings = totalOriginal - comboPrice;

              const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

              return (
                <div className="px-4 md:px-6 lg:px-10 py-6 border-b border-neutral-200 bundle-container">
                  <div className="border border-neutral-200 p-5 space-y-6 max-w-full overflow-hidden special-offer">
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">Oferta Especial</p>
                      <p className="text-sm font-bold text-black">Conjunto Linha Basic Oficial</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between gap-2 px-2">
                        {/* Main Product */}
                        <div className="flex flex-col items-center text-center gap-2 flex-1">
                          <div className="w-16 h-20 bg-neutral-50 flex-shrink-0">
                            {images[0] && <img src={images[0].node.url} alt="" className="w-full h-full object-cover mix-blend-multiply" />}
                          </div>
                          <p className="text-[9px] uppercase tracking-wider text-black font-medium leading-tight max-w-[80px]">{product.title}</p>
                        </div>

                        <Plus className="w-4 h-4 text-neutral-300 flex-shrink-0" />

                        {/* Suggested Product */}
                        <div className="flex flex-col items-center text-center gap-2 flex-1">
                          <div className="w-16 h-20 bg-neutral-50 flex-shrink-0">
                            {suggested.node.images.edges[0] && <img src={suggested.node.images.edges[0].node.url} alt="" className="w-full h-full object-cover mix-blend-multiply" />}
                          </div>
                          <p className="text-[9px] uppercase tracking-wider text-black font-medium leading-tight max-w-[80px]">{suggested.node.title}</p>
                        </div>
                      </div>

                      {/* Unified Size Selection */}
                      <div className="pt-4 border-t border-neutral-100">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3">Selecione o Tamanho do Conjunto</p>
                        <div className="flex flex-wrap gap-1">
                          {sizes.map(s => (
                            <button
                              key={s}
                              onClick={() => setBundleSize(s)}
                              className={`w-10 h-10 text-[10px] flex items-center justify-center border transition-all ${
                                bundleSize === s ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-400 hover:border-black'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 space-y-1">
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold text-black border-l-2 border-black pl-3 text-left">
                            R$ {comboPrice.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-xs text-neutral-400 line-through">
                            R$ {totalOriginal.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        {savings > 0 && (
                          <p className="text-[11px] text-green-600 font-medium pl-3 text-left">
                            Economize R$ {savings.toFixed(2).replace('.', ',')}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          if (!bundleProduct) {
                            toast.error("Produto não disponível no momento");
                            return;
                          }
                          setComboLoading(true);
                          try {
                            const targetVariant = bundleProduct.variants?.edges?.find(v => 
                              v.node.selectedOptions.some(so => (so.name === 'Size' || so.name === 'Tamanho') && so.value === bundleSize)
                            )?.node || bundleProduct.variants?.edges?.[0]?.node;

                            if (targetVariant) {
                              await addItem({
                                product: { node: bundleProduct },
                                variantId: targetVariant.id,
                                variantTitle: targetVariant.title,
                                price: targetVariant.price,
                                quantity: 1,
                                selectedOptions: targetVariant.selectedOptions || [],
                              });
                              toast.success("Conjunto adicionado!", { position: "top-center" });
                              setIsOpen(true);
                            } else {
                              toast.error("Variação não encontrada");
                            }
                          } catch (e) {
                            console.error("Erro ao adicionar combo:", e);
                            toast.error("Erro ao adicionar combo");
                          }
                          setComboLoading(false);
                        }}
                        disabled={comboLoading}
                        className="w-full h-11 bg-black text-white text-[11px] uppercase tracking-[0.2em] flex items-center justify-center transition-all active:scale-[0.98]"
                      >
                        {comboLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Comprar All Basic'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Design Accordion Tab */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setOpenTabs(prev => ({ ...prev, design: !prev.design }))}
                className="w-full px-4 md:px-6 lg:px-10 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-normal text-black">Design</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openTabs.design ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openTabs.design ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-4 md:px-6 lg:px-10 pb-5">
                  <div className="text-sm leading-relaxed text-neutral-600 space-y-4">
                    <p>Sua melhor versão não precisa de artifícios. O básico bem feito com Deus é o que sustenta o Reino. Comece em um ambiente limpo. Comece pelo fundamento.</p>
                    <div className="pt-2 space-y-2">
                      <p>• Malha 180g Premium.</p>
                      <p>• 100% Algodão Sustentável.</p>
                      <p>• Acabamento Premium.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medidas Accordion Tab */}
            {(() => {
              const titleLower = product.title.toLowerCase();
              const isBoxy = titleLower.includes("boxy");
              const isShorts = titleLower.includes("shorts");
              const isOversized = titleLower.includes("oversized") || titleLower.includes("2 t-shirt");
              const isConjunto = titleLower.includes("conjunto");
              
              if (!isBoxy && !isShorts && !isOversized && !isConjunto) return null;

              return (
                <div className="border-b border-neutral-200">
                  <button
                    onClick={() => setOpenTabs(prev => ({ ...prev, sizeChart: !prev.sizeChart }))}
                    className="w-full px-4 md:px-6 lg:px-10 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-normal text-black">Medidas</span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openTabs.sizeChart ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openTabs.sizeChart ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-4 md:px-6 lg:px-10 pb-5 overflow-x-auto space-y-8">
                      {isConjunto ? (
                        <>
                          <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black border-b border-neutral-100 pb-2">Camiseta</h3>
                            <SizeChart type="oversized" />
                          </div>
                          <div className="space-y-4 pt-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black border-b border-neutral-100 pb-2">Shorts</h3>
                            <SizeChart type="shorts" />
                          </div>
                        </>
                      ) : (
                        <>
                          {isBoxy && <SizeChart type="boxy" />}
                          {isShorts && <SizeChart type="shorts" />}
                          {isOversized && <SizeChart type="oversized" />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Envio Accordion Tab */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => setOpenTabs(prev => ({ ...prev, envio: !prev.envio }))}
                className="w-full px-4 md:px-6 lg:px-10 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-normal text-black">Envio</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openTabs.envio ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openTabs.envio ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-4 md:px-6 lg:px-10 pb-5">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Todas as nossas encomendas são enviadas pela Azul Cargo Express, com código de rastreio e total segurança. Não nos responsabilizamos por erros no preenchimento dos dados de envio, em casos de divergência resolvemos junto com você.
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Relacionados */}
      {allProducts && allProducts.length > 1 && (
        <div className="border-t border-neutral-200 bg-white">
          <div className="container py-16">
            <h2 className="text-center text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-10">
              Você também vai gostar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {allProducts
                .filter(p => p.node.id !== product.id)
                .slice(0, 4)
                .map(p => {
                  const title = p.node.title.toUpperCase();
                  const isFeatured = title === "PACK 3 T-SHIRT OVERSIZED BASIC";
                  
                  return (
                    <div key={p.node.id} className={isFeatured ? "col-span-2" : ""}>
                      <ProductCard product={p} isFeatured={isFeatured} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
