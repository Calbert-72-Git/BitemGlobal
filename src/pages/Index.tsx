import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <section id="nosotros" className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Sobre Nosotros</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bitem Global es un centro integral que reúne tres servicios esenciales: <strong>GeQ Sport</strong> para tu forma física, 
            <strong> Clínica Bitem</strong> con venta de medicamentos para tu salud, y <strong>Peluquería Bitem</strong> profesional para hombres y mujeres. 
            Nuestro compromiso es crear, educar y transformar la vida de nuestros clientes en Bata-Ngolo, Guinea Ecuatorial.
          </p>
        </div>
      </section>
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
