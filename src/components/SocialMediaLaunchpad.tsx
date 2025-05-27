import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoinIdea {
  name: string;
  ticker: string;
  theme: string;
  logoIdea: string;
}

const SocialMediaLaunchpad = ({ coinIdea }: { coinIdea: CoinIdea | null }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // If coinIdea changes, update state (no need to load from localStorage)
    // This ensures the latest idea is always used
  }, [coinIdea]);

  const platforms = [
    { value: 'twitter-announcement', label: '🐦 Twitter Announcement' },
    { value: 'twitter-meme', label: '😂 Twitter Meme Post' },
    { value: 'telegram-pinned', label: '💬 Telegram Pinned Post' }
  ];

  const toneVariations = ['degen', 'professional', 'hype', 'community', 'mysterious'];

  const generatePost = () => {
    if (!selectedPlatform) {
      toast({
        title: "Select Platform",
        description: "Please select a social media platform first.",
        variant: "destructive"
      });
      return;
    }

    const coinName = coinIdea?.name || 'YourMemeCoin';
    const ticker = coinIdea?.ticker || '$MEME';
    const theme = coinIdea?.theme || 'An amazing meme coin on PulseChain';
    
    const tone = toneVariations[Math.floor(Math.random() * toneVariations.length)];
    
    let post = '';

    switch (selectedPlatform) {
      case 'twitter-announcement':
        if (tone === 'professional') {
          post = `🚀 Introducing ${coinName} (${ticker}) on PulseChain!

${theme}

✅ Fair Launch
✅ Community Driven  
✅ LP Locked
✅ Contract Verified

Join our growing community and be part of the next big thing on #PulseChain!

#${coinName} #PulseChain #MemeCoin #DeFi #Crypto`;
        } else if (tone === 'degen') {
          post = `🔥 ${coinName} (${ticker}) IS LIVE ON PULSECHAIN!! 🔥

${theme}

This is it anons... the next 1000x is HERE 🚀

✨ Based dev team
✨ Diamond hand community
✨ Moon mission activated

APE IN NOW OR STAY POOR FOREVER! 💎🙌

#${coinName} #PulseChain #ToTheMoon #WAGMI`;
        } else {
          post = `🎉 ${coinName} (${ticker}) has arrived on PulseChain! 🎉

${theme}

🌟 Join the revolution
🌟 Built by the community, for the community
🌟 Next stop: The moon! 🌙

Don't miss out on this incredible journey!

#${coinName} #PulseChain #CommunityToken #MemeCoin`;
        }
        break;

      case 'twitter-meme':
        const memeTemplates = [
          `POV: You bought ${coinName} (${ticker}) at launch 📈

"I'm not selling until we hit $1" 😤

#${coinName} #PulseChain #DiamondHands`,
          
          `Me explaining to my wife why I need to buy more ${coinName} (${ticker}):

"But honey, it's not just a meme coin... it's a LIFESTYLE" 🤡

#${coinName} #PulseChain #MemeCoinLife`,
          
          `${coinName} (${ticker}) holders be like:

😴 8am: Still sleeping
🚀 9am: Checking charts
💎 10am: Buying the dip
🌙 11am: Already planning moon party

#${coinName} #PulseChain #MemeLife`
        ];
        post = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
        break;

      case 'telegram-pinned':
        post = `📌 PINNED MESSAGE 📌

Welcome to ${coinName} (${ticker}) Official Telegram! 🚀

${theme}

📊 QUICK INFO:
• Contract: [CONTRACT_ADDRESS]
• Chain: PulseChain
• Ticker: ${ticker}
• Total Supply: [SUPPLY]

🔗 IMPORTANT LINKS:
• Website: [WEBSITE]
• PulseX: [PULSEX_LINK]
• Chart: [CHART_LINK]

⚠️ RULES:
• No spam or FUD
• Be respectful to all members
• No price predictions
• Official announcements only from admins

Welcome to the ${coinName} family! 🎉
Let's build something amazing together! 💎

#${coinName} #PulseChain #CommunityFirst`;
        break;
    }

    setGeneratedPost(post);
    toast({
      title: "Post Generated! 🎉",
      description: `Generated ${platforms.find(p => p.value === selectedPlatform)?.label} post`,
    });
  };

  const copyPost = () => {
    if (!generatedPost) return;
    
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied to Clipboard! 📋",
      description: "Social media post copied successfully.",
    });
  };

  const regeneratePost = () => {
    if (selectedPlatform) {
      generatePost();
    }
  };

  return (
    <section id="social" className="py-20 bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            📱 Social Media Launchpad
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate engaging social media posts for your meme coin launch across different platforms
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-md border-purple-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-center">Generate Social Media Posts</CardTitle>
              {coinIdea && (
                <div className="text-center text-sm text-gray-400">
                  Using coin idea: <span className="text-pulse-orange font-bold">{coinIdea.name} ({coinIdea.ticker})</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="bg-black/50 border-gray-600">
                      <SelectValue placeholder="Select social media platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {platforms.map((platform) => (
                        <SelectItem 
                          key={platform.value} 
                          value={platform.value}
                          className="text-white hover:bg-gray-700"
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={generatePost}
                    className="bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple transition-all duration-300"
                  >
                    Generate Post 🚀
                  </Button>
                  
                  {generatedPost && (
                    <Button
                      onClick={regeneratePost}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {!coinIdea && (
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-orange-300 text-sm">
                    💡 Tip: Generate a meme coin idea first to automatically populate your posts with coin details!
                  </p>
                </div>
              )}

              {generatedPost && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 rounded-lg border border-purple-500/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-orbitron text-lg font-bold text-pulse-orange">
                        Generated Post
                      </h3>
                      <Button
                        onClick={copyPost}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    
                    <Textarea
                      value={generatedPost}
                      readOnly
                      className="bg-black/50 border-gray-600 text-white min-h-[200px] resize-none"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-pulse-orange font-bold mb-1">Character Count</div>
                      <div className="text-white">{generatedPost.length}</div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-pulse-orange font-bold mb-1">Hashtags</div>
                      <div className="text-white">{(generatedPost.match(/#\w+/g) || []).length}</div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-pulse-orange font-bold mb-1">Emojis</div>
                      <div className="text-white">{(generatedPost.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/gu) || []).length}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaLaunchpad;
