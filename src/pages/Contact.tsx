import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Contact = () => {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />

            {/* Content */}
            <div className="flex-1 flex items-center justify-center py-16 px-4" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="text-center max-w-xl space-y-8">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Contato
                    </h1>

                    <div className="space-y-1">
                        <p className="text-sm md:text-base">
                            TELEFONE: (11) 91010-5904
                        </p>
                        <p className="text-sm md:text-base">
                            suporte@vaseu.com.br
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm md:text-base text-neutral-600">
                            O horário dos nossos canais de atendimento: aplicativo e ligações.
                        </p>
                        <p className="text-sm md:text-base text-neutral-600">
                            Segunda à sexta, das 09:00 às 17:00.
                        </p>
                    </div>

                    <p className="text-sm md:text-base text-neutral-600">
                        Nosso tempo de resposta através de e-mail, telefone é de 48 horas.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
