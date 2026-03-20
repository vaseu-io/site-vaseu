import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Products = () => {
    const { data: products, isLoading, error } = useProducts();

    const sortedProducts = (() => {
        if (!products || products.length === 0) return [];
        
        const result = [...products];
        
        // Target titles (case insensitive)
        const featuredTitle = "2 T-SHIRT OVERSIZED BASIC BLACK&WHITE";
        const blackConjuntoTitle = "CONJUNTO T-SHIRT OVER E SHORTS ALL BASIC BLACK";
        const whiteConjuntoTitle = "CONJUNTO T-SHIRT OVER E SHORTS ALL BASIC WHITE";

        // Find the indices of the target products
        const featuredIndex = result.findIndex(p => p.node.title.toUpperCase() === featuredTitle);
        const blackIndex = result.findIndex(p => p.node.title.toUpperCase() === blackConjuntoTitle);
        const whiteIndex = result.findIndex(p => p.node.title.toUpperCase() === whiteConjuntoTitle);

        const itemsToMove: typeof result = [];

        // Extract products in a way that doesn't mess up indices
        // We'll collect those we find and then filter them out of the original result
        const targetTitles = [featuredTitle, blackConjuntoTitle, whiteConjuntoTitle];
        const extractedItems = result.filter(p => targetTitles.includes(p.node.title.toUpperCase()));
        const remainingItems = result.filter(p => !targetTitles.includes(p.node.title.toUpperCase()));

        // Order the extracted items: Featured first, then Black Conjunto, then White Conjunto
        const sortedFeatured = [
            extractedItems.find(p => p.node.title.toUpperCase() === featuredTitle),
            extractedItems.find(p => p.node.title.toUpperCase() === blackConjuntoTitle),
            extractedItems.find(p => p.node.title.toUpperCase() === whiteConjuntoTitle)
        ].filter(Boolean);

        // Insert at 3rd position (index 2)
        remainingItems.splice(2, 0, ...sortedFeatured as typeof result);

        return remainingItems;
    })();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="border-b border-border">
                <div className="container py-4">
                    <h1 className="text-xs text-foreground uppercase tracking-[0.2em]">
                        all collection - basic
                    </h1>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container py-8">
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm uppercase tracking-wider">
                            Erro ao carregar produtos
                        </p>
                    </div>
                )}

                {sortedProducts && sortedProducts.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm uppercase tracking-wider">
                            Nenhum produto encontrado
                        </p>
                    </div>
                )}

                {sortedProducts && sortedProducts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {sortedProducts.map((product) => {
                            const title = product.node.title.toUpperCase();
                            let originalPrice: number | undefined;
                            
                            const isFeatured = title === "2 T-SHIRT OVERSIZED BASIC BLACK&WHITE";

                            if (title.includes("CONJUNTO T-SHIRT OVER E SHORTS ALL BASIC")) {
                                const isBlack = title.includes("BLACK");
                                
                                // Dynamic calculation from current products if available
                                const overshirt = products?.find(p => 
                                    p.node.title.toUpperCase() === (isBlack ? "T-SHIRT OVERSIZED BASIC BLACK" : "T-SHIRT OVERSIZED BASIC WHITE")
                                );
                                const shorts = products?.find(p => 
                                    p.node.title.toUpperCase() === (isBlack ? "SHORTS MOLETINHO BASIC BLACK" : "SHORTS MOLETINHO BASIC WHITE")
                                );

                                if (overshirt && shorts) {
                                    originalPrice = parseFloat(overshirt.node.priceRange.minVariantPrice.amount) + 
                                                   parseFloat(shorts.node.priceRange.minVariantPrice.amount);
                                } else {
                                    // Fallback to discovered prices: 149.90 + 129.90
                                    originalPrice = 279.80;
                                }
                            }

                            if (isFeatured) {
                                const blackShirt = products?.find(p => p.node.title.toUpperCase() === "T-SHIRT OVERSIZED BASIC BLACK");
                                const whiteShirt = products?.find(p => p.node.title.toUpperCase() === "T-SHIRT OVERSIZED BASIC WHITE");
                                if (blackShirt && whiteShirt) {
                                    originalPrice = parseFloat(blackShirt.node.priceRange.minVariantPrice.amount) + 
                                                   parseFloat(whiteShirt.node.priceRange.minVariantPrice.amount);
                                } else {
                                    // Fallback: 149.90 * 2
                                    originalPrice = 299.80;
                                }
                            }

                            return (
                                <div key={product.node.id} className={isFeatured ? "col-span-2" : ""}>
                                    <ProductCard 
                                        product={product} 
                                        originalPrice={originalPrice} 
                                        isFeatured={isFeatured}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex-1" />
            <Footer />
        </div>
    );
};

export default Products;
