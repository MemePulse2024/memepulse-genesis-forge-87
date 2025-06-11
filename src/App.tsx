import { useState } from "react";
import ContractCodeGenerator from "./components/ContractCodeGenerator";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function App() {
  const [tokenomics, setTokenomics] = useState({
    totalSupply: "1000000000",
  buyTax: "5",
  sellTax: "5",
  taxAllocation: {
    burn: "0",
    liquidity: "50",
    marketing: "50"
  },
  supplyAllocation: {
    pulsex: "60",
    airdrop: "20",
    dev: "5",
    marketing: "10",
    burn: "5"
  }
});

  // You may need to initialize QueryClient if using react-query
  const queryClient = new QueryClient();

  return (
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
