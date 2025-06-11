
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
    tradingCooldown: "Cooldown period between trades in seconds",
    liquidityLockTime: "Time to lock initial liquidity in days"
  };
  return descriptions[feature] || "";
};

const generateContractCode = (settings: ContractSettings): string => {
  const contractName = settings.tokenName.replace(/\s+/g, '');
  const network = NETWORK_OPTIONS.find(n => n.id === settings.networkId);
  const contractTypeInfo = CONTRACT_TYPES.find(t => t.id === settings.contractType);
  
  // Determine imports based on features
  const imports = [
    '// SPDX-License-Identifier: MIT',
    'pragma solidity ^0.8.20;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";'
  ];

  if (settings.securityFeatures.burnable || settings.contractType === 'deflationary') {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";');
  }
  
  if (settings.securityFeatures.pausable) {
    imports.push('import "@openzeppelin/contracts/utils/Pausable.sol";');
  }
  
  if (settings.securityFeatures.mintable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";');
  }
  
  if (settings.securityFeatures.snapshot) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";');
  }
  
  if (settings.securityFeatures.voting) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";');
  }

  imports.push(
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    'import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";'
  );

  // Build inheritance chain
  const inheritance = ['ERC20'];
  if (settings.securityFeatures.burnable || settings.contractType === 'deflationary') inheritance.push('ERC20Burnable');
  if (settings.securityFeatures.pausable) inheritance.push('Pausable');
  if (settings.securityFeatures.snapshot) inheritance.push('ERC20Snapshot');
  if (settings.securityFeatures.voting) inheritance.push('ERC20Votes');
  inheritance.push('Ownable', 'ReentrancyGuard');

  const contractCode = `${imports.join('\n')}

/**
 * @title ${contractName}
 * @dev ${contractTypeInfo?.description || 'Custom token contract'}
 * @notice Generated by PulseChain Genesis Forge
 * @author PulseChain Genesis Forge (https://memepulse.io)
 * 
 * Features:
${contractTypeInfo?.features.map(f => ` * - ${f}`).join('\n') || ''}
 * 
 * Network: ${network?.name || 'Custom Network'}
 * Total Supply: ${settings.totalSupply} ${settings.tokenSymbol}
 * Decimals: ${settings.decimals}
 * Gas Estimate: ${contractTypeInfo?.gasEstimate || '~3M gas'}
 */
contract ${contractName} is ${inheritance.join(', ')} {
    
    // Constants
    uint256 private constant MAX_SUPPLY = ${settings.totalSupply} * 10**${settings.decimals};
    uint256 private constant MAX_TAX = ${settings.taxSettings.maxTax}; // Maximum tax percentage
    
    // Token Configuration
    bool public tradingEnabled;
    bool public limitsInEffect = true;
    bool public swapEnabled = ${settings.autoLiquidity};
    
    ${(settings.contractType === 'tax' || settings.contractType === 'meme-advanced') ? `
    // Tax Configuration
    uint256 public buyTax = ${settings.taxSettings.buyTax};
    uint256 public sellTax = ${settings.taxSettings.sellTax};
    uint256 public transferTax = ${settings.taxSettings.transferTax};
    
    // Tax Distribution Shares (must total 100%)
    uint256 public liquidityShare = ${settings.taxSettings.liquidityShare};
    uint256 public marketingShare = ${settings.taxSettings.marketingShare};
    uint256 public devShare = ${settings.taxSettings.devShare};
    uint256 public burnShare = ${settings.taxSettings.burnShare};
    ${settings.securityFeatures.reflection ? `uint256 public reflectionShare = ${settings.taxSettings.reflectionShare};` : ''}
    uint256 public charityShare = ${settings.taxSettings.charityShare};` : ''}
    
    ${(settings.limitSettings.maxTxPercent > 0 || settings.limitSettings.maxWalletPercent > 0) ? `
    // Trading Limits
    uint256 public maxTxAmount = (MAX_SUPPLY * ${settings.limitSettings.maxTxPercent}) / 100;
    uint256 public maxWalletAmount = (MAX_SUPPLY * ${settings.limitSettings.maxWalletPercent}) / 100;
    uint256 public maxSellAmount = (MAX_SUPPLY * ${settings.limitSettings.maxSellPercent}) / 100;` : ''}
    
    // Wallets
    address public marketingWallet;
    address public devWallet;
    address public autoLiquidityWallet;
    ${settings.walletSettings.charityWallet ? 'address public charityWallet;' : ''}
    ${settings.walletSettings.treasuryWallet ? 'address public treasuryWallet;' : ''}
    
    ${settings.autoLiquidity ? `
    // DEX Configuration
    address public immutable dexRouter = ${settings.routerAddress || network?.router || '0x165C3410fC91EF562C50559f7d2289fEbed552d9'}; // DEX Router
    address public dexPair;
    uint256 public swapTokensAtAmount = (MAX_SUPPLY * 5) / 10000; // 0.05%
    bool private swapping;` : ''}
    
    // Security Mappings
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromLimits;
    ${settings.securityFeatures.blacklist ? 'mapping(address => bool) private _blacklist;' : ''}
    ${settings.limitSettings.tradingCooldown > 0 ? 'mapping(address => uint256) private _lastTransfer;' : ''}
    ${settings.securityFeatures.reflection ? 'mapping(address => bool) private _isExcludedFromReflection;' : ''}
    
    ${settings.limitSettings.launchProtection ? `
    // Launch Protection
    uint256 public launchTime;
    uint256 public launchProtectionDuration = 300; // 5 minutes
    mapping(address => bool) private _isBot;` : ''}
    
    // Events
    event TradingEnabled(uint256 timestamp);
    event LimitsRemoved(uint256 timestamp);
    ${(settings.contractType === 'tax' || settings.contractType === 'meme-advanced') ? 'event TaxesUpdated(uint256 buyTax, uint256 sellTax, uint256 transferTax);' : ''}
    event WalletUpdated(string walletType, address oldWallet, address newWallet);
    event ExcludedFromFees(address indexed account, bool isExcluded);
    event ExcludedFromLimits(address indexed account, bool isExcluded);
    ${settings.securityFeatures.blacklist ? 'event AddressBlacklisted(address indexed account, bool isBlacklisted);' : ''}
    ${settings.autoLiquidity ? 'event SwapAndLiquify(uint256 tokensSwapped, uint256 ethReceived, uint256 tokensIntoLiquidity);' : ''}
    ${settings.securityFeatures.reflection ? 'event ReflectionDistributed(uint256 amount);' : ''}
    
    // Modifiers
    ${settings.securityFeatures.blacklist ? `
    modifier notBlacklisted(address account) {
        require(!_blacklist[account], "Address is blacklisted");
        _;
    }` : ''}
    
    modifier validAddress(address account) {
        require(account != address(0), "Invalid address");
        _;
    }
    
    ${settings.autoLiquidity ? `
    modifier lockTheSwap {
        swapping = true;
        _;
        swapping = false;
    }` : ''}
    
    constructor() ERC20("${settings.tokenName}", "${settings.tokenSymbol}") Ownable(_msgSender()) {
        
        // Mint total supply to deployer
        _mint(_msgSender(), MAX_SUPPLY);
        
        // Exclude essential addresses from fees and limits
        _isExcludedFromFees[_msgSender()] = true;
        _isExcludedFromFees[address(this)] = true;
        
        _isExcludedFromLimits[_msgSender()] = true;
        _isExcludedFromLimits[address(this)] = true;
        
        emit Transfer(address(0), _msgSender(), MAX_SUPPLY);
    }
    
    // Owner Functions
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        ${settings.limitSettings.launchProtection ? 'launchTime = block.timestamp;' : ''}
        emit TradingEnabled(block.timestamp);
    }
    
    function removeLimits() external onlyOwner {
        limitsInEffect = false;
        emit LimitsRemoved(block.timestamp);
    }
    
    ${(settings.contractType === 'tax' || settings.contractType === 'meme-advanced') ? `
    function updateTaxes(
        uint256 _buyTax,
        uint256 _sellTax,
        uint256 _transferTax
    ) external onlyOwner {
        require(_buyTax <= MAX_TAX && _sellTax <= MAX_TAX && _transferTax <= MAX_TAX, "Tax exceeds maximum");
        buyTax = _buyTax;
        sellTax = _sellTax;
        transferTax = _transferTax;
        emit TaxesUpdated(_buyTax, _sellTax, _transferTax);
    }` : ''}
    
    function updateWallet(string memory walletType, address newWallet) external onlyOwner validAddress(newWallet) {
        address oldWallet;
        
        if (keccak256(bytes(walletType)) == keccak256(bytes("marketing"))) {
            oldWallet = marketingWallet;
            marketingWallet = newWallet;
        } else if (keccak256(bytes(walletType)) == keccak256(bytes("dev"))) {
            oldWallet = devWallet;
            devWallet = newWallet;
        } else if (keccak256(bytes(walletType)) == keccak256(bytes("liquidity"))) {
            oldWallet = autoLiquidityWallet;
            autoLiquidityWallet = newWallet;
        } else {
            revert("Invalid wallet type");
        }
        
        emit WalletUpdated(walletType, oldWallet, newWallet);
    }
    
    ${settings.securityFeatures.blacklist ? `
    function setBlacklist(address account, bool blacklisted) external onlyOwner {
        require(account != address(0), "Cannot blacklist zero address");
        require(account != owner(), "Cannot blacklist owner");
        _blacklist[account] = blacklisted;
        emit AddressBlacklisted(account, blacklisted);
    }` : ''}
    
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }
    
    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }
    
    ${settings.securityFeatures.pausable ? `
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }` : ''}
    
    // Emergency withdrawal function
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    // View Functions
    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }
    
    function isExcludedFromLimits(address account) public view returns (bool) {
        return _isExcludedFromLimits[account];
    }
    
    ${settings.securityFeatures.blacklist ? `
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }` : ''}
    
    function getCirculatingSupply() public view returns (uint256) {
        return totalSupply() - balanceOf(address(0)) - balanceOf(address(0xdead));
    }
    
    // Core Transfer Function with All Features
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override ${settings.securityFeatures.pausable ? 'whenNotPaused ' : ''} {
        
        // Skip all checks for minting/burning
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }
        
        require(amount > 0, "Transfer amount must be greater than zero");
        require(tradingEnabled || _isExcludedFromFees[from], "Trading not enabled");
        
        ${settings.securityFeatures.blacklist ? `
        require(!_blacklist[from], "Sender is blacklisted");
        require(!_blacklist[to], "Recipient is blacklisted");` : ''}
        
        ${settings.limitSettings.launchProtection ? `
        // Launch protection
        if (launchTime > 0 && block.timestamp < launchTime + launchProtectionDuration) {
            require(_isExcludedFromLimits[from] || _isExcludedFromLimits[to], "Launch protection active");
        }` : ''}
        
        ${settings.limitSettings.tradingCooldown > 0 ? `
        // Trading cooldown
        if (!_isExcludedFromFees[from] && !_isExcludedFromFees[to]) {
            require(block.timestamp >= _lastTransfer[from] + ${settings.limitSettings.tradingCooldown}, "Transfer cooldown active");
            _lastTransfer[from] = block.timestamp;
        }` : ''}
        
        // Apply limits
        if (limitsInEffect && !_isExcludedFromLimits[from] && !_isExcludedFromLimits[to]) {
            ${settings.limitSettings.maxTxPercent > 0 ? `
            require(amount <= maxTxAmount, "Transfer amount exceeds max transaction amount");` : ''}
            
            ${settings.limitSettings.maxWalletPercent > 0 ? `
            if (to != address(dexPair)) {
                require(balanceOf(to) + amount <= maxWalletAmount, "Transfer would exceed max wallet amount");
            }` : ''}
            
            ${settings.limitSettings.maxSellPercent > 0 ? `
            if (to == address(dexPair)) {
                require(amount <= maxSellAmount, "Sell amount exceeds max sell amount");
            }` : ''}
        }
        
        ${settings.autoLiquidity ? `
        // Auto liquidity and fee distribution
        uint256 contractTokenBalance = balanceOf(address(this));
        bool canSwap = contractTokenBalance >= swapTokensAtAmount;
        
        if (canSwap && swapEnabled && !swapping && to == dexPair && !_isExcludedFromFees[from]) {
            swapAndDistribute(contractTokenBalance);
        }` : ''}
        
        // Calculate and apply fees
        bool takeFee = !swapping && !_isExcludedFromFees[from] && !_isExcludedFromFees[to];
        
        if (takeFee ${(settings.contractType === 'tax' || settings.contractType === 'meme-advanced') ? '&& (from == dexPair || to == dexPair)' : ''}) {
            uint256 fees = calculateFees(from, to, amount);
            if (fees > 0) {
                super._update(from, address(this), fees);
                amount = amount - fees;
            }
        }
        
        super._update(from, to, amount);
    }
    
    ${(settings.contractType === 'tax' || settings.contractType === 'meme-advanced') ? `
    function calculateFees(address from, address to, uint256 amount) private view returns (uint256) {
        uint256 feePercent = 0;
        
        if (to == dexPair) {
            // Selling
            feePercent = sellTax;
        } else if (from == dexPair) {
            // Buying  
            feePercent = buyTax;
        } else {
            // Regular transfer
            feePercent = transferTax;
        }
        
        return (amount * feePercent) / 100;
    }` : ''}
    
    // Receive ETH/PLS
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}`;

  return contractCode;
};
};

// Tab configuration
const TABS = [
  {
    value: "contract-type",
    label: "Contract Type",
    icon: <Star className="h-4 w-4" />,
  },
  {
    value: "basic-settings",
    label: "Basic Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    value: "tax-settings",
    label: "Tax & Fees",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    value: "security",
    label: "Security",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: <Sliders className="h-4 w-4" />,
  },
  {
    value: "preview",
    label: "Preview",
    icon: <Code className="h-4 w-4" />,
  }
];

// Contract Generator Component
export default function ContractCodeGenerator({ tokenomics, coinIdea }: ContractCodeGeneratorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contract-type');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [generatedContract, setGeneratedContract] = useState("");

  const [settings, setSettings] = useState<ContractSettings>({
    tokenName: coinIdea?.name || '',
    tokenSymbol: coinIdea?.ticker?.replace('$', '') || '',
    totalSupply: tokenomics?.totalSupply || '1000000000',
    decimals: 18,
    contractType: '',
    networkId: 369, // PulseChain default
    securityFeatures: {
      antiWhale: true,
      blacklist: true,
      pausable: true,
      reflection: false,
      burnable: false,
      mintable: false,
      snapshot: false,
      voting: false,
      deflationary: false,
      rewardToken: false
    },
    taxSettings: {
      buyTax: Number(tokenomics?.buyTax || '5'),
      sellTax: Number(tokenomics?.sellTax || '5'),
      transferTax: 0,
      maxTax: 25,
      liquidityShare: Number(tokenomics?.taxAllocation?.liquidity || '40'),
      marketingShare: Number(tokenomics?.taxAllocation?.marketing || '40'),
      devShare: 10,
      burnShare: Number(tokenomics?.taxAllocation?.burn || '10'),
      reflectionShare: 0,
      charityShare: 0
    },
    walletSettings: {
      marketingWallet: '',
      devWallet: '',
      autoLiquidityWallet: '',
      charityWallet: '',
      treasuryWallet: ''
    },
    limitSettings: {
      maxTxPercent: 1,
      maxWalletPercent: 2,
      maxSellPercent: 1,
      tradingCooldown: 30,
      launchProtection: true,
      antiSnipe: true,
      antiBotEnabled: true
    },
    routerAddress: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
    autoLiquidity: true,
    liquidityLockDays: 365
  });

  // Update settings based on tokenomics props
  useEffect(() => {
    if (tokenomics) {
      setSettings(prev => ({
        ...prev,
        totalSupply: tokenomics.totalSupply,
        taxSettings: {
          ...prev.taxSettings,
          buyTax: Number(tokenomics.buyTax || '5'),
          sellTax: Number(tokenomics.sellTax || '5'),
          liquidityShare: Number(tokenomics.taxAllocation?.liquidity || '40'),
          marketingShare: Number(tokenomics.taxAllocation?.marketing || '40'),
          burnShare: Number(tokenomics.taxAllocation?.burn || '10')
        },
        securityFeatures: {
          ...prev.securityFeatures,
          burnable: tokenomics.taxAllocation.burn !== "0"
        }
      }));
    }
  }, [tokenomics]);

  // Update settings based on coin idea
  useEffect(() => {
    if (coinIdea) {
      setSettings(prev => ({
        ...prev,
        tokenName: coinIdea.name,
        tokenSymbol: coinIdea.ticker?.replace('$', '') || coinIdea.name.substring(0, 4).toUpperCase()
      }));
    }
  }, [coinIdea]);

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
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

  const handleTaxSettingsChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        [key]: value
      }
    }));
  };

  const handleWalletSettingsChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      walletSettings: {
        ...prev.walletSettings,
        [key]: value
      }
    }));
  };

  const handleLimitSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      limitSettings: {
        ...prev.limitSettings,
        [key]: value
      }
    }));
  };

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

  return (
    <div className="py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-screen backdrop-blur-3xl">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            Smart Contract Generator
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Generate a complete, feature-rich smart contract for your token
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className={cn(
            "bg-black/40 backdrop-blur-xl border-2 border-purple-500/20",
            "shadow-[0_0_45px_-15px_rgba(147,51,234,0.3)] rounded-2xl"
          )}>
            <Tabs defaultValue="contract-type" className="p-6">
              <TabsList className={cn(
                "grid grid-cols-6 w-full h-auto mb-8",
                "bg-gray-800/50 backdrop-blur-md border-2 border-purple-500/20 rounded-xl p-3 gap-2"
              )}>
                <TabsTrigger
                  value="contract-type"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">Type</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="basic-settings"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Basic</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="tax-settings"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Tax</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Security</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    <span className="font-medium">Advanced</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                    "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">Preview</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contract-type" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-blue-400" />
                      <CardTitle>Select Contract Type</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {CONTRACT_TYPES.map((type) => {
                        const IconComponent = type.icon;
                        const isSelected = settings.contractType === type.id;
                        return (
                          <Card
                            key={type.id}
                            className={cn(
                              "cursor-pointer transition-all duration-200 p-4",
                              "border-2 hover:scale-105",
                              isSelected 
                                ? "border-purple-500 bg-purple-500/10 shadow-lg" 
                                : "border-gray-600/30 bg-black/20 hover:border-purple-500/50"
                            )}
                            onClick={() => handleSettingsChange('contractType', type.id)}
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <IconComponent className={cn(
                                "w-8 h-8",
                                isSelected ? "text-purple-400" : "text-gray-400"
                              )} />
                              <div>
                                <h3 className="font-semibold">{type.name}</h3>
                                <p className="text-sm text-gray-400 mb-2">{type.description}</p>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs mb-2",
                                    type.complexity === 'Basic' && "border-green-500 text-green-400",
                                    type.complexity === 'Intermediate' && "border-yellow-500 text-yellow-400",
                                    type.complexity === 'Advanced' && "border-orange-500 text-orange-400",
                                    type.complexity === 'Expert' && "border-red-500 text-red-400"
                                  )}
                                >
                                  {type.complexity}
                                </Badge>
                                <p className="text-xs text-gray-500">{type.gasEstimate}</p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    
                    {settings.contractType && (
                      <div className="mt-6 p-4 bg-black/40 rounded-lg">
                        <h4 className="font-semibold mb-2">Features Included:</h4>
                        <div className="flex flex-wrap gap-2">
                          {CONTRACT_TYPES.find(t => t.id === settings.contractType)?.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="bg-purple-500/20 text-purple-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black/30 rounded-xl p-6 border-2 border-green-500/20 shadow-lg hover:border-green-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <CardTitle>Network Selection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Select value={settings.networkId.toString()} onValueChange={(value) => handleSettingsChange('networkId', parseInt(value))}>
                      <SelectTrigger className="bg-black/50 border-green-500/20 focus:border-green-500/40">
                        <SelectValue placeholder="Select Network" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-green-500/20">
                        {NETWORK_OPTIONS.map((network) => (
                          <SelectItem key={network.id} value={network.id.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{network.name}</span>
                              <Badge variant="outline" className="text-xs">{network.symbol}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="basic-settings" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-blue-400" />
                      <CardTitle>Token Configuration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tokenName">Token Name</Label>
                          <Input
                            id="tokenName"
                            value={settings.tokenName}
                            onChange={(e) => handleSettingsChange('tokenName', e.target.value)}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                            placeholder="e.g., PulseChain Meme Token"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tokenSymbol">Token Symbol</Label>
                          <Input
                            id="tokenSymbol"
                            value={settings.tokenSymbol}
                            onChange={(e) => handleSettingsChange('tokenSymbol', e.target.value)}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                            placeholder="e.g., PCMT"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="totalSupply">Total Supply</Label>
                          <Input
                            id="totalSupply"
                            value={settings.totalSupply}
                            onChange={(e) => handleSettingsChange('totalSupply', e.target.value)}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                            placeholder="e.g., 1000000000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="decimals">Decimals</Label>
                          <Input
                            id="decimals"
                            type="number"
                            min="0"
                            max="18"
                            value={settings.decimals}
                            onChange={(e) => handleSettingsChange('decimals', parseInt(e.target.value))}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tax-settings" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-yellow-500/20 shadow-lg hover:border-yellow-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      <CardTitle>Tax Configuration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label>Buy Tax: {settings.taxSettings.buyTax}%</Label>
                        <Slider
                          value={[settings.taxSettings.buyTax]}
                          onValueChange={(value) => handleTaxSettingsChange('buyTax', value[0])}
                          max={settings.taxSettings.maxTax}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Sell Tax: {settings.taxSettings.sellTax}%</Label>
                        <Slider
                          value={[settings.taxSettings.sellTax]}
                          onValueChange={(value) => handleTaxSettingsChange('sellTax', value[0])}
                          max={settings.taxSettings.maxTax}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Transfer Tax: {settings.taxSettings.transferTax}%</Label>
                        <Slider
                          value={[settings.taxSettings.transferTax]}
                          onValueChange={(value) => handleTaxSettingsChange('transferTax', value[0])}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Tax Distribution (Must total 100%)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { key: 'liquidityShare', label: 'Liquidity', icon: RefreshCw },
                          { key: 'marketingShare', label: 'Marketing', icon: TrendingUp },
                          { key: 'devShare', label: 'Development', icon: Settings },
                          { key: 'burnShare', label: 'Burn', icon: Flame },
                          { key: 'reflectionShare', label: 'Reflection', icon: Eye },
                          { key: 'charityShare', label: 'Charity', icon: Users }
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-purple-400" />
                              <Label>{label}: {settings.taxSettings[key as keyof TaxSettings]}%</Label>
                            </div>
                            <Slider
                              value={[settings.taxSettings[key as keyof TaxSettings] as number]}
                              onValueChange={(value) => handleTaxSettingsChange(key, value[0])}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-black/40 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Total Distribution:</span>
                          <Badge 
                            variant={
                              (settings.taxSettings.liquidityShare + 
                               settings.taxSettings.marketingShare + 
                               settings.taxSettings.devShare + 
                               settings.taxSettings.burnShare + 
                               settings.taxSettings.reflectionShare + 
                               settings.taxSettings.charityShare) === 100 
                                ? "default" : "destructive"
                            }
                          >
                            {settings.taxSettings.liquidityShare + 
                             settings.taxSettings.marketingShare + 
                             settings.taxSettings.devShare + 
                             settings.taxSettings.burnShare + 
                             settings.taxSettings.reflectionShare + 
                             settings.taxSettings.charityShare}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 rounded-xl p-6 border-2 border-purple-500/20 shadow-lg hover:border-purple-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      <CardTitle>Wallet Configuration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'marketingWallet', label: 'Marketing Wallet', description: 'Receives marketing tax allocation' },
                      { key: 'devWallet', label: 'Development Wallet', description: 'Receives development tax allocation' },
                      { key: 'autoLiquidityWallet', label: 'Auto Liquidity Wallet', description: 'Receives liquidity tokens (optional)' },
                      { key: 'charityWallet', label: 'Charity Wallet', description: 'Receives charity tax allocation' },
                      { key: 'treasuryWallet', label: 'Treasury Wallet', description: 'Additional treasury address' }
                    ].map(({ key, label, description }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input
                          id={key}
                          value={settings.walletSettings[key as keyof WalletSettings]}
                          onChange={(e) => handleWalletSettingsChange(key, e.target.value)}
                          className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                          placeholder="0x..."
                        />
                        <p className="text-xs text-gray-400">{description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-red-500/20 shadow-lg hover:border-red-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-400" />
                      <CardTitle>Security Features</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(settings.securityFeatures).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {feature === 'antiWhale' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                              {feature === 'blacklist' && <Lock className="w-4 h-4 text-red-400" />}
                              {feature === 'pausable' && <Timer className="w-4 h-4 text-yellow-400" />}
                              {feature === 'reflection' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                              {feature === 'burnable' && <Flame className="w-4 h-4 text-orange-400" />}
                              {feature === 'mintable' && <Sparkles className="w-4 h-4 text-green-400" />}
                              {feature === 'snapshot' && <Eye className="w-4 h-4 text-purple-400" />}
                              {feature === 'voting' && <Users className="w-4 h-4 text-blue-400" />}
                              {feature === 'deflationary' && <Flame className="w-4 h-4 text-red-400" />}
                              {feature === 'rewardToken' && <Star className="w-4 h-4 text-yellow-400" />}
                              <Label className="font-medium capitalize">
                                {feature.replace(/([A-Z])/g, ' $1').trim()}
                              </Label>
                            </div>
                            <p className="text-sm text-gray-400">{getFeatureDescription(feature)}</p>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={() => handleSecurityFeatureToggle(feature as keyof SecurityFeatures)}
                            className="data-[state=checked]:bg-red-500 ml-4"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Sliders className="w-5 h-5 text-orange-400" />
                      <CardTitle>Trading Limits & Protection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label>Max Transaction: {settings.limitSettings.maxTxPercent}%</Label>
                        <Slider
                          value={[settings.limitSettings.maxTxPercent]}
                          onValueChange={(value) => handleLimitSettingsChange('maxTxPercent', value[0])}
                          min={0.1}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-400">Maximum tokens per transaction (% of total supply)</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Max Wallet: {settings.limitSettings.maxWalletPercent}%</Label>
                        <Slider
                          value={[settings.limitSettings.maxWalletPercent]}
                          onValueChange={(value) => handleLimitSettingsChange('maxWalletPercent', value[0])}
                          min={0.1}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-400">Maximum tokens per wallet (% of total supply)</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Max Sell: {settings.limitSettings.maxSellPercent}%</Label>
                        <Slider
                          value={[settings.limitSettings.maxSellPercent]}
                          onValueChange={(value) => handleLimitSettingsChange('maxSellPercent', value[0])}
                          min={0.1}
                          max={5}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-400">Maximum sell amount (% of total supply)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>Trading Cooldown: {settings.limitSettings.tradingCooldown} seconds</Label>
                        <Slider
                          value={[settings.limitSettings.tradingCooldown]}
                          onValueChange={(value) => handleLimitSettingsChange('tradingCooldown', value[0])}
                          min={0}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-400">Cooldown period between trades</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { key: 'launchProtection', label: 'Launch Protection', description: 'Protection during initial launch phase', icon: Shield },
                        { key: 'antiSnipe', label: 'Anti-Snipe', description: 'Prevent sniping bots at launch', icon: Target },
                        { key: 'antiBotEnabled', label: 'Anti-Bot', description: 'General bot detection and prevention', icon: Bot }
                      ].map(({ key, label, description, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-orange-400" />
                              <Label className="font-medium">{label}</Label>
                            </div>
                            <p className="text-sm text-gray-400">{description}</p>
                          </div>
                          <Switch
                            checked={settings.limitSettings[key as keyof LimitSettings] as boolean}
                            onCheckedChange={(checked) => handleLimitSettingsChange(key, checked)}
                            className="data-[state=checked]:bg-orange-500 ml-4"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 rounded-xl p-6 border-2 border-green-500/20 shadow-lg hover:border-green-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-green-400" />
                      <CardTitle>Liquidity Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <Label className="font-medium">Auto Liquidity</Label>
                        <p className="text-sm text-gray-400">Automatically add liquidity from taxes</p>
                      </div>
                      <Switch
                        checked={settings.autoLiquidity}
                        onCheckedChange={(checked) => handleSettingsChange('autoLiquidity', checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Liquidity Lock Period: {settings.liquidityLockDays} days</Label>
                      <Slider
                        value={[settings.liquidityLockDays]}
                        onValueChange={(value) => handleSettingsChange('liquidityLockDays', value[0])}
                        min={30}
                        max={1095}
                        step={30}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400">How long to lock initial liquidity</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card className="bg-black/30 rounded-xl border-2 border-green-500/20">
                  <CardContent className="p-6">
                    <div className={cn(
                      "bg-black/60 rounded-lg p-4 font-mono text-sm",
                      "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                    )}>
                      <pre className="whitespace-pre-wrap break-words">
                        {generatedContract || "// Your generated contract will appear here"}
                      </pre>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        className={cn(
                          "bg-purple-500/20 hover:bg-purple-500/30",
                          "border-purple-500/20 hover:border-purple-500/40"
                        )}
                        disabled={!generatedContract}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                      </Button>
                      <Button
                        onClick={handleDownloadContract}
                        variant="outline"
                        className={cn(
                          "bg-green-500/20 hover:bg-green-500/30",
                          "border-green-500/20 hover:border-green-500/40"
                        )}
                        disabled={!generatedContract}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleGenerateContract}
                  disabled={isGenerating}
                  className={cn(
                    "w-full bg-gradient-to-r from-purple-600 to-orange-500",
                    "hover:from-purple-700 hover:to-orange-600 text-white font-semibold",
                    "py-4 rounded-xl shadow-lg transition-all duration-300",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Generate Smart Contract</span>
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
