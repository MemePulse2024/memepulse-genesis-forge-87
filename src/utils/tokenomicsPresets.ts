
export type TokenomicsPreset = {
  name: string;
  description: string;
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    liquidity: string;
    marketing: string;
    reflection: string;
  };
  supplyAllocation: {
    pulsex: string;
    airdrop: string;
    dev: string;
    marketing: string;
    burn: string;
  };
};

export const tokenomicsPresets: TokenomicsPreset[] = [
  {
    name: "Community Focused",
    description: "Emphasis on community rewards and low taxes for active trading",
    totalSupply: "1000000000",
    buyTax: "3",
    sellTax: "3",
    taxAllocation: {
      liquidity: "40",
      marketing: "30",
      reflection: "30"
    },
    supplyAllocation: {
      pulsex: "70",
      airdrop: "15",
      dev: "5",
      marketing: "5",
      burn: "5"
    }
  },
  {
    name: "Marketing Heavy",
    description: "Higher allocation for marketing to boost visibility and adoption",
    totalSupply: "1000000000",
    buyTax: "5",
    sellTax: "5",
    taxAllocation: {
      liquidity: "30",
      marketing: "60",
      reflection: "10"
    },
    supplyAllocation: {
      pulsex: "65",
      airdrop: "5",
      dev: "5",
      marketing: "20",
      burn: "5"
    }
  },
  {
    name: "Reflection Rewards",
    description: "Maximizes holder rewards through reflection mechanisms",
    totalSupply: "1000000000",
    buyTax: "7",
    sellTax: "7",
    taxAllocation: {
      liquidity: "20",
      marketing: "20",
      reflection: "60"
    },
    supplyAllocation: {
      pulsex: "60",
      airdrop: "20",
      dev: "5",
      marketing: "10",
      burn: "5"
    }
  },
  {
    name: "Deflationary",
    description: "Focus on token burning to create scarcity over time",
    totalSupply: "1000000000",
    buyTax: "6",
    sellTax: "6",
    taxAllocation: {
      liquidity: "30",
      marketing: "30",
      reflection: "40"
    },
    supplyAllocation: {
      pulsex: "55",
      airdrop: "10",
      dev: "5",
      marketing: "10",
      burn: "20"
    }
  }
];
