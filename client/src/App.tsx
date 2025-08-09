import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import StartupSolutions from "@/pages/services/startup-solutions";
import GrowthAccelerator from "@/pages/services/growth-accelerator";
import OngoingSupport from "@/pages/services/ongoing-support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services/startup-solutions" component={StartupSolutions} />
      <Route path="/services/growth-accelerator" component={GrowthAccelerator} />
      <Route path="/services/ongoing-support" component={OngoingSupport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
