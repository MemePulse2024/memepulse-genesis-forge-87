import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Template variations based on theme categories
  const postTemplates = {
    twitterAnnouncement: {
      degen: [
        `🔥 ${coinIdea?.name} (${coinIdea?.ticker}) JUST DROPPED ON PULSECHAIN!! 🚀\n\n${coinIdea?.theme}\n\nBased AF team + Diamond hand community = MOON MISSION 💎🙌\n\n⚡️ LP LOCKED\n⚡️ CONTRACT RENOUNCED\n⚡️ EARLY AF\n\nDYOR BUT DON'T BE LATE ANON!\n\n#${coinIdea?.name} #PLS #WAGMI`,
        
        `🚨 ATTENTION DEGENS 🚨\n\n${coinIdea?.name} (${coinIdea?.ticker}) IS THE NEXT 100x GEM 💎\n\n${coinIdea?.theme}\n\n✨ COMFY SUPPLY\n✨ BASED DEVS\n✨ ORGANIC GROWTH\n\nDEGENS, YOU KNOW WHAT TO DO! 🦍\n\n#${coinIdea?.name} #PulseChain`,
        
        `👀 ANON, IT'S TIME!\n\n${coinIdea?.name} IS LIVE! 🔥\n\nWHY ${coinIdea?.ticker}?\n🦍 DEGEN COMMUNITY\n🚀 MOON TOKENOMICS\n💎 DIAMOND HANDS ONLY\n\n${coinIdea?.theme}\n\nSTILL EARLY! NFA/DYOR\n\n#${coinIdea?.name} #Pulsechain`,
        
        `💰 FREE ALPHA: ${coinIdea?.ticker}\n\nI FOUND THE NEXT 1000X\n\n${coinIdea?.theme}\n\n📈 ULTRA LOW MCAP\n🔒 SAFU\n🌊 MAX LIQUIDITY\n\nTHIS IS THE ONE ANON!\n\n#${coinIdea?.name} #PLS #GEM`,
        
        `🐸 PEPE WOULD APE ${coinIdea?.ticker}\n\n${coinIdea?.theme}\n\n🚀 STEALTH LAUNCHED\n💎 MICRO MC GEM\n🔥 TRENDING SOON\n\nDEGENS EATING GOOD TONIGHT!\n\n#${coinIdea?.name} #PulseGems`
      ],
      professional: [
        `🎯 Introducing ${coinIdea?.name} (${coinIdea?.ticker})\n\nElevating #PulseChain with innovation:\n\n${coinIdea?.theme}\n\n✅ Audited & Secured\n✅ Experienced Team\n✅ Long-term Vision\n✅ Community Driven\n\nRead our whitepaper: [LINK]\n\n#DeFi #Blockchain`,
        
        `📢 ${coinIdea?.name} Launch Announcement\n\nBringing institutional-grade DeFi to #PulseChain\n\n${coinIdea?.theme}\n\n🔹 Advanced Security\n🔹 DAO Governance\n🔹 Sustainable Tokenomics\n\nJoin our ecosystem\n\n#${coinIdea?.name} #DeFi`,
        
        `🚀 ${coinIdea?.name} ($${coinIdea?.ticker}) is now live on #PulseChain\n\nOur mission: ${coinIdea?.theme}\n\n📊 Market-leading Features:\n• Advanced Trading\n• Cross-chain Bridge\n• Yield Optimization\n\nDiscover more: [LINK]\n\n#DeFi #Innovation`,
        
        `🌟 The Future of DeFi: ${coinIdea?.name}\n\n${coinIdea?.theme}\n\n✨ Key Innovations:\n1. Smart Liquidity\n2. Risk Management\n3. Yield Strategies\n\nBacked by leading VCs\n\n#${coinIdea?.name} #PulseChain`,
        
        `📱 ${coinIdea?.name} Beta Launch\n\nTransforming PulseChain DeFi:\n\n${coinIdea?.theme}\n\n🛠 Features:\n• AI-powered Trading\n• Smart Portfolio\n• Real-time Analytics\n\n#${coinIdea?.name} #FinTech`
      ],
      community: [
        `💫 Welcome to the ${coinIdea?.name} Family!\n\n${coinIdea?.theme}\n\n👥 Built BY the community\n🤝 Built FOR the community\n\nJoin us on this amazing journey!\n\nTG: [LINK]\nDiscord: [LINK]\n\n#${coinIdea?.name} #Community`,
        
        `🌟 ${coinIdea?.name} Community Update\n\nTogether we're building something special!\n\n${coinIdea?.theme}\n\n💎 Growing Community\n🤝 Transparent Team\n❤️ Strong Values\n\n#${coinIdea?.name} #PulseFam`,
        
        `🎉 ${coinIdea?.ticker} Launch Day!\n\nCelebrating with our amazing community:\n\n${coinIdea?.theme}\n\n🎁 Airdrops Live\n🎨 NFT Rewards\n🎮 Community Games\n\n#${coinIdea?.name} #PulseCommunity`,
        
        `💝 ${coinIdea?.name} Loves Our Community!\n\n${coinIdea?.theme}\n\n🌟 Daily Giveaways\n🎭 Meme Contests\n🎪 Community Events\n\nJoin the fun!\n\n#${coinIdea?.name} #PulseChain`,
        
        `🌈 Building ${coinIdea?.name} Together!\n\n${coinIdea?.theme}\n\n🤝 Community-First\n🎯 Shared Goals\n💫 Growing Family\n\nBe Part of Something Special!\n\n#${coinIdea?.name}`
      ]
    },
    twitterMeme: [
      `😂 My wife: "We need groceries"\nMe: "But ${coinIdea?.ticker} is dipping!"\n\nGuess who's eating ramen this week 🍜\n\n#${coinIdea?.name} #CryptoLife`,
      
      `Time traveler: "Are you holding ${coinIdea?.ticker}?"\nMe: "No"\nTime traveler: "Enjoy being poor"\n\n#${coinIdea?.name} #Memecoin`,
      
      `Nobody:\n\n${coinIdea?.name} holders: "WAGMI" 🚀💎\n\n#${coinIdea?.name} #DiamondHands`,
      
      `My portfolio:\n📉📉📉\n\n${coinIdea?.ticker}:\n"Hold my beer" 🚀\n\n#${coinIdea?.name} #ToTheMoon`,
      
      `How I sleep knowing I'm early on ${coinIdea?.ticker}:\n😴💤💰\n\n#${coinIdea?.name} #Comfy`,
      
      `Mom: "Did you buy that weird ${coinIdea?.name} thing?"\nMe: "Maybe..."\nMom: "How much?"\nMe: *changes topic*\n\n#${coinIdea?.name} #SorryMom`,
      
      `McDonald's Manager: "Why did you quit?"\nMe: "I bought ${coinIdea?.ticker}"\n\n*one week later*\nMe: "Are you hiring?"\n\n#${coinIdea?.name} #CryptoLife`,
      
      `3 AM: Should be sleeping 😴\nMe: Checking ${coinIdea?.ticker} price for the 69th time\n\n#${coinIdea?.name} #Degenerate`,
      
      `When someone asks why I bought ${coinIdea?.ticker}:\n\n"Trust me bro" 🤝\n\n#${coinIdea?.name} #MemeCoin`,
      
      `My brain: "DYOR"\nMy heart: "APE IN ${coinIdea?.ticker}"\n\nGuess which one won 🦍\n\n#${coinIdea?.name} #FOMO`
    ],
    communityUpdate: [
      `📣 ${coinIdea?.name} Weekly Update 🚀\n\n${coinIdea?.theme}\n\n📊 Stats:\n• Holders: [X]\n• Volume: [Y]\n• MC: [Z]\n\n🎯 Achieved:\n• Exchange Listing\n• New Partnerships\n• Community Growth\n\n🗓 Coming Up:\n• AMA Session\n• Trading Contest\n• Surprise Event\n\n#${coinIdea?.name}`,
      
      `🌟 ${coinIdea?.name} Ecosystem Update\n\n${coinIdea?.theme}\n\n🏆 Milestones:\n• [Achievement 1]\n• [Achievement 2]\n• [Achievement 3]\n\n🎮 Community Events:\n• Meme Contest\n• Trading Competition\n• NFT Launch\n\n#${coinIdea?.name}`,
      
      `💫 ${coinIdea?.name} Progress Report\n\n${coinIdea?.theme}\n\n📈 Growth Metrics:\n• Twitter: +XX%\n• Telegram: +YY%\n• Holders: +ZZ%\n\n🎁 Rewards Distributed:\n• Trading Rewards\n• Staking Yields\n• NFT Airdrops\n\n#${coinIdea?.name}`,
      
      `🚀 This Week in ${coinIdea?.name}\n\n${coinIdea?.theme}\n\n🌟 Highlights:\n• New Listings\n• Protocol Upgrades\n• Community Growth\n\n🎯 Next Steps:\n• CEX Listing\n• NFT Launch\n• Yield Farms\n\n#${coinIdea?.name}`,
      
      `🎉 ${coinIdea?.name} Community Spotlight\n\n${coinIdea?.theme}\n\n👥 Top Contributors:\n• Meme Lords\n• Active Traders\n• Content Creators\n\n🏆 Achievements:\n• Price ATH\n• Holder ATH\n• Volume ATH\n\n#${coinIdea?.name}`
    ],
    telegramPinned: [
      `📌 Welcome to ${coinIdea?.name} Official\n\n${coinIdea?.theme}\n\n📊 TOKENOMICS\n• Supply: [X]\n• Tax: [Y]\n• LP: [Z]\n\n🔗 LINKS\n• Website: []\n• Chart: []\n• Twitter: []\n\n⚠️ RULES\n• Be Respectful\n• No FUD\n• No Spam\n\n#${coinIdea?.name}`,
      
      `🚀 ${coinIdea?.name} Quick Guide\n\n${coinIdea?.theme}\n\n💎 Why Choose Us:\n• Unique Features\n• Strong Community\n• Long-term Vision\n\n🔗 Important Links:\n• Contract: []\n• DEX: []\n• Socials: []\n\n#${coinIdea?.name}`,
      
      `📢 ${coinIdea?.name} Official Channel\n\n${coinIdea?.theme}\n\n🎯 Roadmap:\n• Phase 1: Launch\n• Phase 2: Growth\n• Phase 3: Expansion\n\n🌟 Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n#${coinIdea?.name}`,
      
      `💫 ${coinIdea?.name} Community Hub\n\n${coinIdea?.theme}\n\n🎁 Benefits:\n• Staking\n• NFTs\n• Events\n\n📱 Stay Connected:\n• Twitter\n• Discord\n• Medium\n\n#${coinIdea?.name}`,
      
      `🌟 ${coinIdea?.name} Essentials\n\n${coinIdea?.theme}\n\n🔒 Security:\n• Audited\n• KYC Team\n• LP Locked\n\n🎯 Goals:\n• Short-term\n• Mid-term\n• Long-term\n\n#${coinIdea?.name}`
    ],
    twitterThread: [
      `🧵 The Ultimate ${coinIdea?.name} Thread\n\n1/ Let's dive into why ${coinIdea?.ticker} is the next big thing on #PulseChain!\n\n${coinIdea?.theme}\n\n2/ Tokenomics Breakdown:\n• Total Supply\n• Distribution\n• Utility\n\n3/ Unique Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n4/ Roadmap:\n• Q2: Launch\n• Q3: Expansion\n• Q4: Partnerships\n\n5/ Community Benefits:\n• Rewards\n• Governance\n• Events\n\n6/ Join Us:\n• TG: []\n• Discord: []\n• Website: []\n\n7/ DYOR but don't miss out!\n\n#${coinIdea?.name}`,
      
      `🧵 Deep Dive: ${coinIdea?.name}\n\n1/ Breaking down the innovation behind ${coinIdea?.ticker}:\n\n${coinIdea?.theme}\n\n2/ Technology:\n• Smart Contracts\n• Security\n• Scalability\n\n3/ Market Analysis:\n• Competitors\n• Advantages\n• Potential\n\n4/ Team Background:\n• Experience\n• Vision\n• Commitment\n\n5/ Tokenomics:\n• Supply\n• Utility\n• Distribution\n\n6/ Get Involved:\n• Community\n• Rewards\n• Growth\n\n7/ Join us!\n\n#${coinIdea?.name}`,
      
      `🧵 ${coinIdea?.name} Explained\n\n1/ The Vision:\n${coinIdea?.theme}\n\n2/ Key Features:\n• Innovation\n• Security\n• Community\n\n3/ Use Cases:\n• Primary\n• Secondary\n• Future\n\n4/ Economics:\n• Model\n• Benefits\n• Growth\n\n5/ Roadmap:\n• Current\n• Next\n• Future\n\n6/ Join Now:\n• Links\n• Socials\n• Updates\n\n#${coinIdea?.name}`,
      
      `🧵 Why ${coinIdea?.ticker} Will Moon\n\n1/ The Basics:\n${coinIdea?.theme}\n\n2/ Market Need:\n• Problem\n• Solution\n• Impact\n\n3/ Technology:\n• Platform\n• Features\n• Security\n\n4/ Community:\n• Growth\n• Events\n• Rewards\n\n5/ Future:\n• Plans\n• Updates\n• Vision\n\n6/ Get Started:\n• Buy\n• Hold\n• Earn\n\n#${coinIdea?.name}`,
      
      `🧵 ${coinIdea?.name} Alpha Thread\n\n1/ Introduction:\n${coinIdea?.theme}\n\n2/ Ecosystem:\n• Components\n• Integration\n• Growth\n\n3/ Benefits:\n• Users\n• Holders\n• Community\n\n4/ Strategy:\n• Short-term\n• Mid-term\n• Long-term\n\n5/ Partnerships:\n• Current\n• Planned\n• Potential\n\n6/ Join Us!\n\n#${coinIdea?.name}`
    ]
  };

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
    
    const selectedPlatformConfig = platforms.find(p => p.value === selectedPlatform);
    const maxLength = selectedPlatformConfig?.maxLength || 280;
    
    let post = '';
    
    // Determine tone based on theme and platform
    const themeWords = theme.toLowerCase().split(' ');
    let tone = 'community';
    if (themeWords.some(word => ['funny', 'meme', 'joke', 'laugh', 'pepe', 'degen'].includes(word))) {
      tone = 'degen';
    } else if (themeWords.some(word => ['defi', 'protocol', 'finance', 'security', 'professional'].includes(word))) {
      tone = 'professional';
    }

    switch (selectedPlatform) {
      case 'twitter-announcement':
        const announcements = postTemplates.twitterAnnouncement[tone as keyof typeof postTemplates.twitterAnnouncement] || postTemplates.twitterAnnouncement.community;
        post = announcements[Math.floor(Math.random() * announcements.length)];
        break;
      
      case 'twitter-meme':
        post = postTemplates.twitterMeme[Math.floor(Math.random() * postTemplates.twitterMeme.length)];
        break;
      
      case 'community-update':
        post = postTemplates.communityUpdate[Math.floor(Math.random() * postTemplates.communityUpdate.length)];
        break;
      
      case 'telegram-pinned':
        post = postTemplates.telegramPinned[Math.floor(Math.random() * postTemplates.telegramPinned.length)];
        break;
      
      case 'twitter-thread':
        post = postTemplates.twitterThread[Math.floor(Math.random() * postTemplates.twitterThread.length)];
        break;
    }

    // Replace placeholders
    post = post
      .replace(/\${coinName}/g, coinName)
      .replace(/\${ticker}/g, ticker)
      .replace(/\${theme}/g, theme);

    // Truncate if exceeding max length
    if (post.length > maxLength) {
      post = post.slice(0, maxLength - 3) + '...';
    }

    setGeneratedPost(post);
    setCharCount(post.length);
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
