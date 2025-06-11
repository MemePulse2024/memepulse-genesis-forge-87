import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Rocket, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'preparation' | 'development' | 'testing' | 'launch' | 'marketing';
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
}

const LaunchChecklist = () => {
  const { toast } = useToast();
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const checklistItems: ChecklistItem[] = [
    // Preparation Phase
    {
      id: 'idea-validation',
      title: 'Validate Your Meme Coin Idea',
      description: 'Research market trends, check for similar projects, and validate your concept',
      category: 'preparation',
      priority: 'high',
      estimated_time: '2-4 hours'
    },
    {
      id: 'tokenomics-design',
      title: 'Design Tokenomics',
      description: 'Define total supply, tax rates, and allocation percentages',
      category: 'preparation',
      priority: 'high',
      estimated_time: '1-2 hours'
    },
    {
      id: 'wallet-setup',
      title: 'Setup PulseChain Wallet',
      description: 'Configure MetaMask for PulseChain and get testnet PLS',
      category: 'preparation',
      priority: 'high',
      estimated_time: '30 minutes'
    },
    
    // Development Phase
    {
      id: 'contract-generation',
      title: 'Generate Smart Contract',
      description: 'Use the contract generator to create your token smart contract',
      category: 'development',
      priority: 'high',
      estimated_time: '15 minutes'
    },
    {
      id: 'contract-review',
      title: 'Review Contract Code',
      description: 'Carefully review the generated contract and customize if needed',
      category: 'development',
      priority: 'high',
      estimated_time: '1-2 hours'
    },
    {
      id: 'logo-design',
      title: 'Create Token Logo',
      description: 'Design a memorable logo based on your generated logo idea',
      category: 'development',
      priority: 'medium',
      estimated_time: '2-4 hours'
    },
    
    // Testing Phase
    {
      id: 'testnet-deploy',
      title: 'Deploy to Testnet',
      description: 'Deploy your contract to PulseChain testnet for testing',
      category: 'testing',
      priority: 'high',
      estimated_time: '30 minutes'
    },
    {
      id: 'contract-testing',
      title: 'Test Contract Functions',
      description: 'Test all contract functions including transfers and tax distribution',
      category: 'testing',
      priority: 'high',
      estimated_time: '2-3 hours'
    },
    {
      id: 'security-audit',
      title: 'Security Audit (Optional)',
      description: 'Get your contract audited by a professional auditing firm',
      category: 'testing',
      priority: 'medium',
      estimated_time: '1-2 weeks'
    },
    
    // Launch Phase
    {
      id: 'mainnet-deploy',
      title: 'Deploy to Mainnet',
      description: 'Deploy your tested contract to PulseChain mainnet',
      category: 'launch',
      priority: 'high',
      estimated_time: '15 minutes'
    },
    {
      id: 'contract-verification',
      title: 'Verify Contract',
      description: 'Verify your contract on PulseScan for transparency',
      category: 'launch',
      priority: 'high',
      estimated_time: '30 minutes'
    },
    {
      id: 'liquidity-addition',
      title: 'Add Liquidity to PulseX',
      description: 'Add initial liquidity to PulseX and lock it',
      category: 'launch',
      priority: 'high',
      estimated_time: '1 hour'
    },
    
    // Marketing Phase
    {
      id: 'website-creation',
      title: 'Create Project Website',
      description: 'Build a professional website with tokenomics and roadmap',
      category: 'marketing',
      priority: 'medium',
      estimated_time: '1-3 days'
    },
    {
      id: 'social-media-setup',
      title: 'Setup Social Media',
      description: 'Create Twitter, Telegram, and Discord communities',
      category: 'marketing',
      priority: 'high',
      estimated_time: '2-4 hours'
    },
    {
      id: 'launch-announcement',
      title: 'Launch Announcement',
      description: 'Announce your token launch across all platforms',
      category: 'marketing',
      priority: 'high',
      estimated_time: '1 hour'
    }
  ];

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
      if (newCompleted.size === checklistItems.length) {
        setShowConfetti(true);
        toast({
          title: "All Steps Complete! 🎉",
          description: "You finished the meme coin launch checklist!",
        });
        setTimeout(() => setShowConfetti(false), 2500);
      }
    }
    setCompletedItems(newCompleted);
  };

  const completionPercentage = Math.round((completedItems.size / checklistItems.length) * 100);

  const getCategoryItems = (category: string) => {
    return checklistItems.filter(item => item.category === category);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      preparation: '🎯',
      development: '⚙️',
      testing: '🧪',
      launch: '🚀',
      marketing: '📢'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const categories = ['preparation', 'development', 'testing', 'launch', 'marketing'];

  return (
    <section id="checklist" className="relative py-16 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-[60vh] backdrop-blur-3xl">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={120} />
      )}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            📝 Meme Coin Launch Checklist
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Track your progress and launch your meme coin with confidence!
          </p>
        </div>
        <Card className="bg-black/40 border-2 border-purple-500/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-center">Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {checklistItems.map((item) => (
                <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${completedItems.has(item.id) ? 'bg-gradient-to-r from-pulse-purple/30 to-pulse-orange/20 border-pulse-orange/40 scale-105' : 'bg-black/30 border-purple-500/10 hover:border-pulse-orange/30'}`}>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${completedItems.has(item.id) ? 'bg-pulse-orange border-pulse-orange text-white animate-bounce' : 'bg-black border-purple-500 text-purple-300'}`}
                    aria-label="Toggle complete"
                  >
                    {completedItems.has(item.id) ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron text-lg font-bold text-pulse-orange">{item.title}</span>
                      {item.priority === 'high' && <span className="text-xs bg-pulse-orange/20 text-pulse-orange px-2 py-1 rounded-full">High</span>}
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{item.description}</p>
                    <span className="text-xs text-gray-500">{item.estimated_time} • {item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                  </div>
                </div>
              ))}
              <Progress value={(completedItems.size / checklistItems.length) * 100} className="h-3 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple rounded-full" />
            </div>
          </CardContent>
        </Card>
        {/* Animated divider for flow */}
        <div className="w-full flex justify-center mt-12">
          <div className="h-2 w-32 rounded-full bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default LaunchChecklist;
