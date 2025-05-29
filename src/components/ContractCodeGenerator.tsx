import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import ParticleBackground from "./ParticleBackground";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Code, Shield, Copy, Download, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

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
  burnable: boolean;
}

interface AdvancedSettings {
  maxTxLimit: number;
  maxWalletLimit: number;
  tradingCooldown: number;
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
    burnable: "Enable token burning mechanism",
    maxTxLimit: "Maximum tokens per transaction (% of total supply)",
    maxWalletLimit: "Maximum tokens per wallet (% of total supply)",
    tradingCooldown: "Cooldown period between trades (seconds)",
    liquidityLockTime: "Time to lock initial liquidity (days)"
  };
  return descriptions[feature] || "";
};

const generateContractCode = (settings: ContractSettings): string => {
  // Only include necessary imports based on enabled features
  const imports = [
    'pragma solidity ^0.8.19;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
    settings.securityFeatures.burnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : '',
    settings.securityFeatures.pausable ? 'import "@openzeppelin/contracts/security/Pausable.sol";' : '',
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    'import "@openzeppelin/contracts/utils/math/SafeMath.sol";'
  ].filter(Boolean).join('\n');

  const contractName = settings.tokenName.replace(/\s+/g, '');
  
  // Only include enabled features in inheritance
  const inheritance = [
    'ERC20',
    settings.securityFeatures.burnable ? 'ERC20Burnable' : '',
    settings.securityFeatures.pausable ? 'Pausable' : '',
    'Ownable'
  ].filter(Boolean).join(', ');

  // Build contract start with only enabled features
  const contractStart = `
contract ${contractName} is ${inheritance} {
    using SafeMath for uint256;

    // Token configuration
    uint256 private constant DECIMALS = ${settings.decimals};
    uint256 private constant TOTAL_SUPPLY = ${settings.totalSupply} * 10**DECIMALS;
    
    ${settings.securityFeatures.antiWhale ? `
    // Trading limits
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;` : ''}
    
    // Trading status
    bool public tradingEnabled;
    ${settings.securityFeatures.pausable ? 'bool public tradingPaused;' : ''}
    
    // Fee configuration
    uint256 public buyTax;
    uint256 public sellTax;
    uint256 public transferTax;
    
    // Fee distribution
    uint256 public liquidityShare;
    uint256 public marketingShare;
    uint256 public devShare;
    ${settings.securityFeatures.burnable ? 'uint256 public burnShare;' : ''}
    
    // Wallets
    address public marketingWallet;
    address public devWallet;
    address public autoLiquidityWallet;
    
    // Anti-bot & security
    mapping(address => bool) private _isExcludedFromFees;
    ${settings.securityFeatures.antiWhale ? 'mapping(address => bool) private _isExcludedFromLimits;' : ''}
    ${settings.securityFeatures.blacklist ? 'mapping(address => bool) private _blacklist;' : ''}
    mapping(address => uint256) private _lastTrade;
    uint256 public tradeCooldown;
    
    // Events
    event TradingEnabled();
    event WalletUpdated(string walletType, address newWallet);
    event ExcludedFromFees(address account, bool isExcluded);
    ${settings.securityFeatures.antiWhale ? 'event ExcludedFromLimits(address account, bool isExcluded);' : ''}
    ${settings.securityFeatures.blacklist ? 'event AddressBlacklisted(address account, bool isBlacklisted);' : ''}
    event TaxUpdated(string taxType, uint256 newValue);
    event TaxSharesUpdated(
    event TaxSharesUpdated(
        uint256 liquidity,
        uint256 marketing,
        uint256 dev,
        ${settings.securityFeatures.burnable ? 'uint256 burn' : ''}
    );`;
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
        
        ${settings.securityFeatures.antiWhale ? `
        // Initialize trading limits
        maxTxAmount = (TOTAL_SUPPLY * ${settings.maxTxAmount}) / 100;
        maxWalletAmount = (TOTAL_SUPPLY * ${settings.maxWalletAmount}) / 100;` : ''}
        
        // Initialize fees
        buyTax = ${settings.buyTax || 5};
        sellTax = ${settings.sellTax || 5};
        transferTax = ${settings.transferTax || 0};
        
        // Initialize fee shares
        liquidityShare = ${settings.liquidityShare || 40};
        marketingShare = ${settings.marketingShare || 30};
        devShare = ${settings.devShare || 10};
        ${settings.securityFeatures.burnable ? `burnShare = ${settings.burnShare || 10};` : ''}
        ${settings.securityFeatures.burnable ? `burnShare = ${settings.burnShare || 10};` : ''}
        tradeCooldown = 30 seconds;
        
        // Exclude contract deployer and essential addresses from fees and limits
        _isExcludedFromFees[msg.sender] = true;
        _isExcludedFromFees[address(this)] = true;
        _isExcludedFromFees[marketingWallet] = true;
        _isExcludedFromFees[devWallet] = true;
        ${settings.securityFeatures.antiWhale ? `
        _isExcludedFromLimits[msg.sender] = true;
        _isExcludedFromLimits[address(this)] = true;
        _isExcludedFromLimits[marketingWallet] = true;
        _isExcludedFromLimits[devWallet] = true;` : ''}
    }`;

    // Only include necessary modifiers
    const modifiers = `
    modifier onlyValidAddress(address account) {
        require(account != address(0), "Cannot be zero address");
        _;
    }

    ${settings.securityFeatures.blacklist ? `
    modifier notBlacklisted(address account) {
        require(!_blacklist[account], "Address is blacklisted");
        _;
    }` : ''}

    ${settings.securityFeatures.pausable ? `
    modifier whenTradingNotPaused() {
        require(!tradingPaused, "Trading is paused");
        _;
    }` : ''}

    modifier whenTradingEnabled() {
        require(tradingEnabled, "Trading not enabled");
        _;
    }`;

  // Add transfer override with only enabled features
  const transfer = `
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override ${settings.securityFeatures.pausable ? 'whenNotPaused ' : ''}whenTradingEnabled ${settings.securityFeatures.blacklist ? 'notBlacklisted(sender) notBlacklisted(recipient)' : ''} {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        ${settings.securityFeatures.antiWhale ? `
        // Check transaction limits
        if (!_isExcludedFromLimits[sender] && !_isExcludedFromLimits[recipient]) {
            require(amount <= maxTxAmount, "Transfer amount exceeds the maxTxAmount");
            require(balanceOf(recipient).add(amount) <= maxWalletAmount, "Transfer would exceed maxWalletAmount");
        }` : ''}

        // Check trading cooldown
        if (!_isExcludedFromFees[sender] && !_isExcludedFromFees[recipient]) {
            require(block.timestamp >= _lastTrade[sender] + tradeCooldown, "Must wait for cooldown");
            _lastTrade[sender] = block.timestamp;
        }

        // Calculate and apply fees
        uint256 fee = 0;
        if (!_isExcludedFromFees[sender] && !_isExcludedFromFees[recipient]) {
            fee = calculateFee(sender, recipient, amount);
            if (fee > 0) {
                // Handle fee distribution
                handleFees(amount, fee);
                amount = amount.sub(fee);
            }
        }

        super._transfer(sender, recipient, amount);
    }`;

  // Only include owner functions for enabled features
  const ownerFunctions = `
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
        emit TradingEnabled();
    }

    ${settings.securityFeatures.pausable ? `
    function pauseTrading() external onlyOwner {
        tradingPaused = true;
    }

    function unpauseTrading() external onlyOwner {
        tradingPaused = false;
    }` : ''}

    ${settings.securityFeatures.antiWhale ? `
    function setMaxTxAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        maxTxAmount = amount;
    }

    function setMaxWalletAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        maxWalletAmount = amount;
    }

    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }` : ''}

    ${settings.securityFeatures.blacklist ? `
    function setBlacklist(address account, bool blacklisted) external onlyOwner {
        _blacklist[account] = blacklisted;
        emit AddressBlacklisted(account, blacklisted);
    }` : ''}

    function excludeFromFees(address account, bool excluded) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }`;

  // Combine all parts
  return [
    imports,
    contractStart,
    constructor,
    modifiers,
    transfer,
    ownerFunctions,
    '}'
  ].join('\n\n');
};

// --- CONTRACT TEMPLATE GENERATORS ---
const generateStandardERC20 = (settings: ContractSettings): string => {
  return [
    'pragma solidity ^0.8.19;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    '',
    `contract ${settings.tokenName.replace(/\s+/g, '')} is ERC20, Ownable {`,
    '    constructor() ERC20("' + settings.tokenName + '", "' + settings.tokenSymbol + '") {',
    '        _mint(msg.sender, ' + settings.totalSupply + ' * 10 ** decimals());',
    '    }',
    '}',
  ].join('\n');
};

const generateTaxedToken = generateContractCode; // Use the existing advanced generator for taxed tokens

// --- STEP INDICATOR COMPONENT ---
const StepIndicator = ({ activeTab }: { activeTab: string }) => (
  <div className="flex items-center justify-center space-x-4 bg-gray-900/50 p-4 rounded-lg mb-4 animate-fade-in">
    <div className={cn(
      "flex items-center space-x-2 p-2 rounded-lg pulse-tab transition-all duration-300",
      activeTab === 'settings' ? "bg-purple-500/20 scale-105 shadow-lg" : "opacity-50"
    )}>
      <Settings className="w-4 h-4" />
      <span>1. Basic Settings</span>
    </div>
    <div className="h-px w-8 bg-gradient-to-r from-pulse-purple to-pulse-orange animate-gradient-x" />
    <div className={cn(
      "flex items-center space-x-2 p-2 rounded-lg pulse-tab transition-all duration-300",
      activeTab === 'security' ? "bg-purple-500/20 scale-105 shadow-lg" : "opacity-50"
    )}>
      <Shield className="w-4 h-4" />
      <span>2. Security Features</span>
    </div>
    <div className="h-px w-8 bg-gradient-to-r from-pulse-purple to-pulse-orange animate-gradient-x" />
    <div className={cn(
      "flex items-center space-x-2 p-2 rounded-lg pulse-tab transition-all duration-300",
      activeTab === 'code' ? "bg-purple-500/20 scale-105 shadow-lg" : "opacity-50"
    )}>
      <Code className="w-4 h-4" />
      <span>3. Generate Code</span>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const ContractCodeGenerator = ({ tokenomics, coinIdea }: ContractCodeGeneratorProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  const [generatedCode, setGeneratedCode] = useState('');
  const [settings, setSettings] = useState<ContractSettings>({
    tokenName: coinIdea?.name || '',
    tokenSymbol: coinIdea?.ticker?.replace('$', '') || '',
    initialSupply: 1000000000,
    decimals: 18,
    totalSupply: tokenomics?.totalSupply || '1000000000',
    maxTxAmount: '1',
    maxWalletAmount: '2',
    autoLiquidity: true,
    liquidityLockDays: 365,
    owner: '',
    buyTax: Number(tokenomics?.buyTax || '5'),
    sellTax: Number(tokenomics?.sellTax || '5'),
    transferTax: 0,
    liquidityShare: Number(tokenomics?.taxAllocation?.liquidity || '40'),
    marketingShare: Number(tokenomics?.taxAllocation?.marketing || '40'),
    devShare: 20,
    burnShare: Number(tokenomics?.taxAllocation?.burn || '0'),
    securityFeatures: {
      antiWhale: true,
      blacklist: true,
      pausable: true,
      burnable: false
    },
    tradingCooldown: 30,
    initialLiquidity: 80,
    uniswapRouter: '0x...',
  });
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    maxTxLimit: 1,
    maxWalletLimit: 2,
    tradingCooldown: 30
  });
  // Add contractType state
  const [contractType, setContractType] = useState<string>('');

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      totalSupply: tokenomics.totalSupply,
      maxTxAmount: tokenomics.buyTax,
      maxWalletAmount: tokenomics.sellTax,
      securityFeatures: {
        ...prev.securityFeatures,
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

  useEffect(() => {
    // Try to get contractType from tokenomics (preset)
    // Fallback to 'noTax' if not present
    // If user selected NoTaxStandalone, treat as 'noTax'
    let type = (tokenomics as any).contractType || '';
    if (!type && tokenomics.buyTax === '0' && tokenomics.sellTax === '0') {
      type = 'noTax';
    }
    setContractType(type);
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

  const handleAdvancedSettingChange = (setting: keyof AdvancedSettings, value: number) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Update contract settings when advanced settings change
    if (setting === 'maxTxLimit') {
      handleSettingsChange('maxTxAmount', value.toString());
    } else if (setting === 'maxWalletLimit') {
      handleSettingsChange('maxWalletAmount', value.toString());
    } else if (setting === 'tradingCooldown') {
      handleSettingsChange('tradingCooldown', value);
    }
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

  const generateContract = () => {
    try {
      let code = '';
      if (contractType === 'noTax') {
        code = generateStandardERC20(settings);
      } else {
        code = generateTaxedToken(settings);
      }
      setGeneratedCode(code);
      setActiveTab('code');
      toast({
        title: 'Contract Generated! 🎉',
        description: `Your ${contractType === 'noTax' ? 'Standard PRC20 (no tax)' : 'Tokenomics'} contract has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error Generating Contract',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied! 📋",
      description: "Contract code copied to clipboard",
    });
  };

  const downloadContract = () => {
    if (!generatedCode) return;
    
    const contractName = settings.tokenName.replace(/\s+/g, '');
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName}.sol`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Contract Downloaded! 💾",
      description: `Saved as ${contractName}.sol`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-2 relative">
      <ParticleBackground />
      {/* Animated sparkles for ultra-wow effect */}
      <span className="pulse-sparkle pulse-sparkle-1" />
      <span className="pulse-sparkle pulse-sparkle-2" />
      <span className="pulse-sparkle pulse-sparkle-3" />
      <span className="pulse-sparkle pulse-sparkle-4" />
      <span className="pulse-sparkle pulse-sparkle-5" />
      {/* Animated logo or badge removed as requested */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="pulse-title text-3xl font-extrabold tracking-wider mb-2 text-center">PulseChain Genesis Forge</div>
        <div className="text-lg font-medium text-purple-200 pulse-tab mb-3 animate-gradient-x text-center">The Ultimate PRC20 Smart Contract Generator</div>
        <div className="flex items-center gap-2 text-xs text-purple-300 font-mono bg-black/40 px-4 py-2 rounded-full border border-purple-700/40 animate-fade-in mt-1">
          <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
          {/* Updated tagline, removed '100% On-Chain' and improved spacing */}
          No Coding Required &bull; PulseChain Ready
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <Card className="pulse-gradient-border pulse-glass w-full px-0 py-0 md:px-6 md:py-8">
          <CardHeader className="pb-2">
            <CardTitle className="pulse-title text-2xl font-bold flex flex-col items-center gap-2 text-center">
              <span>Smart Contract Generator</span>
              <span className="text-xs px-3 py-1 rounded bg-purple-900/40 border border-purple-500/30 text-purple-200 font-mono pulse-tab mt-1">
                {contractType === 'noTax' ? 'Standard PRC20 (No Tax)' : contractType ? contractType.charAt(0).toUpperCase() + contractType.slice(1) + ' Layout' : 'Custom'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-8 md:gap-10">
              <StepIndicator activeTab={activeTab} />
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <TabsContent value="settings" className="mt-0 border-none">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Token Name</Label>
                        <Input
                          value={settings.tokenName}
                          onChange={(e) => handleSettingsChange('tokenName', e.target.value)}
                          className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                        />
                      </div>

                      <div>
                        <Label>Token Symbol</Label>
                        <Input
                          value={settings.tokenSymbol}
                          onChange={(e) => handleSettingsChange('tokenSymbol', e.target.value)}
                          className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Total Supply</Label>
                        <Input
                          type="text"
                          value={settings.totalSupply}
                          onChange={(e) => handleSettingsChange('totalSupply', e.target.value)}
                          className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                        />
                      </div>

                      <div>
                        <Label>Decimals</Label>
                        <Input
                          type="number"
                          value={settings.decimals}
                          onChange={(e) => handleSettingsChange('decimals', parseInt(e.target.value))}
                          className="bg-black/50 border-purple-500/20 focus:border-purple-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setActiveTab('security')} className="pulse-glow-btn">
                      Next: Security Features
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0 border-none">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 pulse-tab">Security Features</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(settings.securityFeatures).map(([feature, enabled]) => (
                          <div key={feature} className="flex items-center space-x-4 p-4 rounded-lg pulse-feature">
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => handleSecurityFeatureToggle(feature as keyof SecurityFeatures)}
                            />
                            <div>
                              <h3 className="font-medium pulse-tab">{feature.charAt(0).toUpperCase() + feature.slice(1)}</h3>
                              <p className="text-sm text-gray-400">{getFeatureDescription(feature)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Max Transaction Limit</Label>
                              <span className="text-sm text-gray-400">{advancedSettings.maxTxLimit}% of supply</span>
                            </div>
                            <Slider
                              value={[advancedSettings.maxTxLimit]}
                              onValueChange={([value]) => handleAdvancedSettingChange('maxTxLimit', value)}
                              min={0.1}
                              max={5}
                              step={0.1}
                              className={cn(
                                "w-full",
                                !settings.securityFeatures.antiWhale && "opacity-50 pointer-events-none"
                              )}
                            />
                            <p className="text-xs text-gray-500">Maximum tokens per transaction (as % of total supply)</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Max Wallet Limit</Label>
                              <span className="text-sm text-gray-400">{advancedSettings.maxWalletLimit}% of supply</span>
                            </div>
                            <Slider
                              value={[advancedSettings.maxWalletLimit]}
                              onValueChange={([value]) => handleAdvancedSettingChange('maxWalletLimit', value)}
                              min={0.1}
                              max={5}
                              step={0.1}
                              className={cn(
                                "w-full",
                                !settings.securityFeatures.antiWhale && "opacity-50 pointer-events-none"
                              )}
                            />
                            <p className="text-xs text-gray-500">Maximum tokens per wallet (as % of total supply)</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Trading Cooldown</Label>
                              <span className="text-sm text-gray-400">{advancedSettings.tradingCooldown} seconds</span>
                            </div>
                            <Slider
                              value={[advancedSettings.tradingCooldown]}
                              onValueChange={([value]) => handleAdvancedSettingChange('tradingCooldown', value)}
                              min={0}
                              max={300}
                              step={1}
                            />
                            <p className="text-xs text-gray-500">Time between trades for the same wallet</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab('settings')}>
                        Back to Settings
                      </Button>
                      <Button onClick={() => setActiveTab('code')} className="pulse-glow-btn">
                        Next: Generate Code
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-0 border-none">
                  <div className="space-y-6">
                    <div className="flex justify-center mb-4">
                      <Button onClick={generateContract} className="pulse-glow-btn animate-pulse">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Smart Contract
                      </Button>
                    </div>

                    {generatedCode && (
                      <div className="relative">
                        <pre className="p-4 rounded-lg bg-black/70 border border-purple-500/20 overflow-x-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-500/20">
                          <code className="text-sm text-gray-300 font-mono">{generatedCode}</code>
                        </pre>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            size="icon"
                            className="bg-black/50"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={downloadContract}
                            variant="outline"
                            size="icon"
                            className="bg-black/50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('security')}>
                        Back to Security
                      </Button>
                      {generatedCode && (
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={copyToClipboard}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </Button>
                          <Button variant="outline" onClick={downloadContract}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Contract
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        {/* Resources Section */}
        <div className="mt-12">
          <ResourcesSection />
        </div>
        {/* Token Analytics section moved directly below ResourcesSection for better flow */}
        <div className="mt-12">
          <div className="pulse-title text-xl font-bold mb-4 text-center">Token Analytics</div>
          <div className="pulse-glass p-6">
            {/* If you have a TokenAnalyticsDashboard component, render it here */}
            {/* <TokenAnalyticsDashboard ...props /> */}
            <p className="text-purple-200 text-center">Token analytics and charts will appear here after contract generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCodeGenerator;
