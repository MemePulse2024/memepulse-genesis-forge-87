
import { useState, useEffect } from 'react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(106,13,173,0.1),transparent)] pointer-events-none" />
      
      {/* PulseNet Watermark - top right of header */}
      <a
        href="https://pulsenet.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-black/80 px-4 py-2 rounded-full border-2 border-yellow-400/30 backdrop-blur-md hover:bg-black/90 hover:border-yellow-400/50 transition-all duration-300"
        style={{
          textDecoration: "none",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
        }}
      >
        <span 
          className="text-yellow-400 text-sm font-semibold font-orbitron"
          style={{
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
          }}
        >
          Made by
        </span>
        <img
          src="/lovable-uploads/54f55a5b-da54-4019-9a4b-49ac99703e9c.png"
          alt="PulseNet Logo"
          className="w-8 h-8 rounded-full"
          style={{
            filter: "brightness(1.3) contrast(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.4))",
          }}
        />
      </a>
      
      <div className={`text-center z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-orbitron text-6xl md:text-8xl font-black text-white mb-4 animate-glow">
          MemePulse 🚀
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto px-4">
          Your All-in-One PulseChain Meme Coin Idea Generator
        </p>
        
        <button
          onClick={scrollToGenerator}
          className="bg-gradient-to-r from-pulse-purple to-pulse-orange text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse-glow"
        >
          Generate Your Meme Coin 💎
        </button>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
