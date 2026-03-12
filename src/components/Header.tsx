import { useState } from "react";
import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex flex-col flex-shrink-0">
          <span className="text-lg md:text-xl font-black tracking-[0.2em] md:tracking-[0.3em] uppercase">VASEU</span>
          <span className="text-[8px] md:text-[9px] tracking-[0.1em] md:tracking-[0.25em] uppercase text-muted-foreground -mt-1">Streetwear Company</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/produtos" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            All Collection
          </Link>
          <Link to="/contato" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </Link>
          <Link to="/trocas-e-devolucoes" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            Trocas e Devoluções
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartDrawer />
          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-muted-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/produtos"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              All Collection
            </Link>
            <Link
              to="/contato"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Contato
            </Link>
            <Link
              to="/trocas-e-devolucoes"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Trocas e Devoluções
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
