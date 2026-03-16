import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo-eni.png";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";

const Footer = () => {
  return (
    <footer className="relative bg-foreground text-primary-foreground overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Bitem Global" className="h-12 w-auto brightness-200" />
              <div>
                <span className="font-heading font-extrabold text-lg block leading-tight">Bitem Global</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-primary-foreground/40">Bienestar Integral</span>
              </div>
            </div>
            <p className="text-primary-foreground/40 text-sm leading-relaxed">
              Centro integral de bienestar: gimnasia, salud y estilismo en Bata-Ngolo, Guinea Ecuatorial.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5 text-primary-foreground/70">Servicios</h4>
            <div className="space-y-4">
              {[
                { logo: logoGym, name: "GeQ Sport", desc: "Gimnasio y Fitness" },
                { logo: logoClinica, name: "Clínica Bitem", desc: "Salud y Medicamentos" },
                { logo: logoPeluqueria, name: "Peluquería Bitem", desc: "Estilismo Profesional" },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <img src={s.logo} alt={s.name} className="h-8 w-8 rounded-lg object-contain bg-primary-foreground/5 p-1" />
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">{s.name}</p>
                    <p className="text-xs text-primary-foreground/30">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5 text-primary-foreground/70">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-primary-foreground/50"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><span>Bata-Ngolo, Guinea Ecuatorial</span></li>
              <li className="flex items-center gap-3 text-primary-foreground/50"><Phone className="h-4 w-4 shrink-0 text-primary" /><span>+240 222 176 082</span></li>
              <li className="flex items-center gap-3 text-primary-foreground/50"><Mail className="h-4 w-4 shrink-0 text-primary" /><span>calbertutm@gmail.com</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5 text-primary-foreground/70">Acceso Rápido</h4>
            <ul className="space-y-3">
              {[{ label: "Servicios", href: "#servicios" }, { label: "Contacto", href: "#contacto" }].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />{link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors group">
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />Panel de Gestión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/5">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/25">© {new Date().getFullYear()} Bitem Global. Todos los derechos reservados.</p>
          <p className="text-xs text-primary-foreground/20">©Soportado por Calbert 72</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
