import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone } from "lucide-react";
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
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Calbert%2072%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n.`}
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
          className="mt-8 flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm">+240 222 176 082</span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
