
export interface TrendingTheme {
  name: string;
  category: 'viral' | 'seasonal' | 'tech' | 'culture' | 'finance';
  popularity: number;
  description: string;
  examples: string[];
}

export const getTrendingThemes = (): TrendingTheme[] => {
  return [
    {
      name: 'AI & Robotics',
      category: 'tech',
      popularity: 95,
      description: 'Artificial intelligence and robot-themed tokens',
      examples: ['robo', 'ai', 'bot', 'neural', 'cyber', 'android']
    },
    {
      name: 'Pepe Variants',
      category: 'viral',
      popularity: 92,
      description: 'Different variations of the classic Pepe meme',
      examples: ['pepe', 'frog', 'rare', 'kek', 'feels', 'wojak']
    },
    {
      name: 'Space & Mars',
      category: 'tech',
      popularity: 88,
      description: 'Space exploration and Mars colonization themes',
      examples: ['mars', 'rocket', 'space', 'astronaut', 'galaxy', 'saturn']
    },
    {
      name: 'Food Memes',
      category: 'culture',
      popularity: 85,
      description: 'Popular food items turned into memes',
      examples: ['pizza', 'burger', 'taco', 'donut', 'coffee', 'bacon']
    },
    {
      name: 'Gaming Culture',
      category: 'culture',
      popularity: 82,
      description: 'Gaming-inspired meme tokens',
      examples: ['game', 'pixel', 'quest', 'boss', 'loot', 'ninja']
    },
    {
      name: 'Seasonal Trends',
      category: 'seasonal',
      popularity: 78,
      description: 'Holiday and seasonal themed tokens',
      examples: ['summer', 'winter', 'christmas', 'halloween', 'valentine', 'spring']
    },
    {
      name: 'Animal Kingdom',
      category: 'viral',
      popularity: 90,
      description: 'Various animals with meme potential',
      examples: ['dog', 'cat', 'hamster', 'monkey', 'tiger', 'whale']
    },
    {
      name: 'DeFi Parody',
      category: 'finance',
      popularity: 76,
      description: 'Parodies of DeFi protocols and concepts',
      examples: ['yield', 'farm', 'pool', 'stake', 'vault', 'bridge']
    },
    {
      name: 'Internet Culture',
      category: 'viral',
      popularity: 87,
      description: 'Internet memes and viral content',
      examples: ['meme', 'viral', 'trend', 'chad', 'sigma', 'based']
    },
    {
      name: 'Retro Gaming',
      category: 'culture',
      popularity: 73,
      description: 'Nostalgic gaming references',
      examples: ['pixel', 'arcade', 'retro', 'classic', '8bit', 'mario']
    }
  ];
};

export const getRandomTrendingTheme = (): string => {
  const themes = getTrendingThemes();
  const weightedThemes: string[] = [];
  
  themes.forEach(theme => {
    const weight = Math.floor(theme.popularity / 10);
    for (let i = 0; i < weight; i++) {
      weightedThemes.push(...theme.examples);
    }
  });
  
  return weightedThemes[Math.floor(Math.random() * weightedThemes.length)];
};

export const getThemesByCategory = (category: string): TrendingTheme[] => {
  return getTrendingThemes().filter(theme => theme.category === category);
};
