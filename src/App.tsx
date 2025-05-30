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
      <svg
        className="pulsenet-watermark"
        style={{
          position: "fixed",
          left: "0.5rem",
          bottom: "0.5rem",
          zIndex: 99999,
          width: 120,
          height: 120,
          pointerEvents: "none",
          userSelect: "none",
          display: "block",
        }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PulseNet Watermark"
      >
        <path
          d="M55.45 c-6.80 -1.40 -11.50 -3.5"
          fill="none"
          stroke="#FF9900"
          strokeWidth="2"
        />
      </svg>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
