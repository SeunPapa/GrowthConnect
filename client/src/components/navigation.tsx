import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/generated_images/Growth_Accelerators_business_logo_fd30a20d.png";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    setLocation("/get-started");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="Growth Accelerators" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-neutral-900 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("packages")}
                className="text-neutral-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Packages
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="text-neutral-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-500 hover:text-neutral-900 focus:outline-none focus:text-neutral-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-100">
              <button 
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-neutral-900 hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("packages")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-neutral-500 hover:text-primary transition-colors"
              >
                Packages
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-neutral-500 hover:text-primary transition-colors"
              >
                About
              </button>
              <button 
                onClick={handleGetStarted}
                className="block w-full text-left px-3 py-2 text-base font-medium bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
