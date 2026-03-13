import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";

const Tracking = () => {
  useEffect(() => {
    window.location.href = "https://www.azulcargoexpress.com.br/Rastreio";
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
        <h1 className="text-xl font-medium tracking-widest uppercase mb-2">
          Redirecionando para o Rastreio
        </h1>
        <p className="text-sm text-neutral-500 max-w-md">
          Você está sendo redirecionado para a página de rastreio da Azul Cargo Express.
          Se não for redirecionado automaticamente, <a href="https://www.azulcargoexpress.com.br/Rastreio" className="underline hover:text-black">clique aqui</a>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;
