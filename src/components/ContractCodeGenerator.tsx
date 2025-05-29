import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Code, Shield, Copy, Download, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TokenomicsData {
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    liquidity: string;
    marketing: string;
    reflection: string;
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
  tokenomics: TokenomicsData;
  coinIdea: {
    name: string;
    ticker: string;
    theme: string;
    logoIdea: string;
  };
}

interface SecurityFeatures {
  antiWhale: boolean;
  blacklist: boolean;
  pausable: boolean;
  reflection: boolean;
  burnable: boolean;
}

interface ContractSettings {
  tokenName: string;
  tokenSymbol: string;
  initialSupply: number;
  decimals: number;
  totalSupply: string;
  maxTxAmount: string;
  maxWalletAmount: string;
  autoLiquidity: boolean;
  liquidityLockDays: number;
  owner: string;
  buyTax: number;
  sellTax: number;
  transferTax: number;
  liquidityShare: number;
  marketingShare: number;
  devShare: number;
  reflectionShare: number;
  burnShare: number;
  securityFeatures: SecurityFeatures;
  tradingCooldown: number; // in seconds
  initialLiquidity: number; // percentage of total supply
  uniswapRouter: string;
}

const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    antiWhale: "Limit maximum transaction and wallet amounts",
    blacklist: "Block malicious addresses from trading",
    pausable: "Emergency pause functionality for trading",
    reflection: "Automatic rewards for token holders",
    burnable: "Enable token burning mechanism"
  };
  return descriptions[feature] || "";
};

const generateContractCode = (settings: ContractSettings): string => {
  const imports = [
    'pragma solidity ^0.8.19;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
    'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";',
    'import "@openzeppelin/contracts/security/Pausable.sol";',
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    'import "@openzeppelin/contracts/utils/math/SafeMath.sol";',
    settings.securityFeatures.reflection ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";' : '',
  ].filter(Boolean).join('\n');

  const contractName = settings.tokenName.replace(/\s+/g, '');
  const inheritance = [
    'ERC20',
    'ERC20Burnable',
    'Pausable',
    'Ownable',
    settings.securityFeatures.reflection ? 'ERC20Votes' : ''
  ].filter(Boolean).join(', ');

  const contractStart = `
contract ${contractName} is ${inheritance} {
    using SafeMath for uint256;

    // Token configuration
    uint256 private constant DECIMALS = ${settings.decimals};
    uint256 private constant TOTAL_SUPPLY = ${settings.totalSupply} * 10**DECIMALS;
    
    // Trading limits
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;
    
    // Trading status
    bool public tradingEnabled;
    bool public tradingPaused;
    
    // Fee configuration
    uint256 public buyTax;
    uint256 public sellTax;
    uint256 public transferTax;
    
    // Fee distribution
    uint256 public liquidityShare;
    uint256 public marketingShare;
    uint256 public devShare;
    uint256 public reflectionShare;
    uint256 public burnShare;
    
    // Wallets
    address public marketingWallet;
    address public devWallet;
    address public autoLiquidityWallet;
    
    // Anti-bot & security
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromLimits;
    ${settings.securityFeatures.blacklist ? 'mapping(address => bool) private _blacklist;' : ''}
    mapping(address => uint256) private _lastTrade;
    uint256 public tradeCooldown;
    
    // Events
    event TradingEnabled();
    event WalletUpdated(string walletType, address newWallet);
    event ExcludedFromFees(address account, bool isExcluded);
    event ExcludedFromLimits(address account, bool isExcluded);
    ${settings.securityFeatures.blacklist ? 'event AddressBlacklisted(address account, bool isBlacklisted);' : ''}
    event TaxUpdated(string taxType, uint256 newValue);
    event TaxSharesUpdated(
        uint256 liquidity,
        uint256 marketing,
        uint256 dev,
        uint256 reflection,
        uint256 burn
    );
`;

  const constructor = `
    constructor(
        address _marketingWallet,
        address _devWallet,
        address _autoLiquidityWallet
    ) ERC20("${settings.tokenName}", "${settings.tokenSymbol}") {
        require(_marketingWallet != address(0), "Marketing wallet cannot be zero address");
        require(_devWallet != address(0), "Dev wallet cannot be zero address");
        require(_autoLiquidityWallet != address(0), "Auto liquidity wallet cannot be zero address");
        
        _mint(msg.sender, TOTAL_SUPPLY);
        
        marketingWallet = _marketingWallet;
        devWallet = _devWallet;
        autoLiquidityWallet = _autoLiquidityWallet;
        
        // Initialize trading limits
        maxTxAmount = (TOTAL_SUPPLY * ${settings.maxTxAmount}) / 100;
        maxWalletAmount = (TOTAL_SUPPLY * ${settings.maxWalletAmount}) / 100;
        
        // Initialize fees
        buyTax = ${settings.buyTax || 5};
        sellTax = ${settings.sellTax || 5};
        transferTax = ${settings.transferTax || 0};
        
        // Initialize fee shares
        liquidityShare = ${settings.liquidityShare || 40};
        marketingShare = ${settings.marketingShare || 30};
        devShare = ${settings.devShare || 10};
        reflectionShare = ${settings.reflectionShare || 10};
        burnShare = ${settings.burnShare || 10};
        
        // Set initial trading cooldown
        tradeCooldown = 30 seconds;
        
        // Exclude contract deployer and essential addresses from fees and limits
        _isExcludedFromFees[msg.sender] = true;
        _isExcludedFromFees[address(this)] = true;
        _isExcludedFromFees[marketingWallet] = true;
        _isExcludedFromFees[devWallet] = true;
        _isExcludedFromFees[autoLiquidityWallet] = true;
        
        _isExcludedFromLimits[msg.sender] = true;
        _isExcludedFromLimits[address(this)] = true;
        _isExcludedFromLimits[marketingWallet] = true;
        _isExcludedFromLimits[devWallet] = true;
        _isExcludedFromLimits[autoLiquidityWallet] = true;
    }
`;

  const coreFunctions = `
    // Core transfer function override with enhanced security
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        require(sender != address(0), "ERC20: transfer from zero address");
        require(recipient != address(0), "ERC20: transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(!tradingPaused || _isExcludedFromFees[sender] || _isExcludedFromFees[recipient], "Trading is paused");
        ${settings.securityFeatures.blacklist ? 'require(!_blacklist[sender] && !_blacklist[recipient], "Address is blacklisted");' : ''}
        
        // Validate trading status and bot protection
        if (!tradingEnabled) {
            require(_isExcludedFromFees[sender] || _isExcludedFromFees[recipient], "Trading not yet enabled");
        } else {
            if (!_isExcludedFromFees[sender] && !_isExcludedFromFees[recipient]) {
                require(block.timestamp >= _lastTrade[sender].add(tradeCooldown), "Must wait for cooldown");
                _lastTrade[sender] = block.timestamp;
            }
        }
        
        // Transaction and wallet limits
        if (!_isExcludedFromLimits[sender] && !_isExcludedFromLimits[recipient]) {
            require(amount <= maxTxAmount, "Transfer exceeds max transaction amount");
            if (recipient != uniswapV2Pair) {
                uint256 recipientBalance = balanceOf(recipient);
                require(recipientBalance.add(amount) <= maxWalletAmount, "Recipient would exceed max wallet amount");
            }
            require(balanceOf(recipient).add(amount) <= maxWalletAmount, "Recipient wallet amount exceeds maximum");
            require(block.timestamp >= _lastTrade[sender].add(tradeCooldown), "Must wait for trade cooldown");
            _lastTrade[sender] = block.timestamp;
        }
        
        // Calculate fees
        uint256 feeAmount = 0;
        if (!_isExcludedFromFees[sender] && !_isExcludedFromFees[recipient]) {
            uint256 taxRate;
            if (sender == uniswapV2Pair) {
                taxRate = buyTax;
            } else if (recipient == uniswapV2Pair) {
                taxRate = sellTax;
            } else {
                taxRate = transferTax;
            }
            
            if (taxRate > 0) {
                feeAmount = amount.mul(taxRate).div(100);
                uint256 liquidityAmount = feeAmount.mul(liquidityShare).div(100);
                uint256 marketingAmount = feeAmount.mul(marketingShare).div(100);
                uint256 devAmount = feeAmount.mul(devShare).div(100);
                uint256 reflectionAmount = feeAmount.mul(reflectionShare).div(100);
                uint256 burnAmount = feeAmount.mul(burnShare).div(100);
                
                // Process fee distributions
                if (liquidityAmount > 0) super._transfer(sender, autoLiquidityWallet, liquidityAmount);
                if (marketingAmount > 0) super._transfer(sender, marketingWallet, marketingAmount);
                if (devAmount > 0) super._transfer(sender, devWallet, devAmount);
                if (reflectionAmount > 0) _redistribute(sender, reflectionAmount);
                if (burnAmount > 0) _burn(sender, burnAmount);
            }
        }
        
        // Transfer remaining amount
        super._transfer(sender, recipient, amount.sub(feeAmount));
    }

    // Redistribution mechanism
    function _redistribute(address sender, uint256 amount) internal {
        uint256 totalShares = totalSupply().sub(balanceOf(address(0)));
        if (totalShares > 0) {
            foreach(address holder in getHolders()) {
                if (holder != sender && holder != address(0)) {
                    uint256 share = amount.mul(balanceOf(holder)).div(totalShares);
                    super._transfer(sender, holder, share);
                }
            }
        }
    }
`;

  const ownerFunctions = `
    // Owner functions
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    function setTradingPaused(bool paused) external onlyOwner {
        tradingPaused = paused;
    }
    
    function setMaxTxAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        maxTxAmount = amount;
    }
    
    function setMaxWalletAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        maxWalletAmount = amount;
    }
    
    function setTradeCooldown(uint256 seconds_) external onlyOwner {
        tradeCooldown = seconds_;
    }
    
    function setTaxes(
        uint256 _buyTax,
        uint256 _sellTax,
        uint256 _transferTax
    ) external onlyOwner {
        require(_buyTax <= 25 && _sellTax <= 25 && _transferTax <= 25, "Tax cannot exceed 25%");
        buyTax = _buyTax;
        sellTax = _sellTax;
        transferTax = _transferTax;
        emit TaxUpdated("Buy", _buyTax);
        emit TaxUpdated("Sell", _sellTax);
        emit TaxUpdated("Transfer", _transferTax);
    }
    
    function setTaxShares(
        uint256 _liquidityShare,
        uint256 _marketingShare,
        uint256 _devShare,
        uint256 _reflectionShare,
        uint256 _burnShare
    ) external onlyOwner {
        require(
            _liquidityShare.add(_marketingShare).add(_devShare).add(_reflectionShare).add(_burnShare) == 100,
            "Shares must total 100"
        );
        liquidityShare = _liquidityShare;
        marketingShare = _marketingShare;
        devShare = _devShare;
        reflectionShare = _reflectionShare;
        burnShare = _burnShare;
        emit TaxSharesUpdated(_liquidityShare, _marketingShare, _devShare, _reflectionShare, _burnShare);
    }
    
    function setWallets(
        address _marketingWallet,
        address _devWallet,
        address _autoLiquidityWallet
    ) external onlyOwner {
        if (_marketingWallet != address(0)) {
            marketingWallet = _marketingWallet;
            emit WalletUpdated("Marketing", _marketingWallet);
        }
        if (_devWallet != address(0)) {
            devWallet = _devWallet;
            emit WalletUpdated("Dev", _devWallet);
        }
        if (_autoLiquidityWallet != address(0)) {
            autoLiquidityWallet = _autoLiquidityWallet;
            emit WalletUpdated("AutoLiquidity", _autoLiquidityWallet);
        }
    }
    
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }
    
    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }
    
    ${settings.securityFeatures.blacklist ? `
    function setBlacklisted(address account, bool blacklisted) external onlyOwner {
        _blacklist[account] = blacklisted;
        emit AddressBlacklisted(account, blacklisted);
    }` : ''}
`;

  const getterFunctions = `
    // Getter functions
    function isExcludedFromFees(address account) external view returns (bool) {
        return _isExcludedFromFees[account];
    }
    
    function isExcludedFromLimits(address account) external view returns (bool) {
        return _isExcludedFromLimits[account];
    }
    
    ${settings.securityFeatures.blacklist ? `
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklist[account];
    }` : ''}
    
    function getLastTrade(address account) external view returns (uint256) {
        return _lastTrade[account];
    }
`;

  return `// SPDX-License-Identifier: MIT
${imports}

/**
 * @title ${settings.tokenName}
 * @dev Generated by MemePulse Genesis Forge
 * @custom:security-contact ${settings.owner}
 */
${contractStart}
${constructor}
${coreFunctions}
${ownerFunctions}
${getterFunctions}
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
    initialSupply: 1000000,
    decimals: 18,
    totalSupply: "1000000000",
    maxTxAmount: "2",
    maxWalletAmount: "4",
    autoLiquidity: true,
    liquidityLockDays: 365,
    owner: "",
    buyTax: 5,
    sellTax: 5,
    transferTax: 0,
    liquidityShare: 40,
    marketingShare: 30,
    devShare: 10,
    reflectionShare: 10,
    burnShare: 10,
    tradingCooldown: 30,
    initialLiquidity: 80,
    uniswapRouter: "0x01A79ea342a54E64e4Aa7903b59493570C42A866", // Production PulseX Router v3
    securityFeatures: {
      antiWhale: true,
      blacklist: true,
      pausable: true,
      reflection: false,
      burnable: true
    }
  });

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      totalSupply: tokenomics.totalSupply,
      maxTxAmount: tokenomics.buyTax,
      maxWalletAmount: tokenomics.sellTax,
      securityFeatures: {
        ...prev.securityFeatures,
        reflection: tokenomics.taxAllocation.reflection !== "0",
        burnable: tokenomics.taxAllocation.burn !== "0"
      }
    }));
  }, [tokenomics]);


  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      tokenName: coinIdea.name,
      tokenSymbol: coinIdea.ticker || coinIdea.name.substring(0, 4).toUpperCase()
    }));
  }, [coinIdea]);

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

  const handleAiNameSuggestion = async () => {
    const theme = coinIdea.theme || 'meme coin';
    const suggestions = [
      'Pulse' + theme.split(' ')[0].charAt(0).toUpperCase() + theme.split(' ')[0].slice(1),
      theme.split(' ')[0].charAt(0).toUpperCase() + theme.split(' ')[0].slice(1) + 'Chain',
      'Meta' + theme.split(' ')[0].charAt(0).toUpperCase() + theme.split(' ')[0].slice(1),
      theme.split(' ')[0].charAt(0).toUpperCase() + theme.split(' ')[0].slice(1) + 'X',
      theme.split(' ')[0].charAt(0).toUpperCase() + theme.split(' ')[0].slice(1) + 'DAO'
    ];

    const aiSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const ticker = aiSuggestion.substring(0, 4).toUpperCase();

    setSettings(prev => ({
      ...prev,
      tokenName: aiSuggestion,
      tokenSymbol: ticker
    }));

    toast({
      title: "AI Name Generated! 🤖",
      description: `Generated name: ${aiSuggestion} ($${ticker})`
    });
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
            <Tabs defaultValue="settings" className="p-6">
              <TabsList className={cn(
                "grid grid-cols-2 w-full h-auto mb-8",
                "bg-gray-800/50 backdrop-blur-md border-2 border-purple-500/20 rounded-xl p-3 gap-4"
              )}>
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "px-6 py-4 rounded-lg transition-all duration-200 hover:bg-white/5",
                      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20",
                      "data-[state=active]:to-orange-500/20 data-[state=active]:shadow-lg"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="settings" className="space-y-8">
                <Card className="bg-black/30 rounded-xl p-6 border-2 border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">                      <Settings className="w-5 h-5 text-blue-400" />
                        <CardTitle>Token Configuration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tokenName">Token Name</Label>
                          <div className="flex gap-2">
                            <Input
                              id="tokenName"
                              value={settings.tokenName}
                              onChange={(e) => handleSettingsChange('tokenName', e.target.value)}
                              className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                            />
                            <Button
                              onClick={handleAiNameSuggestion}
                              variant="outline"
                              className="border-gray-600 hover:bg-gray-800"
                              title="Generate AI Name Suggestion"
                            >
                              <Sparkles className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="tokenSymbol">Token Symbol</Label>
                          <Input
                            id="tokenSymbol"
                            value={settings.tokenSymbol}
                            onChange={(e) => handleSettingsChange('tokenSymbol', e.target.value)}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="decimals">Decimals</Label>
                          <Input
                            id="decimals"
                            type="number"
                            value={settings.decimals}
                            onChange={(e) => handleSettingsChange('decimals', parseInt(e.target.value))}
                            className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 rounded-xl p-6 border-2 border-red-500/20 shadow-lg hover:border-red-500/40 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">                      <Shield className="w-5 h-5 text-red-400" />
                        <CardTitle>Security Features</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(settings.securityFeatures).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                          <div>
                            <Label className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}</Label>
                            <p className="text-sm text-gray-400">{getFeatureDescription(feature)}</p>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={() => handleSecurityFeatureToggle(feature as keyof SecurityFeatures)}
                            className="data-[state=checked]:bg-red-500"
                          />
                        </div>
                      ))}
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
