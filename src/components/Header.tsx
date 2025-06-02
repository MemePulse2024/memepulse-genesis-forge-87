
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
    <header className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* PulseChain inspired background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.02)_50%,transparent_60%)] pointer-events-none" />
      
      {/* Animated pulse grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`text-center z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6">
            <h1 className="font-inter text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-2 leading-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                MemePulse
              </span>
            </h1>
            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
              💎 GENESIS FORGE 💎
            </div>
            <div className="text-sm sm:text-lg md:text-xl font-semibold text-indigo-300 uppercase tracking-wider">
              Built for the PulseChain Ecosystem
            </div>
          </div>
          
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto px-4 leading-relaxed">
            <span className="font-semibold text-white">ZERO CODE. MAXIMUM PULSE.</span><br />
            Professional meme coin creation tools for the world's fastest blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 px-4">
            <button
              onClick={scrollToGenerator}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border border-white/20"
            >
              🚀 PULSE YOUR WAY TO SUCCESS
            </button>
            <div className="text-amber-400 font-semibold text-xs md:text-sm text-center">
              ⚡ Deploy on PulseChain in minutes
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto px-4">
            <span className="px-3 md:px-4 py-2 bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
              ⚡ 12 second block times
            </span>
            <span className="px-3 md:px-4 py-2 bg-amber-600/30 border border-amber-400/50 text-amber-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
              💰 Lowest Gas Fees
            </span>
            <span className="px-3 md:px-4 py-2 bg-purple-600/30 border border-purple-400/50 text-purple-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
              🔥 Fork-Free Future
            </span>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator with pulse effect */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center bg-amber-400/10 backdrop-blur-sm">
          <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
