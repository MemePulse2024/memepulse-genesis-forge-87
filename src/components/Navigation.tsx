
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#generator', label: '💡 Idea Generator' },
    { href: '#tokenomics', label: '⚙️ Tokenomics' },
    { href: '#contract', label: '🔧 Smart Contract' },
    { href: '#social', label: '📱 Social Media' },
    { href: '#checklist', label: '📋 Launch Guide' },
    { href: '#analytics', label: '📊 Analytics' },
    { href: '#resources', label: '📚 Resources' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="font-orbitron text-xl font-bold text-white">
              <span className="text-pulse-purple">Meme</span>
              <span className="text-pulse-orange">Pulse</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white hover:bg-purple-800/50 transition-colors text-xs px-3"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right side: PulseNet Watermark + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* PulseNet Watermark */}
            <a
              href="https://pulsenet.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full border border-yellow-400/30 backdrop-blur-md hover:bg-black/90 hover:border-yellow-400/50 transition-all duration-300"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.15)",
              }}
            >
              <span 
                className="text-yellow-400 text-xs font-semibold font-orbitron hidden sm:inline"
                style={{
                  textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
                }}
              >
                Made by
              </span>
              <img
                src="/lovable-uploads/54f55a5b-da54-4019-9a4b-49ac99703e9c.png"
                alt="PulseNet Logo"
                className="w-6 h-6 rounded-full"
                style={{
                  filter: "brightness(1.3) contrast(1.2) drop-shadow(0 0 6px rgba(255,215,0,0.3))",
                }}
              />
            </a>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-md border-t border-purple-500/20">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-left text-gray-300 hover:text-white hover:bg-purple-800/50 transition-colors justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
