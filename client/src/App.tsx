import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import StartupSolutions from "@/pages/packages/startup-solutions";
import GrowthAccelerator from "@/pages/packages/growth-accelerator";
import OngoingSupport from "@/pages/packages/ongoing-support";
import GetStarted from "@/pages/get-started";
import AdminDashboard from "@/pages/admin";
import CRMDashboard from "@/pages/crm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/packages/startup-solutions" component={StartupSolutions} />
      <Route path="/packages/growth-accelerator" component={GrowthAccelerator} />
      <Route path="/packages/ongoing-support" component={OngoingSupport} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/crm" component={CRMDashboard} />
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
