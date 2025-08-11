import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicePackages from "@/components/service-packages";
import ContactSection from "@/components/contact-section";
import { CheckCircle, Rocket, Lightbulb, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToGetStarted = () => {
    setLocation("/get-started");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection onViewPackages={() => scrollToSection("packages")} />
      
      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            You Don't Have to Build Your Business Alone
          </h2>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Starting a business can feel overwhelming—but you don't have to do it alone. 
            Our tailored support packages provide clarity, strategy, and actionable steps for business success. 
            Whether you're just starting out or ready to scale, we have the right solution for your journey.
          </p>
        </div>
      </section>

      <ServicePackages />

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              We're not just consultants—we're your business growth partners, committed to your success every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Practical Advice</h3>
              <p className="text-neutral-500">Easy-to-understand guidance tailored for everyday business owners, not corporate jargon.</p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Personalized Support</h3>
              <p className="text-neutral-500">Customized solutions tailored to your unique business journey and specific challenges.</p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Proven Strategies</h3>
              <p className="text-neutral-500">Battle-tested methods for starting, launching, and growing businesses with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-neutral-500">
              Real results from real entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The startup package helped me validate my business idea and create a solid foundation. I couldn't have done it without their guidance.",
                name: "Sarah Johnson",
                title: "Tech Startup Founder",
                initials: "SJ"
              },
              {
                quote: "The Growth Accelerator package transformed my small business. Revenue increased 200% in just 6 months!",
                name: "Michael Chen", 
                title: "E-commerce Business Owner",
                initials: "MC"
              },
              {
                quote: "Professional, knowledgeable, and genuinely caring. They made the complex world of business manageable.",
                name: "Amanda Rodriguez",
                title: "Restaurant Owner", 
                initials: "AR"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-xl font-bold text-white">
                <span className="text-primary mr-2">📈</span>
                Growth Accelerators
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
            <p className="text-neutral-400 text-sm">
              © 2024 Growth Accelerators. All rights reserved. 
              Helping entrepreneurs build successful businesses since 2020.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
