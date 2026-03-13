import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-24 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-warning/10 rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6"
            >
              <MapPin className="h-3.5 w-3.5 text-accent-foreground" />
              <span className="text-xs font-semibold text-primary-foreground/90 tracking-wide">Bata-Ngolo, Guinea Ecuatorial</span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-primary-foreground leading-[1.1] mb-6">
              Bitem
              <br />
              <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground to-accent-foreground bg-clip-text text-transparent">
                Global
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/75 mb-4 leading-relaxed max-w-lg">
              Tu centro integral de bienestar. <strong className="text-primary-foreground">Crea, Educa y Transforma</strong> tu vida con nosotros.
            </p>

            <p className="text-sm text-primary-foreground/50 mb-8">
              Gimnasia · Salud · Estilismo — Todo bajo un mismo techo.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#servicios">
                <Button size="lg" variant="secondary" className="font-heading font-bold gap-2 rounded-full px-8 shadow-elevated">
                  Descubre Más <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#contacto">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-heading font-semibold rounded-full px-8 border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contáctanos
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Service logos showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-center justify-center gap-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { logo: logoGym, name: "GeQ Sport", desc: "Gimnasio" },
                { logo: logoClinica, name: "Clínica Bitem", desc: "Salud" },
              ].map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-primary-foreground/15 transition-colors"
                >
                  <img src={s.logo} alt={s.name} className="h-16 w-16 rounded-xl object-contain bg-card/90 p-2" />
                  <div className="text-center">
                    <p className="font-heading font-bold text-primary-foreground text-sm">{s.name}</p>
                    <p className="text-xs text-primary-foreground/50">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 rounded-2xl p-6 flex flex-col items-center gap-3 w-1/2 hover:bg-primary-foreground/15 transition-colors"
            >
              <img src={logoPeluqueria} alt="Peluquería Bitem" className="h-16 w-16 rounded-xl object-contain bg-card/90 p-2" />
              <div className="text-center">
                <p className="font-heading font-bold text-primary-foreground text-sm">Peluquería Bitem</p>
                <p className="text-xs text-primary-foreground/50">Estilismo</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0,60 C360,20 720,80 1440,40 L1440,80 L0,80 Z" fill="hsl(210 20% 98%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
