import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h3 className="font-orbitron text-2xl font-bold text-white mb-4">
              MemePulse 🚀
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your all-in-one PulseChain meme coin idea generator and launchpad.
              Create, configure, and launch your meme coin with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-orbitron text-lg font-bold text-pulse-orange mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              <button
                onClick={() =>
                  document.getElementById("generator")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300 mx-auto"
              >
                Generator
              </button>
              <button
                onClick={() =>
                  document.getElementById("tokenomics")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300 mx-auto"
              >
                Tokenomics
              </button>
              <button
                onClick={() =>
                  document.getElementById("social")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300 mx-auto"
              >
                Social Media
              </button>
              <button
                onClick={() =>
                  document.getElementById("resources")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300 mx-auto"
              >
                Resources
              </button>
            </div>
          </div>

          {/* Community */}
          <div className="text-center md:text-right">
            <h4 className="font-orbitron text-lg font-bold text-pulse-orange mb-4">
              Community
            </h4>
            <div className="space-y-2">
              <a
                href="https://github.com/MemePulse2024"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href="https://x.com/pulsenet369?t=h7EY6mvJAI9rnm-i0GKRhA&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300"
              >
                Twitter
              </a>
              <a
                href="https://t.me/PulseNet369"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-pulse-orange transition-colors duration-300"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm text-center">
              ⚠️ <strong>Disclaimer:</strong> MemePulse is for entertainment and
              educational purposes only. Always do your own research (DYOR) before
              investing in any cryptocurrency. Meme coins are highly speculative
              and risky investments.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} MemePulse. Built with ❤️ for the PulseChain
              community.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Powered by PulseChain</span>
              <div className="w-2 h-2 bg-pulse-purple rounded-full animate-pulse"></div>
              <span>Made by Degens, for Degens</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
