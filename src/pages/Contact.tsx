import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Mensagem enviada com sucesso!", { position: "top-center" });
        setFormData({ name: '', email: '', message: '' });
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="border-b border-neutral-200">
                <div className="container py-8">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em]">
                        Contato
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container py-12 flex-1">
                <div className="grid md:grid-cols-2 gap-16 max-w-5xl">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-6">
                                Informações
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">(11) 91010-5904</p>
                                        <p className="text-xs text-neutral-400 mt-1">WhatsApp disponível</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">suporte@vaseu.com.br</p>
                                        <p className="text-xs text-neutral-400 mt-1">Respondemos em até 48h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Segunda à Sexta</p>
                                        <p className="text-xs text-neutral-400 mt-1">09:00 às 17:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-6">
                            Envie sua mensagem
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-12 px-4 border border-neutral-300 bg-white text-sm focus:border-black focus:outline-none transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-2">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full h-12 px-4 border border-neutral-300 bg-white text-sm focus:border-black focus:outline-none transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-2">
                                    Mensagem
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-4 py-3 border border-neutral-300 bg-white text-sm focus:border-black focus:outline-none transition-colors resize-none"
                                    placeholder="Como podemos ajudá-lo?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full h-14 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {sending ? 'Enviando...' : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Enviar Mensagem
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
