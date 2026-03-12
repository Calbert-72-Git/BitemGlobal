import logo from "@/assets/logo-eni.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Bitem Global" className="h-10 w-auto brightness-200" />
              <span className="font-heading font-bold text-lg text-primary-foreground">Bitem Global</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Centro integral de bienestar: gimnasia, salud y estilismo en Bata-Ngolo, Guinea Ecuatorial.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>GeQ Sport - Gimnasia</li>
              <li>Clínica Bitem - Salud</li>
              <li>Peluquería Bitem - Estilismo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>📍 Bata-Ngolo, Guinea Ecuatorial</li>
              <li>📞 +240 222 176 082</li>
              <li>✉️ calbertutm@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} Bitem Global. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
