import { ContractType, Network } from './interfaces';
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  RefreshCw, 
  Users, 
  Settings, 
  Star 
} from 'lucide-react';

export const CONTRACT_TYPES: ContractType[] = [
  {
    id: 'standard',
    name: 'Standard PRC20',
    description: 'Basic token with essential features',
    icon: Zap,
    features: ['ERC20 Compliant', 'Owner Functions', 'Basic Security'],
    complexity: 'Basic',
    gasEstimate: '~2M gas'
  },
  {
    id: 'tax',
    name: 'Tax Token',
    description: 'Token with customizable buy/sell taxes',
    icon: DollarSign,
    features: ['Buy/Sell Taxes', 'Auto Liquidity', 'Fee Distribution', 'Wallet Management'],
    complexity: 'Intermediate',
    gasEstimate: '~3.5M gas'
  },
  {
    id: 'reflection',
    name: 'Reflection Token',
    description: 'Holders earn passive rewards',
    icon: TrendingUp,
    features: ['Holder Rewards', 'Auto Distribution', 'Reflection Mechanism', 'Dividend Tracker'],
    complexity: 'Advanced',
    gasEstimate: '~4.5M gas'
  },
  {
    id: 'deflationary',
    name: 'Deflationary Token',
    description: 'Burns tokens on transactions',
    icon: Flame,
    features: ['Auto Burn', 'Supply Reduction', 'Burn Events', 'Deflationary Mechanics'],
    complexity: 'Intermediate',
    gasEstimate: '~3M gas'
  },
  {
    id: 'liquidity-gen',
    name: 'Liquidity Generator',
    description: 'Automatically generates liquidity',
    icon: RefreshCw,
    features: ['Auto LP Generation', 'Liquidity Lock', 'LP Rewards', 'Price Stability'],
    complexity: 'Advanced',
    gasEstimate: '~4M gas'
  },
  {
    id: 'governance',
    name: 'Governance Token',
    description: 'DAO voting and governance features',
    icon: Users,
    features: ['Voting Rights', 'Proposal System', 'DAO Functions', 'Snapshot Integration'],
    complexity: 'Expert',
    gasEstimate: '~5M gas'
  },
  {
    id: 'utility',
    name: 'Utility Token',
    description: 'Advanced features for dApps',
    icon: Settings,
    features: ['Staking', 'Rewards System', 'Multi-Use Cases', 'Integration Ready'],
    complexity: 'Advanced',
    gasEstimate: '~4.2M gas'
  },
  {
    id: 'meme-advanced',
    name: 'Advanced Meme Token',
    description: 'All features for maximum customization',
    icon: Star,
    features: ['All Features', 'Anti-Bot', 'Launch Protection', 'Maximum Customization'],
    complexity: 'Expert',
    gasEstimate: '~5.5M gas'
  }
];

export const NETWORK_OPTIONS: Network[] = [
  { 
    id: 369, 
    name: 'PulseChain Mainnet', 
    symbol: 'PLS', 
    rpcUrl: 'https://rpc.pulsechain.com',
    blockExplorer: 'https://scan.pulsechain.com',
    routerAddress: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
    factoryAddress: '0x1715a3E4A142d8b698131108995174F37aEBA10D',
    wethAddress: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27'
  },
  { 
    id: 943, 
    name: 'PulseChain Testnet', 
    symbol: 'tPLS', 
    rpcUrl: 'https://rpc.v4.testnet.pulsechain.com',
    blockExplorer: 'https://scan.v4.testnet.pulsechain.com',
    routerAddress: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
    factoryAddress: '0x1715a3E4A142d8b698131108995174F37aEBA10D',
    wethAddress: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27'
  },
  { 
    id: 1, 
    name: 'Ethereum Mainnet', 
    symbol: 'ETH', 
    rpcUrl: 'https://ethereum.publicnode.com',
    blockExplorer: 'https://etherscan.io',
    routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  { 
    id: 56, 
    name: 'BSC Mainnet', 
    symbol: 'BNB', 
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    wethAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  { 
    id: 137, 
    name: 'Polygon', 
    symbol: 'MATIC', 
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    routerAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    factoryAddress: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    wethAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  }
];

export const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    antiWhale: "Limit maximum transaction and wallet amounts to prevent whale manipulation",
    blacklist: "Block malicious addresses from trading your token",
    pausable: "Emergency pause functionality for trading in critical situations",
    reflection: "Automatic rewards distribution to token holders based on holdings",
    burnable: "Enable token burning mechanism to reduce total supply",
    mintable: "Allow owner to mint new tokens (use carefully for tokenomics)",
    snapshot: "Take snapshots for airdrops and governance voting",
    voting: "Enable on-chain voting for DAO governance and proposals",
    deflationary: "Automatic token burn on each transaction to reduce supply",
    rewardToken: "Distribute rewards in different tokens to holders"
  };
  return descriptions[feature] || "";
};

export const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'Basic': return 'bg-green-100 text-green-800 border-green-300';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
