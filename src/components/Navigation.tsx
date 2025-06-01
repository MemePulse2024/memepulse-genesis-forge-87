
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="font-inter text-lg md:text-xl font-bold text-white">
              <span className="text-indigo-400">Meme</span>
              <span className="text-amber-400">Pulse</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs px-2 xl:px-3 font-medium whitespace-nowrap"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right side: PulseNet Watermark + Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* PulseNet Watermark */}
            <a
              href="https://pulsenet.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/30 rounded-lg px-2 md:px-3 py-1 md:py-1.5 hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-400/50 transition-all duration-200 group"
            >
              <span className="text-amber-400 text-xs font-medium hidden sm:inline">
                Made by
              </span>
              <img
                src="/lovable-uploads/54f55a5b-da54-4019-9a4b-49ac99703e9c.png"
                alt="PulseNet Logo"
                className="w-4 h-4 md:w-5 md:h-5 rounded filter brightness-110 group-hover:brightness-125 transition-all duration-200 flex-shrink-0"
              />
            </a>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-white/10 p-2"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-md border-t border-white/10 rounded-b-lg">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors justify-start font-medium text-sm"
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
