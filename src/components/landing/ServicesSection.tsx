import { motion } from "framer-motion";
import { Dumbbell, Stethoscope, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Dumbbell,
    title: "Gimnasia",
    description: "Entrenamiento personalizado, clases grupales y programas de fitness adaptados a tu nivel.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Stethoscope,
    title: "Clínica Médica",
    description: "Consultas médicas, venta de medicamentos y atención profesional para tu salud.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Scissors,
    title: "Peluquería",
    description: "Estilismo para hombres y mujeres. Cortes, tratamientos capilares y más.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tres secciones especializadas bajo un mismo techo para cuidar de ti.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="shadow-card hover:shadow-elevated transition-shadow h-full border-0">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${s.bg} mb-6`}>
                    <s.icon className={`h-8 w-8 ${s.color}`} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
