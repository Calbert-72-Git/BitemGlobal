import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-eni.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Bitem Global" className="h-12 w-auto" />
          <div className="flex flex-col">
            <span className={`font-heading font-extrabold text-xl leading-tight ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
              Bitem Global
            </span>
            <span className={`text-[10px] font-medium tracking-widest uppercase ${scrolled ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
              Bienestar Integral
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Servicios", "Nosotros", "Contacto"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {label}
            </a>
          ))}
          <Link to="/login">
            <Button size="sm" className="font-heading font-semibold px-6 rounded-full shadow-elevated">
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        <button
          className={`md:hidden p-2 rounded-lg transition ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2">
          {["Servicios", "Nosotros", "Contacto"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="block text-sm font-semibold text-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full font-heading font-semibold rounded-full">Iniciar Sesión</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
