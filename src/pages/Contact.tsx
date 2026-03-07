import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, Clock } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="border-b border-border">
                <div className="container py-4">
                    <h1 className="text-xs text-foreground uppercase tracking-[0.2em]">
                        Contato
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container py-16 flex-1">
                <div className="max-w-2xl mx-auto">

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">

                        {/* Phone */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Telefone
                                </span>
                            </div>
                            <p className="text-sm font-medium">
                                (11) 91010-5904
                            </p>
                        </div>

                        {/* Email */}
                        <div className="p-8 border-b border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    E-mail
                                </span>
                            </div>
                            <p className="text-sm font-medium">
                                suporte@vaseu.com.br
                            </p>
                        </div>

                        {/* Hours - Full Width */}
                        <div className="p-8 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Horário de Atendimento
                                </span>
                            </div>
                            <p className="text-sm font-medium">
                                Segunda à sexta, das 09:00 às 17:00
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Canais disponíveis: aplicativo e ligações
                            </p>
                        </div>
                    </div>

                    {/* Response Time Notice */}
                    <div className="mt-8 p-6 bg-muted/50 border border-border text-center">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                            Tempo de resposta
                        </p>
                        <p className="text-sm font-medium mt-2">
                            Nosso tempo de resposta através de e-mail e telefone é de 48 horas.
                        </p>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
