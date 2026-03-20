import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";

/**
 * Checkout fallback page.
 * In production, Vercel rewrites should catch /checkout/* and proxy to Yampi.
 * If this page loads, it means:
 * 1. We're in development mode (no rewrites).
 * 2. The rewrite failed or let the request through to the SPA.
 */
const Checkout = () => {
  useEffect(() => {
    // Basic diagnostic
    console.log("Checkout page loaded as a fallback/SPA route.");
    
    // If we're here and there's a token but no rewrite, we might want to redirect manually
    // but the rewrite is the preferred way for the "clean URL" stay-in-address-bar feature.
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
        <h1 className="text-xl font-medium tracking-widest uppercase mb-2">
          Finalizando seu pedido
        </h1>
        <p className="text-sm text-neutral-500 max-w-md">
          Estamos preparando seu checkout seguro. Você será redirecionado para o pagamento em instantes.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
