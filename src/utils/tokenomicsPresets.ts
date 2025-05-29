export type TokenomicsPreset = {
  name: string;
  description: string;
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    burn: string;
    liquidity: string;
    marketing: string;
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
      burn: "0",
      liquidity: "60",
      marketing: "40"
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
      burn: "0",
      liquidity: "30",
      marketing: "70"
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
    name: "Balanced Growth",
    description: "Balanced approach with focus on sustainability",
    totalSupply: "1000000000",
    buyTax: "4",
    sellTax: "4",
    taxAllocation: {
      burn: "0",
      liquidity: "50",
      marketing: "50"
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
      burn: "0",
      liquidity: "50",
      marketing: "50"
    },
    supplyAllocation: {
      pulsex: "55",
      airdrop: "10",
      dev: "5",
      marketing: "10",
      burn: "20"
    }
  },
  {
    name: "No Tax (Standard PRC20)",
    description: "A standard PRC20 token with zero buy/sell tax and no auto-distribution.",
    totalSupply: "1000000000",
    buyTax: "0",
    sellTax: "0",
    taxAllocation: {
      burn: "0",
      liquidity: "0",
      marketing: "0"
    },
    supplyAllocation: {
      pulsex: "100",
      airdrop: "0",
      dev: "0",
      marketing: "0",
      burn: "0"
    }
  }
];
