
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
      <img
        src="/lovable-uploads/54f55a5b-da54-4019-9a4b-49ac99703e9c.png"
        alt="PulseNet Logo"
        className="pulsenet-watermark"
        style={{
          position: "fixed",
          left: "1rem",
          bottom: "1rem",
          zIndex: 99999,
          width: "120px",
          height: "120px",
          pointerEvents: "none",
          userSelect: "none",
          display: "block",
          mixBlendMode: "multiply",
          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.3))",
        }}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
