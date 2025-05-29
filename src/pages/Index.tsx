import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import IdeaGenerator from '@/components/IdeaGenerator';
import TokenomicsEngine from '@/components/TokenomicsEngine';
import ContractCodeGenerator from '@/components/ContractCodeGenerator';
import SocialMediaLaunchpad from '@/components/SocialMediaLaunchpad';
import LaunchChecklist from '@/components/LaunchChecklist';
import TokenAnalyticsDashboard from '@/components/TokenAnalyticsDashboard';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';

interface CoinIdea {
  name: string;
  ticker: string;
  theme: string;
  logoIdea: string;
}

const Index = () => {
  // Shared state
  const [coinIdea, setCoinIdea] = useState<CoinIdea>({
    name: '',
    ticker: '',
    theme: '',
    logoIdea: ''
  });
  const [tokenomics, setTokenomics] = useState({
    totalSupply: '1000000000',
    buyTax: '5',
    sellTax: '5',
    taxAllocation: {
      liquidity: '40',
      marketing: '40',
      reflection: '10',
      burn: '10'
    },
    supplyAllocation: {
      pulsex: '80',
      airdrop: '10',
      dev: '5',
      marketing: '3',
      burn: '2'
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden relative font-orbitron">
      <ParticleBackground />
      <Navigation />
      <Header />
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-pulse-purple/60 via-black/80 to-yellow-400/10 flex flex-col items-center justify-center text-center relative z-10 border-b-4 border-yellow-400/30 shadow-[0_0_80px_10px_rgba(255,215,0,0.15)]">
        <div className="relative inline-block mb-6">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 via-pulse-orange to-pulse-purple text-black font-extrabold rounded-full text-lg shadow-lg animate-pulse border-4 border-yellow-400/60 uppercase tracking-widest z-20">
            LUXURY EDITION
          </span>
          <h1 className="font-orbitron text-6xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-pulse-orange to-pulse-purple bg-clip-text text-transparent drop-shadow-[0_0_40px_gold] animate-gradient-x">
            MemePulse Genesis Forge
          </h1>
        </div>
        <p className="text-2xl md:text-3xl text-yellow-100 max-w-3xl mx-auto mb-8 font-semibold drop-shadow-lg animate-fade-in">
          Instantly create, launch, and promote your meme coin on PulseChain with zero coding required. Designed for maximalists.
        </p>
        <div className="flex justify-center gap-4 mt-4 animate-fade-in">
          <span className="px-4 py-2 bg-gradient-to-r from-pulse-purple to-yellow-400 text-black font-bold rounded-full shadow-lg border-2 border-yellow-400/60 uppercase tracking-wider">PulseChain</span>
          <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-pulse-orange text-black font-bold rounded-full shadow-lg border-2 border-pulse-purple/60 uppercase tracking-wider">No Code</span>
        </div>
      </section>
      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-2 md:px-0 space-y-24 relative z-10">
        {/* Section Card Helper */}
        {/* Each section is a glassy, glowing card with gold/purple border and luxury shadow */}
        <section className="rounded-3xl bg-black/70 border-4 border-yellow-400/30 shadow-[0_0_60px_10px_rgba(147,51,234,0.25)] p-8 md:p-14 mt-[-80px] backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-yellow-400 via-pulse-purple to-pulse-orange rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-pulse-purple/30 shadow-[0_0_60px_10px_rgba(255,215,0,0.18)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-pulse-purple via-yellow-400 to-pulse-orange rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-yellow-400/30 shadow-[0_0_60px_10px_rgba(147,51,234,0.25)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-yellow-400 via-pulse-orange to-pulse-purple rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-pulse-orange/30 shadow-[0_0_60px_10px_rgba(255,215,0,0.18)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <SocialMediaLaunchpad coinIdea={coinIdea} />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-pulse-orange via-yellow-400 to-pulse-purple rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-yellow-400/30 shadow-[0_0_60px_10px_rgba(147,51,234,0.25)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <LaunchChecklist />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-yellow-400 via-pulse-purple to-pulse-orange rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-pulse-purple/30 shadow-[0_0_60px_10px_rgba(255,215,0,0.18)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <TokenAnalyticsDashboard />
        </section>
        <div className="w-full flex justify-center my-8">
          <div className="h-2 w-48 bg-gradient-to-r from-pulse-purple via-yellow-400 to-pulse-orange rounded-full opacity-80 shadow-lg animate-pulse" />
        </div>
        <section className="rounded-3xl bg-black/70 border-4 border-yellow-400/30 shadow-[0_0_60px_10px_rgba(147,51,234,0.25)] p-8 md:p-14 backdrop-blur-2xl hover:scale-[1.015] transition-transform duration-300">
          <ResourcesSection />
        </section>
      </main>
      <Footer />
      {/* Luxury floating badge */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
        <span className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pulse-orange to-pulse-purple text-black font-extrabold rounded-full text-lg shadow-2xl border-4 border-yellow-400/80 uppercase tracking-widest animate-pulse">
          RH MAXIMALIST
        </span>
      </div>
      {/* Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .animate-gradient-x {
              background-size: 200% 200%;
              animation: gradient-x 4s ease-in-out infinite;
            }
            @keyframes gradient-x {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-fade-in {
              animation: fadeIn 1.2s ease-in;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: none; }
            }
          `
        }}
      />
    </div>
  );
};

export default Index;
