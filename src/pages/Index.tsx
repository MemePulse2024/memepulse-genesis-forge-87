import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import IdeaGenerator from '@/components/IdeaGenerator';
import ContractCodeGenerator from '@/components/ContractCodeGenerator';
import SocialMediaLaunchpad from '@/components/SocialMediaLaunchpad';
import LaunchChecklist from '@/components/LaunchChecklist';
import TokenomicsEngine from '@/components/TokenomicsEngine';
import BlockTimeDisplay from '@/components/BlockTimeDisplay';

import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import TokenAnalyticsDashboard from '@/components/TokenAnalyticsDashboard';
import { Lightbulb, DollarSign, Sparkles, Rocket, ListChecks, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CoinIdea {
  name: string;
  ticker: string;
  theme: string;
  logoIdea: string;
}

const SectionHeader = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center mb-6 animate-fade-in">
    <div className="mb-2">{icon}</div>
    <h2 className="font-orbitron text-2xl md:text-4xl font-bold bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent mb-1">{title}</h2>
    <p className="text-gray-400 text-base md:text-lg text-center max-w-2xl">{desc}</p>
  </div>
);

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

  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden font-inter">
      <ParticleBackground />
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg animate-fade-in-down">
        <Navigation />
      </div>
      <Header />
      {/* PulseChain Excellence Section */}
      <section className="w-full py-12 md:py-20 relative z-10 bg-gradient-to-b from-slate-900/50 to-slate-900 animate-fade-in">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Built for PulseChain Excellence</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed px-4">Harness the power of the world's fastest blockchain with enterprise-grade tools designed for maximum efficiency and minimal costs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm flex flex-col items-center animate-fade-in-up">
                <div className="text-xl md:text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base flex items-center gap-2"><BlockTimeDisplay /></h3>
                <p className="text-gray-400 text-xs md:text-sm">Ultra-fast confirmation for instant deployment</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm animate-fade-in-up">
                <div className="text-xl md:text-2xl mb-2">💰</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Minimal Fees</h3>
                <p className="text-gray-400 text-xs md:text-sm">Deploy for less than $1 in gas fees</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm animate-fade-in-up">
                <div className="text-xl md:text-2xl mb-2">🔥</div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Deflationary</h3>
                <p className="text-gray-400 text-xs md:text-sm">Built-in burn mechanics for token appreciation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
          <main className="space-y-16 md:space-y-24 relative z-10 pb-12 md:pb-20">
            <section id="generator" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Lightbulb className="w-8 h-8 text-pulse-orange" />} title="Meme Coin Idea Generator" desc="Enter a theme or keyword and let AI generate your next viral PulseChain meme coin idea!" />
              <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
            </section>
            <section id="tokenomics" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<DollarSign className="w-8 h-8 text-green-400" />} title="Tokenomics Engine" desc="Configure your meme coin's tokenomics with built-in validation and visual charts." />
              <TokenomicsEngine tokenomics={tokenomics} setTokenomics={setTokenomics} />
            </section>
            <section id="contract" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Rocket className="w-8 h-8 text-blue-400" />} title="Smart Contract Generator" desc="Build your meme coin contract with fun, safety, and style!" />
              <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
            </section>
            <section id="social" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Users className="w-8 h-8 text-pulse-purple" />} title="Social Media Launchpad" desc="Generate viral posts and memes for your launch across all major platforms." />
              <SocialMediaLaunchpad coinIdea={coinIdea} />
            </section>
            <section id="checklist" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<ListChecks className="w-8 h-8 text-amber-400" />} title="Launch Checklist" desc="Follow this checklist to ensure a smooth and successful meme coin launch." />
              <LaunchChecklist />
            </section>
            <section id="resources" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Sparkles className="w-8 h-8 text-pink-400" />} title="Resources & Guides" desc="Explore guides, tools, and resources to help you succeed on PulseChain." />
              <ResourcesSection />
            </section>
            <section id="analytics" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<BarChart3 className="w-8 h-8 text-green-300" />} title="Token Analytics Dashboard" desc="Track your token's performance and on-chain stats in real time." />
              <TokenAnalyticsDashboard />
            </section>
            {/* Meme of the Day Section */}
            <section id="meme-of-the-day" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Sparkles className="w-8 h-8 text-pink-400" />} title="Meme of the Day" desc="Get inspired by the hottest meme on PulseChain right now!" />
              <div className="bg-black/60 border border-pulse-orange/30 rounded-xl p-4 md:p-6 backdrop-blur-sm flex flex-col items-center">
                {/* Placeholder for Meme of the Day Content */}
                <p className="text-gray-300 text-center mb-4">🎉 Coming Soon: Our handpicked Meme of the Day feature! 🎉</p>
                <Button variant="primary" className="animate-pulse" disabled>
                  <span className="font-semibold">Stay Tuned!</span>
                </Button>
              </div>
            </section>
            {/* Randomize Button Section */}
            <section id="randomize" className="section-glass animate-fade-in-up">
              <div className="flex flex-col items-center">
                <p className="text-gray-300 text-center mb-4">Feeling lucky? Click the button below to generate a random meme coin idea!</p>
                <Button variant="secondary" className="flex items-center gap-2" onClick={() => {
                  // TODO: Implement random meme coin idea generation
                  toast({ title: 'Random Idea Generated!', description: 'Check the Meme Coin Idea Generator section.', duration: 2000 });
                }}>
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-semibold">Randomize Idea</span>
                </Button>
              </div>
            </section>
            {/* Meme Tips Section */}
            <section id="meme-tips" className="section-glass animate-fade-in-up">
              <SectionHeader icon={<Sparkles className="w-8 h-8 text-pink-400" />} title="Meme Tips & Tricks" desc="Level up your meme game with these expert tips!" />
              <div className="space-y-4">
                <div className="bg-black/60 border border-pulse-orange/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                  <h4 className="font-semibold text-lg mb-2">🔥 Tip #1: Use Trending Topics</h4>
                  <p className="text-gray-300">Capitalize on current events or trends to make your meme coin relevant and timely.</p>
                </div>
                <div className="bg-black/60 border border-pulse-orange/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                  <h4 className="font-semibold text-lg mb-2">🎨 Tip #2: Eye-Catching Art</h4>
                  <p className="text-gray-300">Invest in good design! Memes with striking visuals tend to perform better.</p>
                </div>
                <div className="bg-black/60 border border-pulse-orange/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                  <h4 className="font-semibold text-lg mb-2">📢 Tip #3: Strong Messaging</h4>
                  <p className="text-gray-300">Make sure your meme coin's purpose and value proposition are crystal clear.</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      {/* Donation Section at absolute bottom of page */}
      <footer className="w-full flex flex-col items-center justify-center mt-20 mb-8 animate-fade-in-up">
        <div className="bg-black/60 border-2 border-pulse-orange/30 rounded-2xl shadow-xl px-6 py-5 flex flex-col items-center max-w-xl w-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-pulse-orange animate-bounce" />
            <span className="font-orbitron text-lg text-pulse-orange font-bold">Love MemePulse Genesis Forge?</span>
          </div>
          <p className="text-gray-300 text-center mb-2">If you enjoy what we're building, consider donating to support more meme magic and open-source tools!</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">Donation Address (PLS/ETH):</span>
            <span className="font-mono text-green-400 text-sm bg-black/70 px-3 py-1 rounded-lg select-all border border-green-500/20">0x53696A21d45D22d84F1299622fE1070251706dB6</span>
            <Button size="sm" variant="outline" className="border-green-400/40 text-green-400 hover:bg-green-900/10 mt-2" onClick={() => {navigator.clipboard.writeText('0x53696A21d45D22d84F1299622fE1070251706dB6'); toast({title: 'Donation Address Copied!', description: 'Thank you for your support! 💚', duration: 2000});}}>Copy Address</Button>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default Index;
