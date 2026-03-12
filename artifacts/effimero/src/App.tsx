import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import WorkInProgress from "@/pages/WorkInProgress";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

interface SiteSettings {
  wipEnabled: boolean;
  wipCountdown?: string | null;
  wipMessage?: string | null;
}

async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

function AppRoutes() {
  const [location] = useLocation();
  const isAdmin = location === "/admin" || location.startsWith("/admin");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-1 h-8 bg-primary animate-pulse" />
      </div>
    );
  }

  if (settings?.wipEnabled && !isAdmin) {
    return (
      <WorkInProgress
        countdown={settings.wipCountdown}
        message={settings.wipMessage}
      />
    );
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/about" component={About} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
