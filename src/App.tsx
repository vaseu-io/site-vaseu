import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useLayoutEffect, lazy, Suspense } from "react";
import { useCartSync } from "@/hooks/useCartSync";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/products"));
const Contact = lazy(() => import("./pages/Contact"));
const ExchangeReturns = lazy(() => import("./pages/ExchangeReturns"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Timer = lazy(() => import("./pages/Timer"));
const Private = lazy(() => import("./pages/Private"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800" />
  </div>
);

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
  }, [pathname, search]);

  return null;
};

const PixelTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // @ts-ignore
    if (window.fbq) {
      // @ts-ignore
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
};

const AppContent = () => {
  useCartSync();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PixelTracker />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:handle" element={<ProductDetail />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/products" element={<Navigate to="/produtos" replace />} />
          <Route path="/produto" element={<Navigate to="/produtos" replace />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/trocas-e-devolucoes" element={<ExchangeReturns />} />
          <Route path="/rastreio" element={<Tracking />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/privado" element={<Private />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
