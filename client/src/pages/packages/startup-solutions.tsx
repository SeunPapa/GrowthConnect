import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, Brain, FileText, Search, Scale, Mail, Clock, Users, Target, DollarSign, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function StartupSolutions() {
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
            <Badge className="bg-primary/10 text-primary mb-4">Starting Out Right</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Startup Solutions Package
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Perfect for early-stage entrepreneurs with limited budgets who need essential guidance to get started right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-3xl font-bold text-primary">Starting at £500</div>
              <Button size="lg" onClick={handleConsultation} className="bg-primary text-white hover:bg-secondary">
                Get Your Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Package Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">What's Included</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Our Startup Solutions package provides you with the essential foundation every successful business needs. 
                We'll help you validate your idea, create a roadmap, and set up the legal framework to get started properly.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Comprehensive business idea validation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Professional business plan template</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Market research and analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Legal structure recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Ongoing email support for 30 days</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Perfect For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• First-time entrepreneurs</li>
                    <li>• Side project creators</li>
                    <li>• Budget-conscious startups</li>
                    <li>• Idea validation seekers</li>
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
                  <p className="text-neutral-600">2-3 weeks delivery with 30 days of email support included</p>
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
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Business Idea Validation</h3>
                <p className="text-neutral-600 mb-4">
                  We'll assess your business idea's market demand, competition analysis, and feasibility study to ensure you're building something people actually want.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Market demand assessment</li>
                  <li>• Competitor analysis</li>
                  <li>• SWOT analysis</li>
                  <li>• Risk evaluation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Basic Business Plan</h3>
                <p className="text-neutral-600 mb-4">
                  A clear, actionable business plan template tailored to your industry and business model, including financial projections and growth strategies.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Executive summary template</li>
                  <li>• Financial projections (1-year)</li>
                  <li>• Marketing strategy outline</li>
                  <li>• Operations plan</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Market Research Overview</h3>
                <p className="text-neutral-600 mb-4">
                  Comprehensive insights into your target customers, market size, trends, and positioning opportunities to help you make informed decisions.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Target audience profiling</li>
                  <li>• Market size analysis</li>
                  <li>• Industry trends report</li>
                  <li>• Pricing strategy recommendations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Legal Structure & Business Plan Setup</h3>
                <p className="text-neutral-600 mb-4">
                  Expert advice on business registration, legal structure selection, and compliance requirements combined with business plan development to ensure you start on the right foundation.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Business structure recommendations (LLC, Corporation, etc.)</li>
                  <li>• Registration process guidance and documentation</li>
                  <li>• Tax obligations and compliance overview</li>
                  <li>• Essential legal documents checklist</li>
                  <li>• Business plan template and guidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Email Support</h3>
                <p className="text-neutral-600 mb-4">
                  30 days of follow-up email support to answer quick questions and provide guidance as you implement your business plan.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• 30-day support period</li>
                  <li>• Quick question responses</li>
                  <li>• Implementation guidance</li>
                  <li>• Resource recommendations</li>
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
            Discover how our Startup Solutions package can help validate your business idea and create a roadmap for success. 
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
                View All Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-400">
            Ready to turn your business idea into reality? Contact us today to get started.
          </p>
        </div>
      </footer>
    </div>
  );
}