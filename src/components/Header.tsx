import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-black tracking-[0.3em] uppercase">VASEU</span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground -mt-1">Streetwear Company</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <a href="#products" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            Produtos
          </a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
};
