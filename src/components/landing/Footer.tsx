import { MapPin } from "lucide-react";
import logo from "@/assets/logo-eni.png";

const Footer = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Calbert 72" className="h-8 w-auto brightness-200" />
          <span className="font-heading font-bold text-background">Calbert 72</span>
        </div>
        <div className="flex items-center gap-2 text-background/60 text-sm">
          <MapPin className="h-4 w-4" />
          Bata-Ngolo, Guinea Ecuatorial
        </div>
        <p className="text-background/60 text-sm">
          © {new Date().getFullYear()} Calbert 72. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
