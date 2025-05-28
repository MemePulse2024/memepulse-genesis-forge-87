
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Rocket, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      toast({
        title: "Progress Updated! ✅",
        description: "Checklist item marked as complete.",
      });
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
    <section id="checklist" className="py-20 bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            📋 Launch Checklist
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete step-by-step guide to successfully launch your PulseChain meme coin
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Progress Overview */}
          <Card className="bg-card/80 backdrop-blur-md border-purple-500/20 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-center flex items-center justify-center gap-2">
                <Rocket className="w-6 h-6" />
                Launch Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Overall Progress</span>
                  <span className="text-pulse-orange font-bold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{completedItems.size}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{checklistItems.length - completedItems.size}</div>
                    <div className="text-sm text-gray-400">Remaining</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{checklistItems.length}</div>
                    <div className="text-sm text-gray-400">Total Tasks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist by Category */}
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = getCategoryItems(category);
              const categoryCompleted = categoryItems.filter(item => completedItems.has(item.id)).length;
              const categoryProgress = Math.round((categoryCompleted / categoryItems.length) * 100);

              return (
                <Card key={category} className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-orbitron flex items-center gap-2 capitalize">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        {category} Phase
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {categoryCompleted}/{categoryItems.length} complete
                        </div>
                        <div className="text-pulse-orange font-bold">{categoryProgress}%</div>
                      </div>
                    </div>
                    <Progress value={categoryProgress} className="h-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                        >
                          <Checkbox
                            id={item.id}
                            checked={completedItems.has(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor={item.id}
                                className="text-white font-medium cursor-pointer"
                              >
                                {completedItems.has(item.id) ? (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="line-through">{item.title}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-gray-400" />
                                    <span>{item.title}</span>
                                  </div>
                                )}
                              </label>
                              <div className="flex items-center gap-2 text-xs">
                                <span className={getPriorityColor(item.priority)}>
                                  {item.priority.toUpperCase()}
                                </span>
                                <span className="text-gray-400">⏱️ {item.estimated_time}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Completion Celebration */}
          {completionPercentage === 100 && (
            <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30 mt-8">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-orbitron font-bold text-white">
                    Congratulations! 🚀
                  </h3>
                  <p className="text-lg text-gray-300">
                    You've completed all launch tasks! Your meme coin is ready to moon! 🌙
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default LaunchChecklist;
