import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ContactSection() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => setLocation("/get-started");

  return (
    <section id="contact" className="py-20 bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Contact us for a free initial consultation and let's build a solid foundation for your business!
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-primary text-white hover:bg-secondary text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
