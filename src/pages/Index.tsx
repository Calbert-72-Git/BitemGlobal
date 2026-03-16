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
      <section id="nosotros" className="py-32 bg-card">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-4">Sobre Nosotros</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-8">
            Bienestar<br />integral
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Bitem Global es un centro integral que reúne tres servicios esenciales: <strong className="text-foreground">GeQ Sport</strong> para tu forma física, 
            <strong className="text-foreground"> Clínica Bitem</strong> con venta de medicamentos para tu salud, y <strong className="text-foreground">Peluquería Bitem</strong> profesional para hombres y mujeres. 
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
