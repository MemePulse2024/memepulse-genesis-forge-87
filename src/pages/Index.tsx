
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
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden relative font-inter">
      <ParticleBackground />
      <Navigation />
      <Header />
      
      {/* Professional Hero Section */}
      <section className="w-full py-20 md:py-32 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <div className="professional-animate-in">
            <h1 className="professional-title mb-6">
              MemePulse Genesis Forge
            </h1>
            <p className="professional-subtitle max-w-3xl mx-auto mb-8">
              Create, launch, and promote your meme coin on PulseChain with zero coding required. 
              Professional-grade tools designed for the next generation of crypto innovators.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-indigo-600/20 border border-indigo-400/30 text-indigo-300 font-medium rounded-full text-sm backdrop-blur-sm">
                PulseChain Native
              </span>
              <span className="px-4 py-2 bg-amber-600/20 border border-amber-400/30 text-amber-300 font-medium rounded-full text-sm backdrop-blur-sm">
                No Code Required
              </span>
              <span className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 font-medium rounded-full text-sm backdrop-blur-sm">
                Professional Grade
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-4 space-y-12 relative z-10 pb-20">
        <section className="professional-card p-8 professional-animate-in">
          <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <SocialMediaLaunchpad coinIdea={coinIdea} />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <LaunchChecklist />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <ResourcesSection />
        </section>
        
        <div className="professional-divider"></div>
        
        <section className="professional-card p-8 professional-animate-in">
          <TokenAnalyticsDashboard />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
