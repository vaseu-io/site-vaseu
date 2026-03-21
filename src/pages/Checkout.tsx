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
    // Extract token from path (e.g. /checkout/TOKEN)
    const pathParts = window.location.pathname.split('/');
    const pathToken = pathParts[pathParts.length - 1];

    // Check if we have tokenReference or other query params
    const searchParams = new URLSearchParams(window.location.search);
    const hasCheckoutParams = searchParams.has('tokenReference') || window.location.search.length > 1;

    if ((pathToken && pathToken !== 'checkout') || hasCheckoutParams) {
      console.log("Checkout data detected, redirecting to Yampi.");
      
      // Delay slightly for better UX (showing the loader)
      const timer = setTimeout(() => {
        if (pathToken && pathToken !== 'checkout') {
          window.location.href = `https://vaseu2.pay.yampi.com.br/r/${pathToken}${window.location.search}`;
        } else {
          window.location.href = `https://vaseu2.pay.yampi.com.br/checkout${window.location.search}`;
        }
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      console.log("No token found in path, staying on fallback page.");
    }
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
