import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-primary text-primary-foreground">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-[0.3em] uppercase">VASEU</h1>
          <p className="text-sm md:text-base tracking-[0.4em] uppercase opacity-80">Streetwear Company</p>
          <a
            href="#products"
            className="inline-block mt-8 border border-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-primary-foreground hover:text-primary transition-colors"
          >
            Ver Coleção
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container py-20">
        <h2 className="text-center text-xs uppercase tracking-[0.4em] text-muted-foreground mb-12">Produtos</h2>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="text-center text-destructive">Erro ao carregar produtos.</p>
        )}

        {products && products.length === 0 && (
          <p className="text-center text-muted-foreground">Nenhum produto encontrado.</p>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container text-center">
          <p className="text-xl font-black tracking-[0.3em] uppercase">VASEU</p>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Streetwear Company</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
