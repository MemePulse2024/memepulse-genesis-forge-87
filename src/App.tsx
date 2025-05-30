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
      <object
        data="/PulseNet-watermark.svg"
        type="image/svg+xml"
        className="pulsenet-watermark"
        tabIndex={-1}
        aria-label="PulseNet Watermark"
        style={{
          pointerEvents: "none",
          position: "fixed",
          left: "0.5rem",
          bottom: "0.5rem",
          zIndex: 99999,
          width: 120,
          height: 120,
          display: "block",
        }}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
