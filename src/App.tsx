
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
      {/* PulseNet Watermark - bottom of page */}
      <a
        href="https://pulsenet.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="pulsenet-watermark-container"
        style={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
          pointerEvents: "auto",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(0, 0, 0, 0.8)",
          padding: "0.75rem 1.5rem",
          borderRadius: "2rem",
          border: "2px solid rgba(255, 215, 0, 0.3)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <span 
          style={{
            color: "#FFD700",
            fontSize: "1.1rem",
            fontWeight: "600",
            fontFamily: "Orbitron, sans-serif",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
          }}
        >
          Made by
        </span>
        <img
          src="/lovable-uploads/54f55a5b-da54-4019-9a4b-49ac99703e9c.png"
          alt="PulseNet Logo"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            filter: "brightness(1.3) contrast(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.4))",
          }}
        />
      </a>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
