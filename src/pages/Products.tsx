import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Products = () => {
    const { data: products, isLoading, error } = useProducts();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="border-b border-border">
                <div className="container py-8">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em]">
                        All Collection
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

                {products && products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm uppercase tracking-wider">
                            Nenhum produto encontrado
                        </p>
                    </div>
                )}

                {products && products.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {products.map((product) => (
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
