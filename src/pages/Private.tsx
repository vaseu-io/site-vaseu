import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const Private = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Target date for countdown: April 4, 2026 (Pre-save/Preview)
    const targetDate = new Date("2026-04-04T10:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalização: minúsculas, remove acentos, remove espaços
    const normalizedInput = password
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    
    if (normalizedInput === "renunciadolegado") {
      setIsAuthenticated(true);
      toast.success("Acesso liberado.");
    } else {
      toast.error("Senha incorreta.");
      setPassword("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    toast.success("Inscrição realizada com sucesso! Você será notificado.");
    setFormData({ name: "", email: "", phone: "" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FF1B1B] md:bg-[#BA3329] flex flex-col items-center justify-center p-4 font-sans text-[#EDC967]">
        <div className="max-w-md w-full space-y-8 text-center bg-black/20 p-8 border-2 border-[#EDC967] backdrop-blur-sm">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-2 border-[#EDC967] flex items-center justify-center rounded-full mb-4">
               <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">ACESSO PRIVADO</h1>
          <p className="text-sm uppercase tracking-widest opacity-80">Digite a senha para continuar</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input 
              type="password"
              placeholder="SENHA"
              className="bg-transparent border-[#EDC967] text-[#EDC967] placeholder:text-[#EDC967]/50 focus-visible:ring-[#EDC967] rounded-none border-2 h-12 text-center text-lg tracking-[0.5em]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button 
              type="submit"
              className="w-full bg-[#EDC967] text-[#BA3329] hover:bg-[#D4AF37] font-black uppercase tracking-widest h-12 rounded-none"
            >
              ENTRAR
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FF1B1B] md:bg-[#BA3329] flex flex-col items-center justify-center p-4 font-sans text-[#EDC967] overflow-x-hidden relative">
      {/* Background elements like lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-[1px] bg-[#EDC967] absolute left-[10%]"></div>
        <div className="h-full w-[1px] bg-[#EDC967] absolute right-[10%]"></div>
      </div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10 py-12">
        
        {/* Left Section - Vertical Title like the image */}
        <div className="hidden md:block">
          <h1 className="text-8xl font-black uppercase tracking-tighter transform -rotate-90 origin-bottom leading-none whitespace-nowrap" style={{ height: '0', display: 'inline-block' }}>
            DROP PANAMERA
          </h1>
        </div>
        
        {/* Mobile Title */}
        <div className="md:hidden text-center mb-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none animate-pulse">
            DROP <br /> PANAMERA
          </h1>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-8">
             <img src="https://flagcdn.com/w40/br.png" alt="Brazil" className="w-8 h-auto shadow-lg" />
             <div className="w-[2px] h-8 bg-[#EDC967]"></div>
             <img src="https://flagcdn.com/w40/mx.png" alt="Mexico" className="w-8 h-auto shadow-lg" />
          </div>

          <div className="border-y-2 border-[#EDC967] py-6 mb-8 w-full max-w-md">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4">Convite Oficial - Prévia 1</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-black">{timeLeft.days}</span>
                <span className="text-[10px] uppercase font-bold opacity-80">Dias</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black">{timeLeft.hours}</span>
                <span className="text-[10px] uppercase font-bold opacity-80">Horas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black">{timeLeft.minutes}</span>
                <span className="text-[10px] uppercase font-bold opacity-80">Min</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black">{timeLeft.seconds}</span>
                <span className="text-[10px] uppercase font-bold opacity-80">Seg</span>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-8 max-w-md leading-relaxed">
            dia 04/04, prévia antecipada, <br />
            preencha o formulário para receber em primeira mao.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-transparent md:bg-[#BA3329] p-2 md:p-8 border-none md:border-2 md:border-[#EDC967] shadow-none">
            <div className="space-y-2 text-left">
              <Label htmlFor="name" className="text-[#EDC967] uppercase font-bold text-xs tracking-widest">Nome Completo</Label>
              <Input 
                id="name" 
                placeholder="SEU NOME" 
                className="bg-transparent border-[#EDC967] text-[#EDC967] placeholder:text-[#EDC967]/50 focus-visible:ring-[#EDC967] rounded-none border-2 h-12"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-[#EDC967] uppercase font-bold text-xs tracking-widest">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="SEU@EMAIL.COM" 
                className="bg-transparent border-[#EDC967] text-[#EDC967] placeholder:text-[#EDC967]/50 focus-visible:ring-[#EDC967] rounded-none border-2 h-12"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="phone" className="text-[#EDC967] uppercase font-bold text-xs tracking-widest">WhatsApp / Telefone</Label>
              <Input 
                id="phone" 
                placeholder="(00) 00000-0000" 
                className="bg-transparent border-[#EDC967] text-[#EDC967] placeholder:text-[#EDC967]/50 focus-visible:ring-[#EDC967] rounded-none border-2 h-12"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#EDC967] text-[#BA3329] hover:bg-[#D4AF37] font-black uppercase tracking-widest h-14 rounded-none text-lg transition-all"
            >
              GARANTIR ACESSO
            </Button>
          </form>

          {/* Ticket info visible on mobile below the form */}
          <div className="md:hidden mt-12 flex flex-col items-center w-full max-w-md pt-8 border-t border-[#EDC967]/30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 bg-[#EDC967] text-[#FF1B1B] px-4 py-1">
              DATA DO DROP OFICIAL
            </p>
            <div className="flex gap-6 items-start">
              {/* Vertical line from anexo */}
              <div className="w-[3px] h-48 bg-[#EDC967]"></div>
              
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Data</p>
                  <p className="text-3xl font-black leading-none">12 MAIO</p>
                </div>
                <div>
                  <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Hora</p>
                  <p className="text-3xl font-black leading-none">10.AM</p>
                </div>
                <div>
                  <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Local</p>
                  <p className="text-3xl font-black leading-none">ONLINE</p>
                </div>
                <div className="mt-4">
                   <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 italic">Vaseu Official Next Drop - 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Additional Ticket Info (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 items-center border-l-2 border-[#EDC967] pl-8">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 bg-[#EDC967] text-[#BA3329] px-4 py-1 whitespace-nowrap">
              DATA DO DROP OFICIAL
           </p>
           <div className="flex gap-6 items-start">
             <div className="flex flex-col gap-12 font-mono text-sm ">
              <div>
                <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Data</p>
                <p className="text-2xl font-black">12 MAIO</p>
              </div>
              <div>
                <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Hora</p>
                <p className="text-2xl font-black">10.AM</p>
              </div>
              <div>
                <p className="opacity-60 uppercase text-[10px] tracking-widest font-bold">Local</p>
                <p className="text-2xl font-black">ONLINE</p>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] transform rotate-90 origin-left whitespace-nowrap opacity-40 uppercase tracking-[0.5em]">VASEU OFFICIAL NEXT DROP - 2026</p>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative vertical text on the right side of the screen (Desktop only) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
        <p className="text-xs uppercase tracking-[0.5em] font-bold opacity-30 transform rotate-90 origin-center whitespace-nowrap">
          A CORRIDA NÃO PARA • NEXT DROP • PANAMERA SERIES
        </p>
      </div>
    </div>
  );
};

export default Private;
