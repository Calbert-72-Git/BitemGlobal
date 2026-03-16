import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import gymImg from "@/assets/service-gym.jpg";
import clinicImg from "@/assets/service-clinic.jpg";
import hairdresserImg from "@/assets/service-hairdresser.jpg";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";

const services = [
  {
    image: gymImg, logo: logoGym, title: "GeQ Sport",
    description: "Entrenamiento personalizado, clases grupales y programas de fitness adaptados a tu nivel.",
    features: ["Equipamiento moderno", "Clases dirigidas", "Planes personalizados"],
  },
  {
    image: clinicImg, logo: logoClinica, title: "Clínica Bitem",
    description: "Consultas médicas, venta de medicamentos y atención profesional para tu salud.",
    features: ["Consultas generales", "Medicamentos", "Atención profesional"],
  },
  {
    image: hairdresserImg, logo: logoPeluqueria, title: "Peluquería Bitem",
    description: "Estilismo para hombres y mujeres. Cortes, tratamientos capilares y más.",
    features: ["Cortes modernos", "Tratamientos capilares", "Estilismo profesional"],
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-4">Nuestros Servicios</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            Todo lo que<br />necesitas
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Tres secciones especializadas bajo un mismo techo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="shadow-card hover:shadow-elevated transition-all duration-500 h-full border-0 overflow-hidden group rounded-3xl">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={s.image} alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-5 left-6 flex items-center gap-3">
                    <img src={s.logo} alt={`Logo ${s.title}`} className="h-12 w-12 rounded-2xl bg-card/90 p-1.5 object-contain shadow-lg" />
                    <h3 className="font-heading text-2xl font-bold text-primary-foreground">{s.title}</h3>
                  </div>
                </div>
                <CardContent className="p-7">
                  <p className="text-muted-foreground leading-relaxed mb-5">{s.description}</p>
                  <div className="space-y-2">
                    {s.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
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
