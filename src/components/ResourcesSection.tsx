
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Zap, Users, Shield } from 'lucide-react';

const ResourcesSection = () => {
  const resources = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "How to Deploy a PRC-20 Token",
      description: "Step-by-step guide to deploying your meme coin smart contract on PulseChain",
      url: "https://docs.pulsechain.com/how-to/deploy-token",
      category: "Development"
    },
    {
      icon: <ExternalLink className="w-6 h-6" />,
      title: "Adding Liquidity to PulseX",
      description: "Learn how to provide liquidity for your token on PulseChain's native DEX",
      url: "https://pulsex.com/docs/liquidity",
      category: "DeFi"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "PulseChain Explorer",
      description: "View transactions, contracts, and token information on the PulseChain blockchain",
      url: "https://scan.pulsechain.com",
      category: "Tools"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Building Guide",
      description: "Best practices for building and managing your meme coin community",
      url: "https://academy.binance.com/en/articles/how-to-build-a-crypto-community",
      category: "Marketing"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Legal & Compliance Basics",
      description: "Understanding legal requirements and compliance for token projects",
      url: "https://blog.coinbase.com/understanding-cryptocurrency-regulation-for-developers-b3f6c18b5d6",
      category: "Legal"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Tokenomics Design Principles",
      description: "Learn the fundamentals of designing sustainable token economics",
      url: "https://coinmarketcap.com/alexandria/article/what-is-tokenomics",
      category: "Education"
    }
  ];

  const categories = ["All", "Development", "DeFi", "Tools", "Marketing", "Legal", "Education"];

  return (
    <section id="resources" className="py-20 bg-gradient-to-br from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            📚 PulseChain Resources
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Essential links and guides to help you launch and manage your PulseChain meme coin project
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/20 text-gray-300 hover:text-white transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card 
                key={index} 
                className="bg-card/80 backdrop-blur-md border-purple-500/20 hover:border-pulse-orange/50 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-pulse-purple to-pulse-orange rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      {resource.icon}
                    </div>
                    <span className="text-xs text-pulse-orange font-bold bg-pulse-orange/10 px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-orbitron text-white group-hover:text-pulse-orange transition-colors duration-300">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple transition-all duration-300"
                  >
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Visit Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 border-purple-500/30 max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="font-orbitron text-2xl font-bold text-white mb-4">
                  Need More Help? 🤝
                </h3>
                <p className="text-gray-300 mb-6">
                  Join the PulseChain community for support, discussions, and the latest updates on meme coin development.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/20"
                  >
                    <a href="https://t.me/PulseChainCom" target="_blank" rel="noopener noreferrer">
                      📱 Telegram Community
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/20"
                  >
                    <a href="https://twitter.com/PulseChainCom" target="_blank" rel="noopener noreferrer">
                      🐦 Twitter Updates
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/20"
                  >
                    <a href="https://discord.gg/pulsechain" target="_blank" rel="noopener noreferrer">
                      💬 Discord Server
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
