import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-destructive rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
            Bitem Global
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-3 leading-relaxed">
            Tu centro integral de <strong>GeQ Sport</strong>, <strong>Clínica Bitem</strong> y <strong>Peluquería Bitem</strong>. 
            Crea, Educa y Transforma tu bienestar con nosotros.
          </p>
          <p className="text-base text-primary-foreground/60 mb-8">
            📍 Bata-Ngolo, Guinea Ecuatorial
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#servicios">
              <Button size="lg" variant="secondary" className="font-heading font-semibold gap-2">
                Nuestros Servicios <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#contacto">
              <Button size="lg" variant="outline" className="font-heading font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Contáctanos
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
