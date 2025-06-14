import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, Copy, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';

interface CoinIdea {
  name: string;
  ticker: string;
  theme: string;
  logoIdea: string;
}

const IdeaGenerator = ({ coinIdea, setCoinIdea }: { coinIdea: CoinIdea, setCoinIdea: (idea: CoinIdea) => void }) => {
  const [theme, setTheme] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState<CoinIdea | null>(coinIdea);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // Enhanced meme coin idea generator logic
  const themeVariations = {
    animal: ['frog', 'doge', 'cat', 'hamster', 'monkey', 'shark', 'whale', 'dolphin', 'penguin', 'tiger', 'lion', 'bear', 'owl', 'fox', 'wolf', 'goose', 'duck', 'sloth', 'koala', 'giraffe', 'alpaca', 'llama', 'crab', 'octopus', 'bee', 'unicorn', 'gorilla', 'ape', 'panda', 'sheep', 'goat', 'snail', 'turtle', 'parrot', 'raccoon', 'otter', 'hedgehog', 'kangaroo', 'bat', 'squirrel', 'rabbit', 'moose', 'deer', 'elephant', 'rhino', 'hippo', 'crocodile', 'lizard', 'snake', 'spider', 'ant', 'butterfly', 'dragonfly', 'starfish', 'jellyfish', 'shrimp', 'lobster', 'clam', 'snail', 'worm'],
    space: ['galaxy', 'mars', 'moon', 'stars', 'rocket', 'astronaut', 'alien', 'comet', 'nebula', 'planet', 'satellite', 'asteroid', 'blackhole', 'supernova', 'cosmos', 'spaceship', 'ufo', 'meteor', 'eclipse', 'starlight', 'gravity', 'quasar', 'pulsar', 'wormhole'],
    food: ['pizza', 'burger', 'taco', 'donut', 'cake', 'cookie', 'banana', 'apple', 'coffee', 'beer', 'sushi', 'ramen', 'burrito', 'fries', 'steak', 'cheese', 'bacon', 'waffle', 'pancake', 'cereal', 'avocado', 'grape', 'lemon', 'lime', 'orange', 'peach', 'pear', 'plum', 'berry', 'mango', 'kiwi', 'pineapple', 'coconut', 'cherry', 'carrot', 'broccoli', 'corn', 'egg', 'shrimp', 'lobster'],
    object: ['diamond', 'crown', 'sword', 'shield', 'key', 'lamp', 'chair', 'phone', 'car', 'house', 'robot', 'computer', 'tv', 'camera', 'drone', 'watch', 'ring', 'coin', 'safe', 'vault', 'rocket', 'ship', 'boat', 'train', 'plane', 'bike', 'skateboard', 'scooter', 'ball', 'bat', 'glove', 'helmet', 'mask', 'cape', 'wand', 'book', 'scroll', 'map', 'flag', 'trophy', 'medal', 'star', 'cloud', 'rainbow', 'umbrella', 'hat', 'shoe', 'sock', 'glasses', 'bag', 'wallet', 'purse', 'belt', 'tie', 'scarf', 'jacket', 'coat', 'shirt', 'pants', 'shorts', 'dress', 'skirt', 'suit', 'armor', 'shield', 'gauntlet', 'boot', 'slipper', 'sandals'],
    emotion: ['happy', 'angry', 'sleepy', 'excited', 'confused', 'surprised', 'cool', 'silly', 'brave', 'chill', 'greedy', 'fearless', 'lucky', 'zen', 'wild', 'crazy', 'funny', 'serious', 'mysterious', 'hype', 'degen', 'legend', 'epic', 'hero', 'villain', 'dreamy', 'moody', 'spooky', 'sassy', 'bossy', 'witty', 'quirky', 'loyal', 'bold', 'shy', 'proud', 'humble', 'grumpy', 'cheerful', 'optimistic', 'pessimistic', 'hopeful', 'determined', 'ambitious', 'lazy', 'energetic', 'focused', 'relaxed', 'stressed', 'calm', 'nervous', 'confident', 'inspired', 'creative', 'innovative', 'classic', 'retro', 'futuristic']
  };

  const prefixes = ['Pulse', 'Chain', 'Mega', 'Super', 'Ultra', 'Crypto', 'Degen', 'Moon', 'Rocket', 'Turbo', 'Space', 'Meta', 'Meme', 'Pepe', 'Shiba', 'Astro', 'Cosmo', 'Fomo', 'Hype', 'Wen', 'Pump', 'Dump', 'Laser', 'Diamond', 'Golden', 'Lucky', 'Magic', 'Pixel', 'Quantum', 'Neon', 'Cyber', 'Viral', 'Funky', 'Sonic', 'Hyper', 'Flash', 'Stellar', 'Nova', 'Ape', 'Dog', 'Cat', 'Frog', 'Duck', 'Hamster', 'Whale', 'Bull', 'Bear', 'Tiger', 'Lion', 'Wolf', 'Fox', 'Owl', 'Bat', 'Dragon', 'Phoenix', 'Unicorn', 'Gorilla', 'Panda', 'Sloth', 'Koala', 'Llama', 'Alpaca', 'Crab', 'Octopus', 'Bee', 'Butterfly', 'Star', 'Cloud', 'Rainbow', 'Rocket', 'Ship', 'Boat', 'Train', 'Plane', 'Bike', 'Skate', 'Scooter', 'Ball', 'Bat', 'Glove', 'Helmet', 'Mask', 'Cape', 'Wand', 'Book', 'Scroll', 'Map', 'Flag', 'Trophy', 'Medal', 'Star', 'Cloud', 'Rainbow', 'Umbrella', 'Hat', 'Shoe', 'Sock', 'Glasses', 'Bag', 'Wallet', 'Purse', 'Belt', 'Tie', 'Scarf', 'Jacket', 'Coat', 'Shirt', 'Pants', 'Shorts', 'Dress', 'Skirt', 'Suit', 'Armor', 'Shield', 'Gauntlet', 'Boot', 'Slipper', 'Sandals'];
  const suffixes = ['Coin', 'Token', 'Pulse', 'Chain', 'X', 'Finance', 'Swap', 'Protocol', 'DAO', 'Network', 'Labs', 'Club', 'Army', 'Squad', 'Gang', 'Crew', 'Verse', 'World', 'Land', 'City', 'Ville', 'Town', 'Zone', 'Planet', 'Moon', 'Mars', 'Rocket', 'Star', 'Galaxy', 'Nebula', 'Astro', 'Cosmo', 'Fomo', 'Hype', 'Degen', 'Legend', 'Epic', 'Hero', 'Dream', 'Moon', 'Pump', 'Dump', 'Wen', 'Wagmi', 'Lambo', 'Stonks', 'Stonk', 'Staker', 'Farmer', 'Miner', 'Builder', 'Trader', 'Whale', 'Shark', 'Bull', 'Bear', 'Tiger', 'Lion', 'Wolf', 'Fox', 'Owl', 'Bat', 'Dragon', 'Phoenix', 'Unicorn', 'Gorilla', 'Panda', 'Sloth', 'Koala', 'Llama', 'Alpaca', 'Crab', 'Octopus', 'Bee', 'Butterfly', 'Star', 'Cloud', 'Rainbow', 'Rocket', 'Ship', 'Boat', 'Train', 'Plane', 'Bike', 'Skate', 'Scooter', 'Ball', 'Bat', 'Glove', 'Helmet', 'Mask', 'Cape', 'Wand', 'Book', 'Scroll', 'Map', 'Flag', 'Trophy', 'Medal', 'Star', 'Cloud', 'Rainbow', 'Umbrella', 'Hat', 'Shoe', 'Sock', 'Glasses', 'Bag', 'Wallet', 'Purse', 'Belt', 'Tie', 'Scarf', 'Jacket', 'Coat', 'Shirt', 'Pants', 'Shorts', 'Dress', 'Skirt', 'Suit', 'Armor', 'Shield', 'Gauntlet', 'Boot', 'Slipper', 'Sandals'];

  function getThemeCategory(input: string) {
    const lower = input.toLowerCase();
    for (const [cat, arr] of Object.entries(themeVariations)) {
      if (arr.some(word => lower.includes(word))) return cat;
    }
    // Fallback: guess by keyword
    if (/dog|shiba|inu|doge|puppy/.test(lower)) return 'animal';
    if (/moon|star|galaxy|astro|space|planet|rocket|alien/.test(lower)) return 'space';
    if (/pizza|burger|taco|food|snack|cake|cookie|banana|apple|beer|sushi|ramen/.test(lower)) return 'food';
    if (/diamond|crown|sword|shield|object|item|thing|robot|car|phone|computer/.test(lower)) return 'object';
    if (/happy|angry|sleepy|excited|emotion|mood|vibe|hype|degen|legend/.test(lower)) return 'emotion';
    return null;
  }

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function randomFrom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const generateIdea = (inputTheme?: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      let selectedTheme = inputTheme || theme;
      let category = getThemeCategory(selectedTheme);
      let baseWord = selectedTheme;
      if (!category) {
        // Try to match to a category or pick random
        const cats = Object.keys(themeVariations);
        category = randomFrom(cats);
        baseWord = randomFrom(themeVariations[category]);
      } else {
        // If user input matches a word in the category, use it, else pick random from that category
        const arr = themeVariations[category];
        baseWord = arr.find(word => selectedTheme.toLowerCase().includes(word)) || randomFrom(arr);
      }
      // Build name
      const prefix = randomFrom(prefixes);
      const suffix = randomFrom(suffixes);
      const capitalizedTheme = capitalize(baseWord);
      // More randomization: sometimes double prefix, sometimes double suffix, sometimes both
      let coinName = '';
      const roll = Math.random();
      if (roll < 0.2) {
        coinName = `${prefix}${capitalizedTheme}${suffix}`;
      } else if (roll < 0.4) {
        coinName = `${prefix}${capitalize(randomFrom(prefixes))}${capitalizedTheme}`;
      } else if (roll < 0.6) {
        coinName = `${capitalizedTheme}${capitalize(randomFrom(suffixes))}${suffix}`;
      } else if (roll < 0.8) {
        coinName = `${prefix}${capitalizedTheme}`;
      } else {
        coinName = `${capitalizedTheme}${suffix}`;
      }
      // Ticker: 3-5 uppercase letters from name, sometimes with a number
      let ticker = coinName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, Math.floor(3 + Math.random()*3));
      if (Math.random() > 0.7) ticker += Math.floor(Math.random()*100);
      ticker = `$${ticker}`;
      // Logo idea
      const logoIdeas = [
        `A cartoon ${baseWord} with a ${randomFrom(['PulseChain', 'crypto', 'meme', 'futuristic', 'retro', 'pixel', 'neon', 'cyber', 'rainbow', 'golden', 'diamond', 'laser', 'space', 'galaxy', 'blockchain'])} theme`,
        `A ${baseWord} riding a rocket to the moon`,
        `A ${baseWord} with laser eyes and a crown`,
        `A ${baseWord} surfing on blockchain waves`,
        `A ${baseWord} astronaut floating in space`,
        `A geometric ${baseWord} with gradient purple-to-orange colors`,
        `A ${baseWord} with meme sunglasses and a gold chain`,
        `A ${baseWord} in a retro 80s synthwave style`,
        `A ${baseWord} with a holographic effect`,
        `A ${baseWord} made of pixel art`,
        `A ${baseWord} with a rainbow aura`,
        `A ${baseWord} holding a bag of coins`,
        `A ${baseWord} with a rocket backpack`,
        `A ${baseWord} in a superhero costume`,
        `A ${baseWord} with a DAO flag`,
        `A ${baseWord} with a burning fuse`,
        `A ${baseWord} with a diamond background`,
        `A ${baseWord} with a stonks arrow`,
        `A ${baseWord} with a meme face overlay`,
        `A ${baseWord} with a party hat and confetti`,
        `A ${baseWord} with a blockchain QR code`,
        `A ${baseWord} with a futuristic visor`,
        `A ${baseWord} with a moon in the background`,
        `A ${baseWord} with a pile of gold coins`,
        `A ${baseWord} with a meme frog friend`,
        `A ${baseWord} with a Pepe face`,
        `A ${baseWord} with a Shiba Inu friend`,
        `A ${baseWord} with a pixel crown`,
        `A ${baseWord} with a hologram effect`,
        `A ${baseWord} with a rainbow trail`,
        `A ${baseWord} with a blockchain circuit pattern`,
        `A ${baseWord} with a meme rocket`,
        `A ${baseWord} with a laser sword`,
        `A ${baseWord} with a meme coin logo`,
        `A ${baseWord} with a DAO logo`,
        `A ${baseWord} with a meme face and sunglasses`,
        `A ${baseWord} with a meme face and a gold chain`,
        `A ${baseWord} with a meme face and a crown`,
        `A ${baseWord} with a meme face and a rocket`,
        `A ${baseWord} with a meme face and a moon`,
        `A ${baseWord} with a meme face and a diamond`,
        `A ${baseWord} with a meme face and a stonks arrow`,
        `A ${baseWord} with a meme face and a party hat`,
        `A ${baseWord} with a meme face and a blockchain QR code`,
        `A ${baseWord} with a meme face and a futuristic visor`,
        `A ${baseWord} with a meme face and a moon in the background`,
        `A ${baseWord} with a meme face and a pile of gold coins`,
        `A ${baseWord} with a meme face and a meme frog friend`,
        `A ${baseWord} with a meme face and a Pepe face`,
        `A ${baseWord} with a meme face and a Shiba Inu friend`,
        `A ${baseWord} with a meme face and a pixel crown`,
        `A ${baseWord} with a meme face and a hologram effect`,
        `A ${baseWord} with a meme face and a rainbow trail`,
        `A ${baseWord} with a meme face and a blockchain circuit pattern`,
        `A ${baseWord} with a meme face and a meme rocket`,
        `A ${baseWord} with a meme face and a laser sword`,
        `A ${baseWord} with a meme face and a meme coin logo`,
        `A ${baseWord} with a meme face and a DAO logo`,
      ];
      const logoIdea = randomFrom(logoIdeas);
      // Theme summary
      const themeSummary = `A ${baseWord}-themed meme coin with ${randomFrom(['community vibes', 'degen energy', 'moon potential', 'viral meme power', 'PulseChain speed', 'diamond hands', 'fun and utility', 'unstoppable hype', 'legendary status', 'epic memes', 'crypto culture', 'web3 innovation', 'meme magic', 'pumpamentals', 'hodl spirit', 'fomo energy', 'meme synergy', 'blockchain tech', 'deflationary mechanics', 'airdrops', 'staking', 'DAO governance', 'NFT integration', 'liquidity farming', 'token burns', 'reflection rewards', 'community voting', 'airdrops', 'staking', 'NFTs', 'airdrops', 'airdrops'])}.`;
      const newIdea = {
        name: coinName,
        ticker: ticker,
        theme: themeSummary,
        logoIdea: logoIdea
      };
      setGeneratedIdea(newIdea);
      setIsGenerating(false);
      setShowConfetti(true);
      setCoinIdea(newIdea); // sync with parent
      localStorage.setItem('lastGeneratedIdea', JSON.stringify(newIdea));
      setTimeout(() => setShowConfetti(false), 3000);
      toast({
        title: "Meme Coin Idea Generated! 🎉",
        description: `Generated ${newIdea.name} (${newIdea.ticker})`,
      });
    }, 1500);
  };

  const copyAllDetails = () => {
    if (!generatedIdea) return;
    
    const details = `🚀 MEME COIN IDEA 🚀

💎 Name: ${generatedIdea.name}
🎯 Ticker: ${generatedIdea.ticker}
📝 Theme: ${generatedIdea.theme}
🎨 Logo Idea: ${generatedIdea.logoIdea}

Generated by MemePulse - Your PulseChain Meme Coin Generator`;

    navigator.clipboard.writeText(details);
    toast({
      title: "Copied to Clipboard! 📋",
      description: "All coin details have been copied.",
    });
  };

  const saveIdea = () => {
    if (!generatedIdea) return;
    
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
    savedIdeas.push({ ...generatedIdea, timestamp: new Date().toISOString() });
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
    
    toast({
      title: "Idea Saved! 💾",
      description: "Your meme coin idea has been saved locally.",
    });
  };

  return (
    <section id="generator" className="relative py-16 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-[60vh] backdrop-blur-3xl">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={120} />
      )}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            💡 Meme Coin Idea Generator
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Enter a theme or keyword and let AI generate your next viral PulseChain meme coin idea!
          </p>
        </div>
        <Card className="bg-black/40 border-2 border-purple-500/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-center">Generate Your Meme Coin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter a theme/keyword (e.g., frog, toaster, galaxy)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="flex-1 bg-black/50 border-purple-500/20 text-white placeholder-gray-400"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => generateIdea()}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple transition-all duration-300 px-8"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Idea!
                    </div>
                  )}
                </Button>
                <Button
                  onClick={() => generateIdea('')}
                  variant="outline"
                  className="border-purple-500/20 hover:bg-purple-900/20"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {generatedIdea && (
              <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-orange-900/20 rounded-lg border border-purple-500/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-pulse-orange mb-2">
                        🪙 Coin Name
                      </h3>
                      <p className="text-2xl font-bold text-white">{generatedIdea.name}</p>
                    </div>
                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-pulse-orange mb-2">
                        🎯 Ticker Symbol
                      </h3>
                      <p className="text-2xl font-bold text-green-400">{generatedIdea.ticker}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-pulse-orange mb-2">
                        📝 Theme Summary
                      </h3>
                      <p className="text-gray-300">{generatedIdea.theme}</p>
                    </div>
                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-pulse-orange mb-2">
                        🎨 Logo Idea
                      </h3>
                      <p className="text-gray-300">{generatedIdea.logoIdea}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-600">
                  <Button
                    onClick={copyAllDetails}
                    variant="outline"
                    className="flex items-center gap-2 border-purple-500/20 hover:bg-purple-900/20"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Details
                  </Button>
                  <Button
                    onClick={saveIdea}
                    variant="outline"
                    className="flex items-center gap-2 border-purple-500/20 hover:bg-purple-900/20"
                  >
                    <Save className="w-4 h-4" />
                    Save Idea
                  </Button>
                </div>
              </div>
            )}
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

export default IdeaGenerator;
