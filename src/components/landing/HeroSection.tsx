import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-foreground">
      {/* Apple-style clean gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-full px-5 py-2 mb-8">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-primary-foreground/70 tracking-widest uppercase">Bata-Ngolo, Guinea Ecuatorial</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-6xl md:text-8xl lg:text-9xl font-extrabold text-primary-foreground leading-none mb-6 tracking-tight"
          >
            Bitem
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
              Global
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-primary-foreground/50 mb-4 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Tu centro integral de bienestar.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-primary-foreground/30 mb-12"
          >
            Crea · Educa · Transforma
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            <a href="#servicios">
              <Button size="lg" className="font-heading font-bold gap-2 rounded-full px-10 py-6 text-base shadow-elevated">
                Descubre Más <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#contacto">
              <Button
                size="lg"
                variant="outline"
                className="font-heading font-semibold rounded-full px-10 py-6 text-base border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/5"
              >
                Contáctanos
              </Button>
            </a>
          </motion.div>

          {/* Service cards - Apple product showcase style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            {[
              { logo: logoGym, name: "GeQ Sport", desc: "Gimnasio & Fitness" },
              { logo: logoClinica, name: "Clínica Bitem", desc: "Salud & Medicamentos" },
              { logo: logoPeluqueria, name: "Peluquería Bitem", desc: "Estilismo Profesional" },
            ].map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-primary-foreground/8 transition-all duration-300 hover:scale-[1.02]"
              >
                <img src={s.logo} alt={s.name} className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-contain bg-card/90 p-2" />
                <div className="text-center">
                  <p className="font-heading font-bold text-primary-foreground text-sm md:text-base">{s.name}</p>
                  <p className="text-xs text-primary-foreground/40 mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
