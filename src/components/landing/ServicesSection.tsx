import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import gymImg from "@/assets/service-gym.jpg";
import clinicImg from "@/assets/service-clinic.jpg";
import hairdresserImg from "@/assets/service-hairdresser.jpg";

const services = [
  {
    image: gymImg,
    title: "Gimnasia",
    description: "Entrenamiento personalizado, clases grupales y programas de fitness adaptados a tu nivel.",
  },
  {
    image: clinicImg,
    title: "Clínica Médica",
    description: "Consultas médicas, venta de medicamentos y atención profesional para tu salud.",
  },
  {
    image: hairdresserImg,
    title: "Peluquería",
    description: "Estilismo para hombres y mujeres. Cortes, tratamientos capilares y más.",
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
              <Card className="shadow-card hover:shadow-elevated transition-shadow h-full border-0 overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 font-heading text-xl font-bold text-primary-foreground">
                    {s.title}
                  </h3>
                </div>
                <CardContent className="p-6">
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
