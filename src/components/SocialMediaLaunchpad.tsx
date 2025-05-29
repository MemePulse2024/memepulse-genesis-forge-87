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
    function fillTemplate(template: string) {
      return template.replace(/\{coinName\}/g, coinName).replace(/\{ticker\}/g, ticker).replace(/\{theme\}/g, theme);
    }
    switch (selectedPlatform) {
      case 'twitter-announcement': {
        const arr = announcementPosts;
        post = fillTemplate(arr[Math.floor(Math.random() * arr.length)]);
        break;
      }
      case 'twitter-meme': {
        const arr = memePosts;
        post = fillTemplate(arr[Math.floor(Math.random() * arr.length)]);
        break;
      }
      case 'telegram-pinned': {
        const arr = telegramPosts;
        post = fillTemplate(arr[Math.floor(Math.random() * arr.length)]);
        break;
      }
      case 'community-update': {
        const arr = communityPosts;
        post = fillTemplate(arr[Math.floor(Math.random() * arr.length)]);
        break;
      }
      default: {
        post = 'No post template available.';
      }
    }
    setGeneratedPost(post);
  };
          
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Launchpad</CardTitle>
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
  );
};
          
export default SocialMediaLaunchpad;