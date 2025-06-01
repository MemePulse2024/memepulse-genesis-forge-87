
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
      
      {/* Enhanced Professional Hero Section */}
      <section className="w-full py-20 md:py-32 relative z-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900/50 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              The Richard Heart Standard
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Professional-grade meme coin creation with the same attention to detail and excellence 
              that built HEX and PulseChain. No corners cut. No compromises.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-400 text-sm">Deploy your meme coin in minutes, not weeks</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-400/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-bold text-white mb-2">World Class</h3>
                <p className="text-gray-400 text-sm">Professional tools used by the best in crypto</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-2xl mb-2">💎</div>
                <h3 className="font-bold text-white mb-2">Diamond Hands</h3>
                <p className="text-gray-400 text-sm">Built for long-term success and sustainability</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Sections with enhanced styling */}
      <main className="max-w-6xl mx-auto px-4 space-y-16 relative z-10 pb-20">
        <section id="generator" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="tokenomics" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="contract" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="social" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <SocialMediaLaunchpad coinIdea={coinIdea} />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="checklist" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <LaunchChecklist />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="resources" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <ResourcesSection />
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <section id="analytics" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <TokenAnalyticsDashboard />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
