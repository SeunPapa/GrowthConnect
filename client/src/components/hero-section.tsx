import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onViewPackages: () => void;
  onFreeConsultation: () => void;
}

export default function HeroSection({ onViewPackages, onFreeConsultation }: HeroSectionProps) {
  return (
    <section id="home" className="bg-gradient-to-br from-primary/5 to-secondary/10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Startup & Growth Solutions<br />
            <span className="text-primary">for Entrepreneurs</span>
          </h1>
          <p className="text-xl text-neutral-500 mb-8 max-w-3xl mx-auto">
            Helping Small Businesses Start, Launch, and Grow with Confidence. 
            Our tailored support packages provide clarity, strategy, and actionable steps for business success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onViewPackages}
              className="bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-secondary transition-colors shadow-lg"
              size="lg"
            >
              View Our Packages
            </Button>
            <Button 
              onClick={onFreeConsultation}
              variant="outline"
              className="border-2 border-primary text-primary px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              size="lg"
            >
              Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
