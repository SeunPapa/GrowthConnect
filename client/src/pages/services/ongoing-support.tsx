import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, RotateCcw, Settings, Brain, Clock, Users, Target, DollarSign, Calendar, Repeat, BookOpen, UserCheck } from "lucide-react";
import { Link } from "wouter";

export default function OngoingSupport() {
  const handleConsultation = () => {
    // Scroll to free consultation section
    const consultationSection = document.getElementById("free-consultation");
    consultationSection?.scrollIntoView({ behavior: "smooth" });
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
            <Badge className="bg-accent/10 text-accent mb-4">Continuous Growth</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Ongoing Support Solutions
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Continuous guidance and support for businesses that need ongoing strategic direction, operational optimization, and expert advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-3xl font-bold text-primary">Custom Pricing</div>
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
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Flexible Support Options</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Our ongoing support solutions are designed for businesses that need continuous guidance as they grow. 
                Whether you need monthly strategic support, specific project assistance, or team training, we offer flexible 
                options tailored to your evolving needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Monthly retainer packages (£500-£2,000/month)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">À la carte services for specific needs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Group workshops and training sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Emergency consultation availability</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-neutral-700">Flexible month-to-month arrangements</span>
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
                    <li>• Growing businesses needing ongoing guidance</li>
                    <li>• Companies facing operational challenges</li>
                    <li>• Teams requiring strategic direction</li>
                    <li>• Businesses preparing for major transitions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Flexibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Month-to-month arrangements with no long-term commitments. Scale up or down based on your needs.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Priority support with 24-48 hour response times for urgent business matters</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">Choose Your Support Model</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Monthly Retainer */}
            <Card className="bg-white border-2 border-primary">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Repeat className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Monthly Retainer</CardTitle>
                <div className="text-2xl font-bold text-primary">£500-£2,000/month</div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-6">
                  Ongoing strategic support with regular check-ins, priority access, and continuous guidance for your business challenges.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <RotateCcw className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Regular Strategy Sessions</span>
                      <p className="text-sm text-neutral-500">Weekly or bi-weekly consultations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Priority Support</span>
                      <p className="text-sm text-neutral-500">24-48 hour response time</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Strategic Planning</span>
                      <p className="text-sm text-neutral-500">Quarterly business reviews</p>
                    </div>
                  </li>
                </ul>
                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <p><strong>Essential (£500/month):</strong> 2 hours monthly consultation</p>
                  <p><strong>Growth (£1,000/month):</strong> 4 hours monthly + email support</p>
                  <p><strong>Premium (£2,000/month):</strong> 8 hours monthly + priority access</p>
                </div>
              </CardContent>
            </Card>

            {/* À La Carte Services */}
            <Card className="bg-white">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>À La Carte Services</CardTitle>
                <div className="text-2xl font-bold text-primary">Pay Per Project</div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-6">
                  One-time assistance with specific business challenges, projects, or strategic initiatives when you need targeted expertise.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Strategic Consultation</span>
                      <p className="text-sm text-neutral-500">£150/hour or project-based</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Process Optimization</span>
                      <p className="text-sm text-neutral-500">£500-£2,000 per project</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <RotateCcw className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Crisis Management</span>
                      <p className="text-sm text-neutral-500">Emergency support available</p>
                    </div>
                  </li>
                </ul>
                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <p><strong>Single Session:</strong> £150 (90 minutes)</p>
                  <p><strong>Mini Project:</strong> £500-£1,000</p>
                  <p><strong>Major Project:</strong> £1,000-£5,000</p>
                </div>
              </CardContent>
            </Card>

            {/* Workshops & Training */}
            <Card className="bg-white">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Workshops & Training</CardTitle>
                <div className="text-2xl font-bold text-primary">£100-£300/person</div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-6">
                  Group training sessions and workshops designed to upskill your team and improve organizational capabilities.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Users className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Team Training</span>
                      <p className="text-sm text-neutral-500">Leadership and operational skills</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Strategy Workshops</span>
                      <p className="text-sm text-neutral-500">Planning and goal-setting sessions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Process Training</span>
                      <p className="text-sm text-neutral-500">Workflow and efficiency workshops</p>
                    </div>
                  </li>
                </ul>
                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <p><strong>Half-day:</strong> £100/person (4 hours)</p>
                  <p><strong>Full-day:</strong> £200/person (8 hours)</p>
                  <p><strong>Multi-day:</strong> £300/person (2-3 days)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">What's Included in Ongoing Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Strategic Consultation</h3>
                <p className="text-neutral-600 mb-4">
                  Regular strategic sessions to review business performance, identify opportunities, and address challenges as they arise.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Business performance reviews</li>
                  <li>• Strategic planning sessions</li>
                  <li>• Problem-solving workshops</li>
                  <li>• Growth opportunity identification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Operational Optimization</h3>
                <p className="text-neutral-600 mb-4">
                  Continuous improvement of your business processes, workflows, and operational efficiency to maximize productivity.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Process analysis and improvement</li>
                  <li>• Workflow optimization</li>
                  <li>• Technology recommendations</li>
                  <li>• Efficiency assessments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Team Development</h3>
                <p className="text-neutral-600 mb-4">
                  Support for team building, leadership development, and organizational growth to build a strong foundation for success.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Leadership coaching</li>
                  <li>• Team building strategies</li>
                  <li>• Communication improvement</li>
                  <li>• Performance optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Financial Guidance</h3>
                <p className="text-neutral-600 mb-4">
                  Ongoing financial strategy support, budgeting assistance, and financial performance monitoring for sustainable growth.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Financial planning support</li>
                  <li>• Budget optimization</li>
                  <li>• Cash flow management</li>
                  <li>• Investment strategy guidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Crisis Management</h3>
                <p className="text-neutral-600 mb-4">
                  Emergency support for unexpected challenges, crisis situations, and urgent business decisions that require immediate attention.
                </p>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Emergency consultation</li>
                  <li>• Crisis response planning</li>
                  <li>• Rapid problem-solving</li>
                  <li>• Damage control strategies</li>
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
            Discover how our services can help accelerate your business growth and create a clear path to success. 
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
                Explore Other Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-400">
            Need ongoing support for your growing business? Contact us today to find the perfect support model.
          </p>
        </div>
      </footer>
    </div>
  );
}