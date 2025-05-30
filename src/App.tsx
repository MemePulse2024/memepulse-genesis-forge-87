import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* PulseNet Watermark - always floating bottom left */}
      <div style={{ position: 'fixed', left: '0.5rem', bottom: '0.5rem', zIndex: 99999, width: 120, height: 120, pointerEvents: 'none', userSelect: 'none' }}>
        <img
          src="/PulseNet.svg"
          alt="PulseNet Watermark"
          className="pulsenet-watermark"
          draggable="false"
          style={{ display: 'block', width: '100%', height: '100%', verticalAlign: 'bottom' }}
        />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
