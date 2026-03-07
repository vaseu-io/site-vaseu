import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const ExchangeReturns = () => {
    const rules = [
        {
            title: "Primeira troca gratuita",
            description: "Sua primeira troca é por nossa conta! Nós cobrimos o frete de envio e retorno."
        },
        {
            title: "Prazo de 7 dias",
            description: "Você tem até 7 dias corridos após o recebimento do produto para solicitar a troca ou devolução."
        },
        {
            title: "Condição do produto",
            description: "O produto deve estar em perfeito estado, sem uso, com etiqueta intacta e na embalagem original."
        },
        {
            title: "Envio de fotos reais",
            description: "Para iniciar o processo, envie fotos reais do produto pelo nosso canal de suporte. Isso agiliza a análise."
        },
        {
            title: "Reembolso",
            description: "Após a análise e aprovação da devolução, o reembolso será processado em até 10 dias úteis."
        },
    ];

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="border-b border-neutral-200">
                <div className="container py-8">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em]">
                        Trocas e Devoluções
                    </h1>
                    <p className="text-xs text-neutral-400 mt-2 uppercase tracking-[0.2em]">
                        Regras do Game
                    </p>
                </div>
            </div>

            {/* Rules */}
            <div className="container py-12 flex-1">
                <div className="max-w-3xl space-y-0">
                    {rules.map((rule, index) => (
                        <div
                            key={index}
                            className="border-b border-neutral-200 py-8 first:pt-0"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-[11px] text-neutral-300 font-mono mt-1">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-2">
                                        {rule.title}
                                    </h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">
                                        {rule.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="max-w-3xl mt-12 p-8 bg-neutral-50 border border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-2">
                        Precisa de ajuda?
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">
                        Entre em contato conosco pelo e-mail suporte@vaseu.com.br ou pela nossa página de contato.
                    </p>
                    <a
                        href="/contato"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium hover:gap-3 transition-all"
                    >
                        Fale Conosco <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExchangeReturns;
