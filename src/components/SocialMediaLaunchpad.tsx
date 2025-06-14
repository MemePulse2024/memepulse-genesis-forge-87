import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { announcementPosts } from './socialPosts/announcementPosts';
import { memePosts } from './socialPosts/memePosts';
import { telegramPosts } from './socialPosts/telegramPosts';
import { communityPosts } from './socialPosts/communityPosts';
import Confetti from 'react-confetti';
import { nanoid } from 'nanoid';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCharCount(generatedPost.length);
  }, [generatedPost]);

  const platforms = [
    { value: 'twitter-announcement', label: '🐦 Twitter Announcement', maxLength: 280 },
    { value: 'twitter-meme', label: '😂 Twitter Meme Post', maxLength: 280 },
    { value: 'telegram-pinned', label: '💬 Telegram Pinned Post', maxLength: 2000 },
    { value: 'community-update', label: '📢 Community Update', maxLength: 2000 }
  ];

  const toneVariations = ['degen', 'professional', 'hype', 'community', 'mysterious'];

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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

    // Add more randomization for uniqueness
    const emojis = ['🚀', '🔥', '💎', '🐸', '😂', '🌕', '🦄', '💰', '🎉', '🤖', '🧬', '🦍', '👑', '✨', '🥳'];
    const hashtags = [
      '#PulseChain', '#MemeCoin', '#Crypto', '#DeFi', '#Viral', '#Launch', '#Degen', '#Moon', '#HODL', '#Trending', '#Token', '#Airdrop', '#Liquidity', '#Community', '#Innovation'
    ];
    const randomEmoji = getRandomElement(emojis);
    const randomHashtags = Array.from({length: 2 + Math.floor(Math.random()*2)}, () => getRandomElement(hashtags)).join(' ');
    const uniqueId = nanoid(6);

    function fillTemplate(template: string) {
      return template
        .replace(/\{coinName\}/g, coinName)
        .replace(/\{ticker\}/g, ticker)
        .replace(/\{theme\}/g, theme)
        .replace(/\{logoIdea\}/g, logoIdea)
        .replace(/\{emoji\}/g, randomEmoji)
        .replace(/\{hashtags\}/g, randomHashtags)
        .replace(/\{uniqueId\}/g, uniqueId);
    }

    let post = '';
    switch (selectedPlatform) {
      case 'twitter-announcement': {
        const arr = announcementPosts;
        post = fillTemplate(getRandomElement(arr));
        break;
      }
      case 'twitter-meme': {
        const arr = memePosts;
        post = fillTemplate(getRandomElement(arr));
        break;
      }
      case 'telegram-pinned': {
        const arr = telegramPosts;
        post = fillTemplate(getRandomElement(arr));
        break;
      }
      case 'community-update': {
        const arr = communityPosts;
        post = fillTemplate(getRandomElement(arr));
        break;
      }
      default: {
        post = 'No post template available.';
      }
    }
    // Add extra randomization at the end
    post += `\n${randomEmoji} ${randomHashtags} [${uniqueId}]`;
    setGeneratedPost(post);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };
          
  return (
    <section id="social" className="relative py-16 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-[60vh] backdrop-blur-3xl">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={100} />
      )}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            🚀 Social Media Launchpad
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Instantly generate viral posts for your meme coin launch!
          </p>
        </div>
        <Card className="bg-black/40 border-2 border-purple-500/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-center">Generate Social Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedPlatform}
                onValueChange={setSelectedPlatform}
              >
                <SelectTrigger className="bg-gray-800 border border-purple-500 text-white h-[50px]">
                  <span className="text-white">
                    {platforms.find(p => p.value === selectedPlatform)?.label || 'Select Platform'}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value} className="text-white hover:bg-gray-700 cursor-pointer font-normal">
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={generateAIPost} disabled={!selectedPlatform}>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate Post
              </Button>
              <Textarea
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                rows={8}
                maxLength={platforms.find(p => p.value === selectedPlatform)?.maxLength || 280}
                placeholder="Your AI-generated post will appear here..."
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {charCount} / {platforms.find(p => p.value === selectedPlatform)?.maxLength || 280} characters
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPost);
                    toast({
                      title: "Copied!",
                      description: "Post copied to clipboard.",
                    });
                  }}
                  disabled={!generatedPost}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
              <Progress value={(charCount / (platforms.find(p => p.value === selectedPlatform)?.maxLength || 280)) * 100} />
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
          
export default SocialMediaLaunchpad;