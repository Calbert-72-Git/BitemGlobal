import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Dumbbell, Stethoscope, Scissors, Star } from "lucide-react";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";
import gymImg from "@/assets/service-gym.jpg";
import clinicImg from "@/assets/service-clinic.jpg";
import hairdresserImg from "@/assets/service-hairdresser.jpg";

const services = [
  {
    image: gymImg, logo: logoGym, title: "GeQ Sport", icon: Dumbbell,
    description: "Entrenamiento personalizado, clases grupales y programas de fitness.",
    offers: ["Membresía mensual", "Clases personalizadas", "Entrenamiento grupal", "Plan nutrición"],
  },
  {
    image: clinicImg, logo: logoClinica, title: "Clínica Bitem", icon: Stethoscope,
    description: "Consultas médicas, medicamentos y atención profesional.",
    offers: ["Consultas generales", "Venta de medicamentos", "Análisis clínicos", "Control preventivo"],
  },
  {
    image: hairdresserImg, logo: logoPeluqueria, title: "Peluquería Bitem", icon: Scissors,
    description: "Estilismo profesional para hombres y mujeres.",
    offers: ["Cortes modernos", "Tintes y mechas", "Tratamiento capilar", "Estilismo nupcial"],
  },
];

const WelcomePage = () => {
  return (
    <div className="min-h-[80vh] space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-primary-foreground"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 animate-pulse" />
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-sm">
              Cuenta pendiente de activación
            </Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            ¡Bienvenido a Bitem Global!
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-6">
            Tu cuenta ha sido creada exitosamente. El administrador revisará tu solicitud y te asignará los permisos necesarios para acceder al sistema.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm">
            <Shield className="h-4 w-4" />
            <span>Mientras tanto, descubre nuestros servicios y ofertas</span>
          </div>
        </div>
      </motion.div>

      {/* Services Showcase */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">Nuestros Servicios y Ofertas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <Card className="shadow-card border-0 overflow-hidden h-full hover:shadow-elevated transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={s.logo} alt={s.title} className="h-10 w-10 rounded-lg bg-card p-1 object-contain" />
                    <div>
                      <h3 className="font-heading font-bold text-primary-foreground text-lg">{s.title}</h3>
                      <p className="text-xs text-primary-foreground/70">{s.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ofertas disponibles</p>
                  <div className="space-y-2">
                    {s.offers.map(offer => (
                      <div key={offer} className="flex items-center gap-2 text-sm">
                        <Star className="h-3.5 w-3.5 text-warning shrink-0" />
                        <span className="text-foreground">{offer}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          ¿Necesitas ayuda? Contacta al administrador: <strong>calbertutm@gmail.com</strong> | <strong>+240 222 176 082</strong>
        </p>
        <p className="text-xs text-muted-foreground mt-2">©Soportado por Calbert 72</p>
      </div>
    </div>
  );
};

export default WelcomePage;
