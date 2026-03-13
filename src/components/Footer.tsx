


export const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-white">
            <div className="container py-12">
                <div className="grid grid-cols-1 gap-10">

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
                </div>

                {/* Divider + Copyright */}
                <div className="border-t border-neutral-800 mt-10 pt-6 flex justify-center items-center gap-4">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-[0.15em] text-center w-full px-4 leading-relaxed">
                        © {new Date().getFullYear()} Vaseu. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};
