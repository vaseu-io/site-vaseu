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
                        <h4 className="text-sm italic text-neutral-400 mb-4">
                            Nós aceitamos
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {/* AMEX */}
                            <div className="w-12 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#016fd0' }}>
                                <span className="text-[8px] font-bold text-white tracking-wide">AMEX</span>
                            </div>
                            {/* Boleto */}
                            <div className="w-12 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#3e3e3e' }}>
                                <span className="text-[7px] font-bold text-white">Boleto</span>
                            </div>
                            {/* Elo */}
                            <div className="w-12 h-8 rounded flex items-center justify-center bg-black">
                                <span className="text-[10px] font-bold" style={{ color: '#ffcb05' }}>elo</span>
                            </div>
                            {/* Hipercard */}
                            <div className="w-12 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#822124' }}>
                                <span className="text-[6px] font-bold text-white">hipercard</span>
                            </div>
                            {/* Mastercard */}
                            <div className="w-12 h-8 rounded flex items-center justify-center bg-white overflow-hidden p-1">
                                <svg viewBox="0 0 40 24" className="w-full h-full">
                                    <circle cx="15" cy="12" r="8" fill="#EB001B" />
                                    <circle cx="25" cy="12" r="8" fill="#F79E1B" />
                                    <path d="M20 5.8a8 8 0 010 12.4 8 8 0 000-12.4z" fill="#FF5F00" />
                                </svg>
                            </div>
                            {/* Visa */}
                            <div className="w-12 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#1a1f71' }}>
                                <span className="text-[9px] font-bold italic text-white">VISA</span>
                            </div>
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
