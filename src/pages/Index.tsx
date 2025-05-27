import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import IdeaGenerator from '@/components/IdeaGenerator';
import TokenomicsEngine from '@/components/TokenomicsEngine';
import SocialMediaLaunchpad from '@/components/SocialMediaLaunchpad';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';

const Index = () => {
  // Shared coin idea state
  const [coinIdea, setCoinIdea] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      <Header />
      <IdeaGenerator coinIdea={coinIdea} setCoinIdea={setCoinIdea} />
      <TokenomicsEngine />
      <SocialMediaLaunchpad coinIdea={coinIdea} />
      <ResourcesSection />
      <Footer />
    </div>
  );
};

export default Index;
