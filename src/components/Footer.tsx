import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-white">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Legal Info */}
                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
                            Informações Legais
                        </h4>
                        <div className="space-y-2 text-sm text-neutral-400 leading-relaxed">
                            <p>53.416.490 GUILHERME LUCENTE TAVARES</p>
                            <p>Lázaro Pinto de Souza, Mogi das Cruzes, SP</p>
                            <p>CEP: 08730-790</p>
                            <p>CNPJ: 53.416.490/0001-78</p>
                        </div>
                    </div>

                    {/* Menu */}
                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
                            Menu
                        </h4>
                        <nav className="space-y-3">
                            <Link to="/produtos" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                                Todos os Produtos
                            </Link>
                            <Link to="/contato" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                                Contato
                            </Link>
                            <Link to="/trocas-e-devolucoes" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                                Trocas e Devoluções
                            </Link>
                            <a
                                href="https://www.instagram.com/vaseu_company/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                                @vaseu_company
                            </a>
                        </nav>
                    </div>

                    {/* Payment & Social */}
                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
                            Formas de Pagamento
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {['Visa', 'Mastercard', 'Amex', 'Elo', 'Hipercard', 'Boleto', 'Pix'].map((method) => (
                                <span
                                    key={method}
                                    className="px-3 py-1.5 border border-neutral-700 text-[10px] uppercase tracking-wider text-neutral-400"
                                >
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-[0.15em]">
                        © {new Date().getFullYear()} Vaseu. Todos os direitos reservados.
                    </p>
                    <p className="text-[11px] text-neutral-500">
                        Desenvolvido com ♥
                    </p>
                </div>
            </div>
        </footer>
    );
};
