import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "240222176082";
const EMAIL = "calbertutm@gmail.com";

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Contáctanos</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Estamos aquí para ayudarte. Escríbenos por WhatsApp o envíanos un correo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Calbert 72, me gustaría obtener más información.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="gap-3 bg-accent hover:bg-accent/90 text-accent-foreground font-heading font-semibold px-8">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </a>

          <a href={`mailto:${EMAIL}`}>
            <Button size="lg" variant="outline" className="gap-3 font-heading font-semibold px-8">
              <Mail className="h-5 w-5" />
              {EMAIL}
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+240 222 176 082</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Bata-Ngolo, Guinea Ecuatorial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
