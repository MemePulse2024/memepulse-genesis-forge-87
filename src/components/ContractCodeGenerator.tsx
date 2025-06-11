import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings, Code, Shield, Copy, Download, Zap, DollarSign, Users, Lock, AlertTriangle, TrendingUp, Wallet, Bot, Timer, Flame, RefreshCw, Eye, Target, Sliders, ChevronRight, Star, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import ParticleBackground from "./ParticleBackground";
import ResourcesSection from "./ResourcesSection";
import { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Confetti from 'react-confetti';

interface TokenomicsData {
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

interface ContractCodeGeneratorProps {
  tokenomics?: TokenomicsData;
  coinIdea?: any;
}

interface SecurityFeatures {
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

interface TaxSettings {
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

interface WalletSettings {
  marketingWallet: string;
  devWallet: string;
  autoLiquidityWallet: string;
  charityWallet: string;
  treasuryWallet: string;
}

interface LimitSettings {
  maxTxPercent: number;
  maxWalletPercent: number;
  maxSellPercent: number;
  tradingCooldown: number;
  launchProtection: boolean;
  antiSnipe: boolean;
  antiBotEnabled: boolean;
}

interface ContractType {
  id: string;
  name: string;
  description: string;
  icon: any;
  features: string[];
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  gasEstimate: string;
}

interface ContractSettings {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: number;
  securityFeatures: SecurityFeatures;
  taxSettings: TaxSettings;
  walletSettings: WalletSettings;
  limitSettings: LimitSettings;
  routerAddress: string;
  autoLiquidity: boolean;
  liquidityLockDays: number;
}

const CONTRACT_TYPES: ContractType[] = [
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

const NETWORK_OPTIONS = [
  { id: 369, name: 'PulseChain Mainnet', symbol: 'PLS', router: '0x165C3410fC91EF562C50559f7d2289fEbed552d9' },
  { id: 943, name: 'PulseChain Testnet', symbol: 'tPLS', router: '0x165C3410fC91EF562C50559f7d2289fEbed552d9' },
  { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH', router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
  { id: 56, name: 'BSC Mainnet', symbol: 'BNB', router: '0x10ED43C718714eb63d5aA57B78B54704E256024E' },
  { id: 137, name: 'Polygon', symbol: 'MATIC', router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff' }
];

const getFeatureDescription = (feature: string): string => {
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
    rewardToken: "Distribute rewards in different tokens to holders",
    maxTxPercent: "Maximum tokens per transaction (% of total supply)",
    maxWalletPercent: "Maximum tokens per wallet (% of total supply)",
    tradingCooldown: "Cooldown period between trades (measured in seconds; PulseChain average block time is ~2 seconds)",
    liquidityLockTime: "Time to lock initial liquidity in days"
  };
  return descriptions[feature] || "";
};

const generateContractCode = (settings: ContractSettings): string => {
  const imports = [
    'pragma solidity ^0.8.19;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
    'import "@openzeppelin/contracts/security/Pausable.sol";',
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    settings.securityFeatures.burnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : '',
    settings.securityFeatures.mintable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Mintable.sol";' : '',
    settings.securityFeatures.reflection ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";' : '',
  ].filter(Boolean).join('\n');

  const contractName = settings.tokenName.replace(/\s+/g, '');
  const inheritance = [
    'ERC20',
    'Pausable',
    'Ownable',
    settings.securityFeatures.burnable ? 'ERC20Burnable' : '',
    settings.securityFeatures.mintable ? 'ERC20Mintable' : '',
    settings.securityFeatures.reflection ? 'ERC20Votes' : ''
  ].filter(Boolean).join(', ');

  // Variables for all settings
  const variables = `
    // Tax settings
    uint256 public buyTax = ${settings.taxSettings.buyTax};
    uint256 public sellTax = ${settings.taxSettings.sellTax};
    uint256 public transferTax = ${settings.taxSettings.transferTax};
    uint256 public liquidityShare = ${settings.taxSettings.liquidityShare};
    uint256 public marketingShare = ${settings.taxSettings.marketingShare};
    uint256 public devShare = ${settings.taxSettings.devShare};
    uint256 public burnShare = ${settings.taxSettings.burnShare};
    // Wallets
    address public marketingWallet = ${settings.walletSettings.marketingWallet || 'address(0)'};
    address public devWallet = ${settings.walletSettings.devWallet || 'address(0)'};
    address public autoLiquidityWallet = ${settings.walletSettings.autoLiquidityWallet || 'address(0)'};
    address public charityWallet = ${settings.walletSettings.charityWallet || 'address(0)'};
    address public treasuryWallet = ${settings.walletSettings.treasuryWallet || 'address(0)'};
    // Limits
    uint256 public maxTxPercent = ${settings.limitSettings.maxTxPercent};
    uint256 public maxWalletPercent = ${settings.limitSettings.maxWalletPercent};
    uint256 public maxSellPercent = ${settings.limitSettings.maxSellPercent};
    uint256 public tradingCooldown = ${settings.limitSettings.tradingCooldown};
    bool public launchProtection = ${settings.limitSettings.launchProtection};
    bool public antiSnipe = ${settings.limitSettings.antiSnipe};
    bool public antiBotEnabled = ${settings.limitSettings.antiBotEnabled};
    // Misc
    bool public autoLiquidity = ${settings.autoLiquidity};
    uint256 public liquidityLockDays = ${settings.liquidityLockDays};
  `;

  // Security features logic
  const securityFeatures = [
    settings.securityFeatures.antiWhale ? `
    // Anti-whale logic
    modifier antiWhale(address from, address to, uint256 amount) {
      require(amount <= (totalSupply() * maxTxPercent) / 10000, "Exceeds max tx");
      require(balanceOf(to) + amount <= (totalSupply() * maxWalletPercent) / 10000, "Exceeds max wallet");
      _;
    }
    ` : '',
    settings.securityFeatures.blacklist ? `
    // Blacklist logic
    mapping(address => bool) private _blacklist;
    modifier notBlacklisted(address account) {
      require(!_blacklist[account], "Blacklisted");
      _;
    }
    function blacklistAddress(address account, bool value) external onlyOwner {
      _blacklist[account] = value;
    }
    function isBlacklisted(address account) public view returns (bool) {
      return _blacklist[account];
    }
    ` : '',
    settings.securityFeatures.pausable ? `
    // Pausable logic
    function pause() public onlyOwner { _pause(); }
    function unpause() public onlyOwner { _unpause(); }
    ` : '',
    settings.securityFeatures.burnable ? `
    // Burnable logic (handled by ERC20Burnable)
    ` : '',
    settings.securityFeatures.mintable ? `
    // Mintable logic (handled by ERC20Mintable)
    ` : '',
    settings.securityFeatures.reflection ? `
    // Reflection logic (handled by ERC20Votes)
    ` : '',
    settings.limitSettings.tradingCooldown > 0 ? `
    // Trading cooldown logic
    mapping(address => uint256) private _lastTrade;
    modifier cooldown(address from) {
      require(block.timestamp - _lastTrade[from] >= tradingCooldown, "Cooldown");
      _;
    }
    ` : '',
    settings.limitSettings.launchProtection ? `
    // Launch protection logic
    bool public launchProtected = true;
    function disableLaunchProtection() external onlyOwner { launchProtected = false; }
    ` : '',
    settings.limitSettings.antiSnipe ? `
    // Anti-snipe logic (placeholder)
    ` : '',
    settings.limitSettings.antiBotEnabled ? `
    // Anti-bot logic (placeholder)
    ` : '',
  ].filter(Boolean).join('\n');

  // Constructor
  const constructor = `
    constructor() ERC20(\"${settings.tokenName}\", \"${settings.tokenSymbol}\") {
        _mint(msg.sender, ${settings.totalSupply} * 10 ** decimals());
    }
  `;

  // Main contract
  return `// SPDX-License-Identifier: MIT
${imports}

/**
 * @title ${settings.tokenName}
 * @dev Generated by MemePulse Genesis Forge
 */
contract ${contractName} is ${inheritance} {
${variables}
${securityFeatures}
${constructor}
// ...additional logic for taxes, fees, and custom features should be implemented here...
}`;
};

// Tab configuration
const TABS = [
  {
    value: "settings",
    label: "Basic Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    value: "preview",
    label: "Contract Preview",
    icon: <Code className="h-4 w-4" />,
  }
];

// Contract Generator Component
export default function ContractCodeGenerator({ tokenomics, coinIdea }: ContractCodeGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [generatedContract, setGeneratedContract] = useState("");

  const [settings, setSettings] = useState<ContractSettings>({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "1000000000",
    decimals: 18,
    securityFeatures: {
      antiWhale: true,
      blacklist: true,
      pausable: true,
      reflection: false,
      burnable: true,
      mintable: false,
      snapshot: false,
      voting: false,
      deflationary: false,
      rewardToken: false
    },
    taxSettings: {
      buyTax: 5,
      sellTax: 5,
      transferTax: 0,
      maxTax: 25,
      liquidityShare: 40,
      marketingShare: 40,
      devShare: 10,
      burnShare: 10,
      reflectionShare: 0,
      charityShare: 0
    },
    walletSettings: {
      marketingWallet: "",
      devWallet: "",
      autoLiquidityWallet: "",
      charityWallet: "",
      treasuryWallet: ""
    },
    limitSettings: {
      maxTxPercent: 100,
      maxWalletPercent: 100,
      maxSellPercent: 100,
      tradingCooldown: 0,
      launchProtection: false,
      antiSnipe: false,
      antiBotEnabled: false
    },
    routerAddress: "",
    autoLiquidity: false,
    liquidityLockDays: 0
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const memeQuotes = [
    "Much wow. Very contract. So code!",
    "To the moon, but DYOR! 🚀",
    "HODL your creativity!",
    "Not financial advice, just meme magic.",
    "Deploy responsibly, meme responsibly!"
  ];
  const [quote, setQuote] = useState(memeQuotes[0]);

  // Tax settings state
  const [taxSettings, setTaxSettings] = useState({
    buy: 5,
    sell: 5,
    transfer: 0,
    liquidity: 40,
    marketing: 40,
    dev: 10,
    burn: 10
  });

  // Sync taxSettings state with settings.taxSettings (which is set by Basic Configuration)
  useEffect(() => {
    setTaxSettings({
      buy: settings.taxSettings.buyTax,
      sell: settings.taxSettings.sellTax,
      transfer: settings.taxSettings.transferTax,
      liquidity: settings.taxSettings.liquidityShare,
      marketing: settings.taxSettings.marketingShare,
      dev: settings.taxSettings.devShare,
      burn: settings.taxSettings.burnShare
    });
  }, [settings.taxSettings]);

  useEffect(() => {
    if (tokenomics) {
      setSettings(prev => ({
        ...prev,
        totalSupply: tokenomics.totalSupply,
        maxTxAmount: tokenomics.buyTax,
        maxWalletAmount: tokenomics.sellTax,
        securityFeatures: {
          ...prev.securityFeatures,
          reflection: false, // Set to false since reflection doesn't exist in taxAllocation
          burnable: tokenomics.taxAllocation.burn !== "0"
        }
      }));
    }
  }, [tokenomics]);

  const handleSettingsChange = (field: keyof ContractSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityFeatureToggle = (feature: keyof SecurityFeatures) => {
    setSettings(prev => ({
      ...prev,
      securityFeatures: {
        ...prev.securityFeatures,
        [feature]: !prev.securityFeatures[feature]
      }
    }));
  };

  // When user changes tax in the Tax Settings UI, update settings.taxSettings as well
  const handleTaxSettingsChange = (field: keyof typeof taxSettings, value: number) => {
    setTaxSettings(prev => ({ ...prev, [field]: value }));
    setSettings(prev => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        ...(field === 'buy' && { buyTax: value }),
        ...(field === 'sell' && { sellTax: value }),
        ...(field === 'transfer' && { transferTax: value }),
        ...(field === 'liquidity' && { liquidityShare: value }),
        ...(field === 'marketing' && { marketingShare: value }),
        ...(field === 'dev' && { devShare: value }),
        ...(field === 'burn' && { burnShare: value })
      }
    }));
  };

  // Randomize settings
  const handleRandomize = () => {
    setSettings(prev => ({
      ...prev,
      tokenName: `Meme${Math.floor(Math.random()*1000)}`,
      tokenSymbol: `MEME${Math.floor(Math.random()*100)}`,
      totalSupply: String(10**(6 + Math.floor(Math.random()*4))),
      decimals: 18,
    }));
    setTaxSettings({
      buy: Math.floor(Math.random()*10),
      sell: Math.floor(Math.random()*10),
      transfer: Math.floor(Math.random()*5),
      liquidity: 20+Math.floor(Math.random()*40),
      marketing: 20+Math.floor(Math.random()*40),
      dev: 5+Math.floor(Math.random()*20),
      burn: 5+Math.floor(Math.random()*20)
    });
    setQuote(memeQuotes[Math.floor(Math.random()*memeQuotes.length)]);
  };

  // Confetti on contract generation
  const handleGenerateContract = async () => {
    if (!settings.tokenName || !settings.tokenSymbol) {
      toast({
        title: "Missing Information",
        description: "Please fill in the token name and symbol.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Contract generation feedback stages
      setGeneratedContract("// Initializing contract generation...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGeneratedContract(prev => prev + "\n// Configuring token parameters...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGeneratedContract(prev => prev + "\n// Implementing security features...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const contractCode = generateContractCode(settings);
      setGeneratedContract(contractCode);
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      setQuote(memeQuotes[Math.floor(Math.random()*memeQuotes.length)]);
      
      toast({
        title: "Contract Generated",
        description: "Your smart contract has been generated successfully!",
        duration: 3000
      });
    } catch (error) {
      console.error('Contract generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedContract) return;
    
    try {
      await navigator.clipboard.writeText(generatedContract);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: "Contract code copied to clipboard",
        duration: 2000
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy contract code",
        variant: "destructive"
      });
    }
  };

  const handleDownloadContract = () => {
    if (!generatedContract || !settings.tokenName) return;
    
    try {
      const blob = new Blob([generatedContract], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${settings.tokenName.replace(/\s+/g, '')}_contract.sol`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Contract has been downloaded successfully",
        duration: 2000
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download contract code",
        variant: "destructive"
      });
    }
  };

  // Pie chart data for tax allocation
  const taxPieData = [
    { name: 'Liquidity', value: taxSettings.liquidity, color: '#a78bfa' },
    { name: 'Marketing', value: taxSettings.marketing, color: '#fbbf24' },
    { name: 'Dev', value: taxSettings.dev, color: '#34d399' },
    { name: 'Burn', value: taxSettings.burn, color: '#f87171' }
  ];

  return (
    <div className="relative py-12 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-screen backdrop-blur-3xl">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            Smart Contract Generator 🎉
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Build your meme coin contract with fun, safety, and style!
          </p>
          <div className="mt-2 text-pulse-orange font-bold animate-pulse">{quote}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Settings & Tax */}
          <div className="flex-1 space-y-6">
            <Card className="bg-black/40 border-2 border-purple-500/20 rounded-2xl shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" /> Token Settings
                </CardTitle>
                <Button size="sm" variant="outline" onClick={handleRandomize} className="border-pulse-orange/40 text-pulse-orange hover:bg-pulse-orange/10">🎲 Randomize</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tokenName">Token Name</Label>
                    <Input id="tokenName" value={settings.tokenName} onChange={e => handleSettingsChange('tokenName', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="tokenSymbol">Token Symbol</Label>
                    <Input id="tokenSymbol" value={settings.tokenSymbol} onChange={e => handleSettingsChange('tokenSymbol', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="totalSupply">Total Supply</Label>
                    <Input id="totalSupply" value={settings.totalSupply} onChange={e => handleSettingsChange('totalSupply', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="decimals">Decimals</Label>
                    <Input id="decimals" type="number" value={settings.decimals} onChange={e => handleSettingsChange('decimals', parseInt(e.target.value))} />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tax Settings */}
            <Card className="bg-black/40 border-2 border-pulse-orange/20 rounded-2xl shadow-xl">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <DollarSign className="w-5 h-5 text-pulse-orange" />
                <CardTitle>Tax Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Buy Tax (%)</Label>
                    <Input type="number" min={0} max={25} value={taxSettings.buy} onChange={e => handleTaxSettingsChange('buy', Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Sell Tax (%)</Label>
                    <Input type="number" min={0} max={25} value={taxSettings.sell} onChange={e => handleTaxSettingsChange('sell', Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Transfer Tax (%)</Label>
                    <Input type="number" min={0} max={10} value={taxSettings.transfer} onChange={e => handleTaxSettingsChange('transfer', Number(e.target.value))} />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Tax Allocation</Label>
                  <div className="flex flex-col md:flex-row gap-4 items-center mt-2">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-purple-300">Liquidity</span>
                        <Input type="number" min={0} max={100} value={taxSettings.liquidity} onChange={e => handleTaxSettingsChange('liquidity', Number(e.target.value))} className="w-20" />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-yellow-300">Marketing</span>
                        <Input type="number" min={0} max={100} value={taxSettings.marketing} onChange={e => handleTaxSettingsChange('marketing', Number(e.target.value))} className="w-20" />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-green-300">Dev</span>
                        <Input type="number" min={0} max={100} value={taxSettings.dev} onChange={e => handleTaxSettingsChange('dev', Number(e.target.value))} className="w-20" />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-red-300">Burn</span>
                        <Input type="number" min={0} max={100} value={taxSettings.burn} onChange={e => handleTaxSettingsChange('burn', Number(e.target.value))} className="w-20" />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                    </div>
                    <div className="w-full md:w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={taxPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                            {taxPieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Security Features */}
            <Card className="bg-black/40 border-2 border-red-500/20 rounded-2xl shadow-xl">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Shield className="w-5 h-5 text-red-400" />
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.securityFeatures).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div>
                        <Label className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}</Label>
                        <p className="text-xs text-gray-400">{getFeatureDescription(feature)}</p>
                      </div>
                      <Switch checked={enabled} onCheckedChange={() => handleSecurityFeatureToggle(feature as keyof SecurityFeatures)} className="data-[state=checked]:bg-red-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right: Preview & Actions */}
          <div className="flex-1 flex flex-col gap-6">
            <Card className="bg-black/40 border-2 border-green-500/20 rounded-2xl shadow-xl flex-1 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Code className="w-5 h-5 text-green-400" />
                <CardTitle>Contract Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="bg-black/60 rounded-lg p-4 font-mono text-xs md:text-sm overflow-x-auto flex-1 mb-4" style={{ minHeight: 200 }}>
                  <pre className="whitespace-pre-wrap break-words">{generatedContract || "// Your generated contract will appear here"}</pre>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button onClick={handleCopyCode} variant="outline" className="bg-purple-500/20 border-purple-500/20" disabled={!generatedContract}>
                    <Copy className="h-4 w-4 mr-2" />
                    <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                  </Button>
                  <Button onClick={handleDownloadContract} variant="outline" className="bg-green-500/20 border-green-500/20" disabled={!generatedContract}>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Download</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleGenerateContract} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg">
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Generate Smart Contract</span>
                </>
              )}
            </Button>
            {/* Tokenomics Preview */}
            <Card className="bg-black/40 border-2 border-blue-500/20 rounded-2xl shadow-xl mt-2">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <CardTitle>Tokenomics Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-1">
                <div><b>Name:</b> {settings.tokenName || '—'}</div>
                <div><b>Symbol:</b> {settings.tokenSymbol || '—'}</div>
                <div><b>Total Supply:</b> {settings.totalSupply || '—'}</div>
                <div><b>Decimals:</b> {settings.decimals || '—'}</div>
                <div><b>Buy Tax:</b> {taxSettings.buy}% | <b>Sell Tax:</b> {taxSettings.sell}% | <b>Transfer Tax:</b> {taxSettings.transfer}%</div>
                <div><b>Tax Allocation:</b> {taxSettings.liquidity}% Liquidity, {taxSettings.marketing}% Marketing, {taxSettings.dev}% Dev, {taxSettings.burn}% Burn</div>
                <div><b>Security:</b> {Object.entries(settings.securityFeatures).filter(([k,v])=>v).map(([k])=>k).join(', ') || 'None'}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
