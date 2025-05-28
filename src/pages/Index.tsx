
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

const Index = () => {
  // Shared state
  const [coinIdea, setCoinIdea] = useState(null);
  const [tokenomics, setTokenomics] = useState({
    totalSupply: '1000000000',
    buyTax: '5',
    sellTax: '5',
    taxAllocation: {
      liquidity: '40',
      marketing: '40',
      reflection: '20'
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      <Header />
      <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
      <TokenomicsEngine />
      <ContractCodeGenerator tokenomics={tokenomics} coinIdea={coinIdea} />
      <SocialMediaLaunchpad coinIdea={coinIdea} />
      <LaunchChecklist />
      <TokenAnalyticsDashboard />
      <ResourcesSection />
      <Footer />
    </div>
  );
};

export default Index;
