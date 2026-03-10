import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-eni.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Calbert 72" className="h-10 w-auto" />
          <span className="font-heading font-bold text-lg text-foreground">Calbert 72</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Servicios</a>
          <a href="#nosotros" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Nosotros</a>
          <a href="#contacto" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contacto</a>
          <Link to="/login">
            <Button size="sm">Iniciar Sesión</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <a href="#servicios" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Servicios</a>
          <a href="#nosotros" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Nosotros</a>
          <a href="#contacto" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Contacto</a>
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full">Iniciar Sesión</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
