import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, RotateCcw, Brain, FileText, Search, Scale, Mail, BarChart3, Palette, Settings, PoundSterling, Handshake } from "lucide-react";
import { useLocation } from "wouter";

interface ServicePackagesProps {
  onSelectPackage?: (packageType: string) => void;
}

export default function ServicePackages({ onSelectPackage }: ServicePackagesProps) {
  const [, setLocation] = useLocation();

  const handleSelectPackage = (packageType: string) => {
    if (onSelectPackage) {
      onSelectPackage(packageType);
    }
    
    // Navigate to the appropriate package detail page
    switch (packageType) {
      case "startup":
        setLocation("/packages/startup-solutions");
        break;
      case "growth":
        setLocation("/packages/growth-accelerator");
        break;
      case "ongoing":
        setLocation("/packages/ongoing-support");
        break;
      default:
        // Fallback to scroll to contact form if no matching route
        const contactSection = document.getElementById("contact");
        contactSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="packages" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Choose Your Growth Package
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Tailored solutions for every stage of your business journey, from initial idea to scaling success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Startup Solutions Package */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-neutral-100 h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Startup Solutions</h3>
                <p className="text-neutral-500 mb-4">Starting Out Right</p>
                <div className="text-3xl font-bold text-primary">From £750</div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Perfect for:</p>
                <p className="text-neutral-500 text-sm">Early-stage entrepreneurs with limited budgets</p>
              </div>

              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-start">
                  <Brain className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Business Idea Validation</span>
                    <p className="text-sm text-neutral-500">Assess market demand</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Basic Business Plan</span>
                    <p className="text-sm text-neutral-500">Clear, actionable roadmap</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Search className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Market Research Overview</span>
                    <p className="text-sm text-neutral-500">Insights into your customers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Scale className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Legal Structure & Business Plan Setup</span>
                    <p className="text-sm text-neutral-500">Business registration, legal structure, and compliance guidance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Email Support</span>
                    <p className="text-sm text-neutral-500">Follow-up answers to quick questions</p>
                  </div>
                </li>
              </ul>

              <Button 
                onClick={() => handleSelectPackage("startup")}
                className="w-full bg-primary text-white hover:bg-secondary transition-colors mt-auto"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Launch & Growth Accelerator Package */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
            </div>
            
            <CardContent className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Launch & Growth Accelerator</h3>
                <p className="text-neutral-500 mb-4">Complete scaling solution</p>
                <div className="text-3xl font-bold text-primary">From £2000</div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Perfect for:</p>
                <p className="text-neutral-500 text-sm">Entrepreneurs ready to launch or scale</p>
              </div>

              <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium text-accent">Everything in Startup Solutions, PLUS:</p>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <BarChart3 className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">In-Depth Business Plan</span>
                    <p className="text-sm text-neutral-500">Financial projections & strategies</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Palette className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Branding & Marketing Guidance</span>
                    <p className="text-sm text-neutral-500">Identity, marketing, and social setup</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Settings className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Operational Planning</span>
                    <p className="text-sm text-neutral-500">Workflow efficiency</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <PoundSterling className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Funding Guidance</span>
                    <p className="text-sm text-neutral-500">Loans, grants, and investor pitches</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Handshake className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">1-on-1 Sessions</span>
                    <p className="text-sm text-neutral-500">Tailored business support</p>
                  </div>
                </li>
              </ul>

              <Button 
                onClick={() => handleSelectPackage("growth")}
                className="w-full bg-primary text-white hover:bg-secondary transition-colors mt-auto"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Ongoing Support Package */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-neutral-100 h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Ongoing Support</h3>
                <p className="text-neutral-500 mb-4">Continuous guidance</p>
                <div className="text-2xl font-bold text-primary">Custom Pricing</div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Perfect for:</p>
                <p className="text-neutral-500 text-sm">Businesses needing continuous guidance</p>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <RotateCcw className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Monthly Retainer</span>
                    <p className="text-sm text-neutral-500">£1,500/month ongoing support</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Settings className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">À La Carte Services</span>
                    <p className="text-sm text-neutral-500">One-time help with specific needs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Brain className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Workshops</span>
                    <p className="text-sm text-neutral-500">Group sessions (£100–£300/person)</p>
                  </div>
                </li>
              </ul>

              <Button 
                onClick={() => handleSelectPackage("ongoing")}
                className="w-full bg-primary text-white hover:bg-secondary transition-colors mt-auto"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
