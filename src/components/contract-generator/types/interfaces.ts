// Type definitions for the Contract Generator
export interface TokenomicsData {
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    liquidity: string;
    marketing: string;
    burn: string;
  };
  supplyAllocation: {
    pulsex: string;
    airdrop: string;
    dev: string;
    marketing: string;
    burn: string;
  };
}

export interface SecurityFeatures {
  antiWhale: boolean;
  blacklist: boolean;
  pausable: boolean;
  reflection: boolean;
  burnable: boolean;
  mintable: boolean;
  snapshot: boolean;
  voting: boolean;
  deflationary: boolean;
  rewardToken: boolean;
}

export interface TaxSettings {
  buyTax: number;
  sellTax: number;
  transferTax: number;
  maxTax: number;
  liquidityShare: number;
  marketingShare: number;
  devShare: number;
  burnShare: number;
  reflectionShare: number;
  charityShare: number;
}

export interface WalletSettings {
  marketingWallet: string;
  devWallet: string;
  autoLiquidityWallet: string;
  charityWallet: string;
  treasuryWallet: string;
}

export interface LimitSettings {
  maxTxPercent: number;
  maxWalletPercent: number;
  maxSellPercent: number;
  tradingCooldown: number;
  launchProtection: boolean;
  antiSnipe: boolean;
  antiBotEnabled: boolean;
}

export interface ContractType {
  id: string;
  name: string;
  description: string;
  icon: any;
  features: string[];
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  gasEstimate: string;
}

export interface ContractSettings {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: number;
  contractType: string;
  networkId: number;
  securityFeatures: SecurityFeatures;
  taxSettings: TaxSettings;
  walletSettings: WalletSettings;
  limitSettings: LimitSettings;
  routerAddress: string;
  autoLiquidity: boolean;
  liquidityLockDays: number;
}

export interface Network {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  routerAddress: string;
  factoryAddress: string;
  wethAddress: string;
  logoUrl?: string;
}

export interface ContractCodeGeneratorProps {
  tokenomics?: TokenomicsData;
  coinIdea?: any;
}
