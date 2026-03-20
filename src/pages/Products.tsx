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
        const blackConjuntoTitle = "CONJUNTO T-SHIRT OVER E SHORTS ALL BASIC BLACK";
        const whiteConjuntoTitle = "CONJUNTO T-SHIRT OVER E SHORTS ALL BASIC WHITE";

        // Find the indices of the target products
        const blackIndex = result.findIndex(p => p.node.title.toUpperCase() === blackConjuntoTitle);
        const whiteIndex = result.findIndex(p => p.node.title.toUpperCase() === whiteConjuntoTitle);

        const itemsToMove: typeof result = [];

        // Extract products if found
        // Note: we extract from right to left or carefully as indices change
        if (blackIndex !== -1) {
            const [item] = result.splice(blackIndex, 1);
            itemsToMove.push(item);
        }
        
        // Re-find whiteIndex after black is removed
        const whiteIndexCurrent = result.findIndex(p => p.node.title.toUpperCase() === whiteConjuntoTitle);
        if (whiteIndexCurrent !== -1) {
            const [item] = result.splice(whiteIndexCurrent, 1);
            itemsToMove.push(item);
        }

        // Insert at 3rd and 4th positions (index 2 and 3)
        // If we have both, insert them. If only one, insert one.
        // We sort them within itemsToMove to ensure Black is first if both are there
        itemsToMove.sort((a, b) => {
            if (a.node.title.toUpperCase() === blackConjuntoTitle) return -1;
            return 1;
        });

        result.splice(2, 0, ...itemsToMove);

        return result;
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
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.node.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1" />
            <Footer />
        </div>
    );
};

export default Products;
