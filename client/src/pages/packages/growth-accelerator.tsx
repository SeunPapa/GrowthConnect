import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, TrendingUp, BarChart3, Palette, Settings, PoundSterling, Handshake, Clock, Users, Target, DollarSign, Calendar, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function GrowthAccelerator() {
  const [, setLocation] = useLocation();

  const handleConsultation = () => {
    setLocation("/get-started");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={handleConsultation} className="bg-primary text-white hover:bg-secondary">
              Free Consultation
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary text-white mb-4">Most Popular</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Launch & Growth Accelerator
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Complete scaling solution for entrepreneurs ready to launch or scale their business with comprehensive support and strategic guidance.
            </p>
            <div className="flex justify-center">
              <div className="text-3xl font-bold text-primary">From £2000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Complete Business Acceleration</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Our most comprehensive package includes everything from the Startup Solutions package, plus advanced strategic planning, 
                branding guidance, operational optimization, and dedicated 1-on-1 support to accelerate your business growth.
              </p>
              
              <div className="p-4 bg-accent/10 rounded-lg mb-6">
                <p className="text-sm font-medium text-accent">✓ Everything in Startup Solutions, PLUS:</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">In-depth business plan with financial projections</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Complete branding and marketing strategy</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Operational planning and workflow optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Funding guidance and investor pitch preparation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Personal 1-on-1 strategy sessions</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Perfect For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Entrepreneurs ready to launch</li>
                    <li>• Existing businesses scaling up</li>
                    <li>• Startups seeking investment</li>
                    <li>• Teams needing strategic direction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">4-8 weeks delivery with 60 days of ongoing support and consultation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Key Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Comprehensive solution that covers all aspects of business growth from strategy to execution</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">Services Included in This Package</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">In-Depth Business Plan</h3>
                <p className="text-neutral-600 mb-4">
                  Comprehensive business plan with detailed financial projections, market analysis, and strategic roadmaps for sustainable growth.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• 3-year financial projections</li>
                  <li>• Cash flow modeling</li>
                  <li>• Growth strategy planning</li>
                  <li>• Risk mitigation strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Branding & Marketing Strategy</h3>
                <p className="text-neutral-600 mb-4">
                  Complete brand identity development and marketing strategy including digital presence setup and customer acquisition plans.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Brand identity guidelines</li>
                  <li>• Marketing channel strategy</li>
                  <li>• Social media setup</li>
                  <li>• Customer acquisition plan</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Operational Planning</h3>
                <p className="text-neutral-600 mb-4">
                  Streamlined operational workflows, process optimization, and system recommendations to maximize efficiency and productivity.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Process documentation</li>
                  <li>• Workflow optimization</li>
                  <li>• Technology recommendations</li>
                  <li>• Team structure planning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <PoundSterling className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Funding Guidance</h3>
                <p className="text-neutral-600 mb-4">
                  Expert guidance on funding options, grant applications, investor pitch preparation, and financial strategy development.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Funding options analysis</li>
                  <li>• Grant application support</li>
                  <li>• Investor pitch deck creation</li>
                  <li>• Financial strategy planning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">1-on-1 Strategy Sessions</h3>
                <p className="text-neutral-600 mb-4">
                  Personalized strategy sessions with experienced consultants to address specific challenges and opportunities for your business.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• 4 x 90-minute sessions</li>
                  <li>• Tailored business advice</li>
                  <li>• Problem-solving workshops</li>
                  <li>• Action plan development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-accent">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Free Initial Consultation</h3>
                <p className="text-neutral-600 mb-4">
                  Start with a complimentary consultation to discuss your business needs and determine how our services can best support your goals.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Comprehensive business assessment</li>
                  <li>• Personalized service recommendations</li>
                  <li>• Clear next steps and roadmap</li>
                  <li>• No obligation or commitment required</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Consultation CTA */}
      <section id="free-consultation" className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start with a Free Initial Consultation
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Discover how our Launch & Growth Accelerator package can transform your business strategy and accelerate your path to success. 
            No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100">
                Book Free Consultation
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Compare All Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-400">
            Ready to accelerate your business growth? Contact us today to schedule your free consultation.
          </p>
        </div>
      </footer>
    </div>
  );
}