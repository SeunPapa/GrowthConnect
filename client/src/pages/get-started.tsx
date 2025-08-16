import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  businessStage: string;
  businessType: string;
  mainGoal: string;
  timeframe: string;
  budget: string;
  name: string;
  email: string;
  businessName: string;
  additionalInfo: string;
}

export default function GetStarted() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessStage: "",
    businessType: "",
    mainGoal: "",
    timeframe: "",
    budget: "",
    name: "",
    email: "",
    businessName: "",
    additionalInfo: ""
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest("POST", "/api/contact", {
        name: data.name,
        email: data.email,
        message: `Business Stage: ${data.businessStage}
Business Type: ${data.businessType}  
Main Goal: ${data.mainGoal}
Timeline: ${data.timeframe}
Budget: ${data.budget}
Business Name: ${data.businessName || 'Not provided'}
Additional Info: ${data.additionalInfo || 'None provided'}`,
        package: getPackageFromGoal(data.mainGoal)
      }),
    onSuccess: () => {
      toast({ 
        title: "Consultation booked successfully!", 
        description: "We'll contact you within 24 hours to schedule your free consultation."
      });
      setLocation("/#contact");
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({ 
        title: "Submission failed", 
        description: `Error: ${error.message || 'Please try again or contact us directly.'}`,
        variant: "destructive" 
      });
    },
  });

  const getPackageFromGoal = (goal: string) => {
    switch (goal) {
      case "plan":
      case "launch": 
      case "structure":
        return "startup";
      case "scale":
      case "optimize":
        return "growth";
      case "marketing":
      case "funding":
        return "ongoing";
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    submitMutation.mutate(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessStage && formData.businessType;
      case 2:
        return formData.mainGoal && formData.timeframe && formData.budget;
      case 3:
        return formData.name && formData.email;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
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
            <div className="text-sm text-neutral-500">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Progress</span>
            <span className="text-sm font-medium text-neutral-700">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-neutral-900">
              {currentStep === 1 && "Tell Us About Your Business"}
              {currentStep === 2 && "What Are Your Goals?"}
              {currentStep === 3 && "Your Contact Information"}
            </CardTitle>
            <p className="text-center text-neutral-600">
              {currentStep === 1 && "Help us understand where you are in your business journey"}
              {currentStep === 2 && "Let us know what you're trying to achieve"}
              {currentStep === 3 && "We'll use this to prepare for your free consultation"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessStage">What stage is your business in?</Label>
                  <Select value={formData.businessStage} onValueChange={(value) => updateFormData("businessStage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">I have a business idea but haven't started yet</SelectItem>
                      <SelectItem value="planning">I'm in the planning phase</SelectItem>
                      <SelectItem value="startup">I've started but need help with structure</SelectItem>
                      <SelectItem value="early">Early-stage business (0-2 years)</SelectItem>
                      <SelectItem value="established">Established business looking to grow</SelectItem>
                      <SelectItem value="scaling">Scaling and need operational support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">What type of business are you in or planning?</Label>
                  <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service-based business</SelectItem>
                      <SelectItem value="product">Product-based business</SelectItem>
                      <SelectItem value="ecommerce">E-commerce/Online retail</SelectItem>
                      <SelectItem value="saas">Software/Technology/SaaS</SelectItem>
                      <SelectItem value="consulting">Consulting/Professional services</SelectItem>
                      <SelectItem value="restaurant">Food & Beverage/Restaurant</SelectItem>
                      <SelectItem value="retail">Physical retail store</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Goals and Requirements */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mainGoal">What's your main goal right now?</Label>
                  <Select value={formData.mainGoal} onValueChange={(value) => updateFormData("mainGoal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="validate">Validate my business idea</SelectItem>
                      <SelectItem value="plan">Create a solid business plan</SelectItem>
                      <SelectItem value="launch">Launch my business properly</SelectItem>
                      <SelectItem value="structure">Get legal structure and compliance right</SelectItem>
                      <SelectItem value="marketing">Develop marketing and branding strategy</SelectItem>
                      <SelectItem value="funding">Secure funding or investment</SelectItem>
                      <SelectItem value="scale">Scale my existing business</SelectItem>
                      <SelectItem value="optimize">Optimize operations and processes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">What's your timeline for achieving this goal?</Label>
                  <Select value={formData.timeframe} onValueChange={(value) => updateFormData("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible (within 1 month)</SelectItem>
                      <SelectItem value="quarter">Within the next quarter (1-3 months)</SelectItem>
                      <SelectItem value="sixmonths">Within 6 months</SelectItem>
                      <SelectItem value="year">Within the next year</SelectItem>
                      <SelectItem value="flexible">I'm flexible with timing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">What's your budget range for consulting services?</Label>
                  <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under500">Under £500</SelectItem>
                      <SelectItem value="500-1500">£500 - £1,500</SelectItem>
                      <SelectItem value="1500-3000">£1,500 - £3,000</SelectItem>
                      <SelectItem value="3000-5000">£3,000 - £5,000</SelectItem>
                      <SelectItem value="over5000">Over £5,000</SelectItem>
                      <SelectItem value="ongoing">Interested in ongoing support</SelectItem>
                      <SelectItem value="discuss">Prefer to discuss during consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name (if applicable)</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateFormData("businessName", e.target.value)}
                      placeholder="Your business name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    placeholder="Tell us anything else that would help us prepare for your consultation..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-neutral-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-primary text-white hover:bg-secondary"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || submitMutation.isPending}
                  className="bg-primary text-white hover:bg-secondary flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {submitMutation.isPending ? "Submitting..." : "Book My Free Consultation"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              Free consultation
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              No obligation
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              Personalized recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}