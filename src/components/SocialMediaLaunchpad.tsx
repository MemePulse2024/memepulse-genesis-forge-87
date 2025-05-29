import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface CoinIdea {
  name: string;
  ticker: string;
  theme: string;
  logoIdea: string;
}

const SocialMediaLaunchpad = ({ coinIdea }: { coinIdea: CoinIdea | null }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setCharCount(generatedPost.length);
  }, [generatedPost]);

  const platforms = [
    { value: 'twitter-announcement', label: '🐦 Twitter Announcement', maxLength: 280 },
    { value: 'twitter-meme', label: '😂 Twitter Meme Post', maxLength: 280 },
    { value: 'telegram-pinned', label: '💬 Telegram Pinned Post', maxLength: 2000 },
    { value: 'twitter-thread', label: '🧵 Twitter Thread', maxLength: 280 * 4 },
    { value: 'community-update', label: '📢 Community Update', maxLength: 2000 }
  ];

  const toneVariations = ['degen', 'professional', 'hype', 'community', 'mysterious'];

  const generateAIPost = () => {
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
    const logoIdea = coinIdea?.logoIdea || '';
    
    // AI-powered tone selection based on theme
    const themeWords = theme.toLowerCase().split(' ');
    let suggestedTone = 'hype';
    
    if (themeWords.some(word => ['funny', 'meme', 'joke', 'laugh'].includes(word))) {
      suggestedTone = 'degen';
    } else if (themeWords.some(word => ['serious', 'defi', 'protocol'].includes(word))) {
      suggestedTone = 'professional';
    } else if (themeWords.some(word => ['community', 'together', 'people'].includes(word))) {
      suggestedTone = 'community';
    } else if (themeWords.some(word => ['secret', 'hidden', 'mystery'].includes(word))) {
      suggestedTone = 'mysterious';
    }
    
    const tone = suggestedTone;
    const selectedPlatformConfig = platforms.find(p => p.value === selectedPlatform);
    const maxLength = selectedPlatformConfig?.maxLength || 280;
    
    let post = '';

    switch (selectedPlatform) {
      case 'twitter-announcement':
        if (tone === 'professional') {
          const professionalPosts = [
            `📢 Introducing ${coinName} (${ticker}) on PulseChain\n\n${theme}\n\nKey Features:\n✅ Advanced Tokenomics\n✅ Decentralized Governance\n✅ Audited Smart Contract\n✅ Locked Liquidity\n\nJoin us in building the future of DeFi on #PulseChain\n\nLearn more: [WEBSITE]\nChart: [CHART]\n\n#${coinName} #PulseChain #DeFi #Crypto`,
            `🚀 ${coinName} (${ticker}) - The Next Evolution in PulseChain DeFi\n\nOur Vision:\n${theme}\n\n✨ Features:\n• Advanced Security Measures\n• Community-Driven Development\n• Transparent Tokenomics\n• Regular Updates & AMAs\n\nJoin our growing ecosystem!\n\n#${coinName} #PulseChain #DeFi`
          ];
          post = professionalPosts[Math.floor(Math.random() * professionalPosts.length)];
        } else if (tone === 'degen') {
          const degenPosts = [
            `🔥 ${coinName} (${ticker}) JUST LAUNCHED ON PULSECHAIN!! 🔥\n\n${theme}\n\nThis is it anons... the next 1000x is HERE 🚀\n\n✨ Based dev team\n✨ Diamond hand community\n✨ Moon mission activated\n\nAPE IN NOW OR STAY POOR FOREVER! 💎🙌\n\n#${coinName} #PulseChain #ToTheMoon #WAGMI`,
            `👀 ANON, YOU'RE EARLY TO ${ticker}!\n\n${theme}\n\n🚀 The FOMO is real\n💎 Diamond hands only\n🌙 1000x or nothing\n\nThis is NOT financial advice (but you might hate yourself if you miss it)\n\n#${coinName} #PulseChain #100x #GEM`
          ];
          post = degenPosts[Math.floor(Math.random() * degenPosts.length)];
        } else {
          post = `🎉 ${coinName} (${ticker}) has arrived on PulseChain! 🎉\n\n${theme}\n\n🌟 Join the revolution\n🌟 Built by the community, for the community\n🌟 Next stop: The moon! 🌙\n\nDon't miss out on this incredible journey!\n\n#${coinName} #PulseChain #CommunityToken #MemeCoin`;
        }
        break;

      case 'twitter-meme':
        const memeTemplates = [
          `POV: You bought ${coinName} (${ticker}) at launch 📈\n\n"I'm not selling until we hit $1" 😤\n\n#${coinName} #PulseChain #DiamondHands`,
          `Me explaining to my wife why I need to buy more ${coinName} (${ticker}):\n\n"But honey, it's not just a meme coin... it's a LIFESTYLE" 🤡\n\n#${coinName} #PulseChain #MemeCoinLife`,
          `${coinName} (${ticker}) holders be like:\n\n😴 8am: Still sleeping\n🚀 9am: Checking charts\n💎 10am: Buying the dip\n🌙 11am: Already planning moon party\n\n#${coinName} #PulseChain #MemeLife`
        ];
        post = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
        break;

      case 'twitter-thread':
        post = `🧵 Deep Dive into ${coinName} (${ticker}) - A Thread\n\n1/ Let's explore what makes ${coinName} unique in the PulseChain ecosystem. ${theme}\n\n2/ Our Tokenomics:\n- Total Supply: [SUPPLY]\n- Initial LP: [LP]\n- Team Tokens: Locked for 6 months\n\n3/ Security First:\n- Audited by [AUDIT]\n- Ownership renounced\n- LP locked for 1 year\n\n4/ Upcoming Milestones:\n- CoinGecko/CMC Listings\n- CEX Integration\n- Community Governance\n- Staking Platform\n\n5/ Join the ${coinName} Revolution:\n- Website: [LINK]\n- Telegram: [LINK]\n- Discord: [LINK]\n\n6/ Not Financial Advice\n\nLike & RT to spread the word! 🚀\n\n#${coinName} #PulseChain`;
        break;

      case 'telegram-pinned':
        post = `📌 PINNED MESSAGE 📌\n\nWelcome to ${coinName} (${ticker}) Official Telegram! 🚀\n\n${theme}\n\n📊 QUICK INFO:\n• Contract: [CONTRACT_ADDRESS]\n• Chain: PulseChain\n• Ticker: ${ticker}\n• Total Supply: [SUPPLY]\n\n🔗 IMPORTANT LINKS:\n• Website: [WEBSITE]\n• PulseX: [PULSEX_LINK]\n• Chart: [CHART_LINK]\n\n⚠️ RULES:\n• No spam or FUD\n• Be respectful to all members\n• No price predictions\n• Official announcements only from admins\n\nWelcome to the ${coinName} family! 🎉\nLet's build something amazing together! 💎\n\n#${coinName} #PulseChain #CommunityFirst`;
        break;

      case 'community-update':
        post = `📢 ${coinName} Community Update - ${new Date().toLocaleDateString()}\n\nDear ${coinName} Family! 🌟\n\n${theme}\n\n🎯 Weekly Achievements:\n1. Hit [X] holders milestone\n2. [Y] Trading Volume\n3. New partnerships secured\n\n📈 Growth Metrics:\n• Holders: [X]\n• Market Cap: [Y]\n• 24h Volume: [Z]\n\n🚀 Upcoming:\n• [Feature 1] launch\n• [Feature 2] integration\n• Community AMA\n\n💎 Community Highlights:\n• Top memes of the week\n• Most active community members\n• Trading competition winners\n\n🙏 Thank you for being part of our journey!\n\n#${coinName} #PulseChain #CommunityFirst`;
        break;
    }

    // Truncate if exceeding max length
    if (post.length > maxLength) {
      post = post.slice(0, maxLength - 3) + '...';
    }

    setGeneratedPost(post);
    toast({
      title: "Post Generated! 🎉",
      description: `Generated ${platforms.find(p => p.value === selectedPlatform)?.label} post`,
    });
  };

  const copyPost = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      toast({
        title: "Copied! 📋",
        description: "Post copied to clipboard",
      });
    }
  };

  const selectedPlatformConfig = platforms.find(p => p.value === selectedPlatform);
  const maxLength = selectedPlatformConfig?.maxLength || 280;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <Card className="w-full bg-black/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Social Media Launchpad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="bg-black/50 border-purple-500/20">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Textarea
              placeholder="Generated post will appear here..."
              className="h-[200px] bg-black/50 border-purple-500/20"
              value={generatedPost}
              onChange={(e) => setGeneratedPost(e.target.value)}
            />
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>{charCount} / {maxLength} characters</span>
              <Progress value={charPercentage} className="w-1/2" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateAIPost}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Post
            </Button>
            <Button
              onClick={copyPost}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
              disabled={!generatedPost}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaLaunchpad;
