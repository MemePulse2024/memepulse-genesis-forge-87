
import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PulseChainStats from '@/components/PulseChainStats';
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
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden font-inter">
      <ParticleBackground />
      <Navigation />
      <Header />
      
      {/* PulseChain Excellence Section */}
      <section className="w-full py-12 md:py-20 relative z-10 bg-gradient-to-b from-slate-900/50 to-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-fade-in text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Built for PulseChain Excellence
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed px-4">
              Harness the power of the world's fastest blockchain with enterprise-grade tools 
              designed for maximum efficiency and minimal costs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">12 Second Block Times</h3>
                <p className="text-gray-400 text-xs md:text-sm">Ultra-fast confirmation for instant deployment</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">💰</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Minimal Fees</h3>
                <p className="text-gray-400 text-xs md:text-sm">Deploy for less than $1 in gas fees</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <div className="text-xl md:text-2xl mb-2">🔥</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Deflationary</h3>
                <p className="text-gray-400 text-xs md:text-sm">Built-in burn mechanics for token appreciation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live PulseChain Stats */}
      <PulseChainStats />
      
      {/* Main Content Sections with proper containment */}
      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <main className="space-y-12 md:space-y-16 relative z-10 pb-12 md:pb-20">
            <section id="generator" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="tokenomics" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="contract" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="social" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <SocialMediaLaunchpad coinIdea={coinIdea} />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="checklist" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <LaunchChecklist />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="resources" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <ResourcesSection />
            </section>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            
            <section id="analytics" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl">
              <TokenAnalyticsDashboard />
            </section>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
