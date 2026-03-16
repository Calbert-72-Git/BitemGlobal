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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/80 backdrop-blur-2xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Bitem Global" className="h-10 w-auto" />
          <span className={`font-heading font-extrabold text-lg tracking-tight ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
            Bitem Global
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Servicios", "Nosotros", "Contacto"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className={`text-sm font-medium tracking-wide transition-colors ${
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {label}
            </a>
          ))}
          <Link to="/login">
            <Button size="sm" className="font-heading font-semibold px-6 rounded-full">
              Acceder
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
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 space-y-4">
          {["Servicios", "Nosotros", "Contacto"].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} className="block text-sm font-medium text-foreground" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full font-heading font-semibold rounded-full">Acceder</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
