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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden relative">
      <ParticleBackground />
      <Navigation />
      <Header />
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-pulse-purple/40 to-pulse-orange/30 flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent drop-shadow-lg">
          MemePulse Genesis Forge
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-6">
          Instantly create, launch, and promote your meme coin on PulseChain with zero coding required.
        </p>
      </section>
      {/* Main Content Sections */}
      <main className="max-w-5xl mx-auto px-2 md:px-0 space-y-16 relative z-10">
        <section className="rounded-2xl bg-black/60 border border-purple-500/20 shadow-xl p-6 md:p-10 mt-[-60px] backdrop-blur-xl">
          <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-purple to-pulse-orange rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-orange-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-orange to-pulse-purple rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-purple-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-purple to-pulse-orange rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-orange-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <SocialMediaLaunchpad coinIdea={coinIdea} />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-orange to-pulse-purple rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-purple-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <LaunchChecklist />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-purple to-pulse-orange rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-orange-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <TokenAnalyticsDashboard />
        </section>
        <div className="w-full flex justify-center my-4">
          <div className="h-1 w-32 bg-gradient-to-r from-pulse-orange to-pulse-purple rounded-full opacity-60" />
        </div>
        <section className="rounded-2xl bg-black/60 border border-purple-500/20 shadow-xl p-6 md:p-10 backdrop-blur-xl">
          <ResourcesSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
