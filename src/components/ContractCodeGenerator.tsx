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
  // Only include necessary imports based on enabled features
  const imports = [
    'pragma solidity ^0.8.19;',
    '',
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
    settings.securityFeatures.burnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : '',
    settings.securityFeatures.pausable ? 'import "@openzeppelin/contracts/security/Pausable.sol";' : '',
    'import "@openzeppelin/contracts/access/Ownable.sol";',
    'import "@openzeppelin/contracts/utils/math/SafeMath.sol";',
    settings.securityFeatures.reflection ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";' : '',
  ].filter(Boolean).join('\n');

  const contractName = settings.tokenName.replace(/\s+/g, '');
  
  // Only include enabled features in inheritance
  const inheritance = [
    'ERC20',
    settings.securityFeatures.burnable ? 'ERC20Burnable' : '',
    settings.securityFeatures.pausable ? 'Pausable' : '',
    'Ownable',
    settings.securityFeatures.reflection ? 'ERC20Votes' : ''
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
    ${settings.securityFeatures.reflection ? 'uint256 public reflectionShare;' : ''}
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
        uint256 liquidity,
        uint256 marketing,
        uint256 dev,
        ${settings.securityFeatures.reflection ? 'uint256 reflection,' : ''}
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
        ${settings.securityFeatures.reflection ? `reflectionShare = ${settings.reflectionShare || 10};` : ''}
        ${settings.securityFeatures.burnable ? `burnShare = ${settings.burnShare || 10};` : ''}
        
        // Set initial trading cooldown
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
    marketingShare: Number(tokenomics?.taxAllocation?.marketing || '30'),
    devShare: 10,
    reflectionShare: Number(tokenomics?.taxAllocation?.reflection || '10'),
    burnShare: Number(tokenomics?.taxAllocation?.burn || '10'),
    securityFeatures: {
      antiWhale: true,
      blacklist: true,
      pausable: true,
      reflection: true,
      burnable: true
    },
    tradingCooldown: 30,
    initialLiquidity: 80,
    uniswapRouter: '0x...',
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

  const generateContract = () => {
    try {
      const code = generateContractCode(settings);
      setGeneratedCode(code);
      setActiveTab('code');
      toast({
        title: "Contract Generated! 🎉",
        description: "Your smart contract has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Generating Contract",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
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
    <Card className="w-full bg-black/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Smart Contract Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 bg-gray-900/50 p-4 rounded-lg">
            <div className={cn(
              "flex items-center space-x-2 p-2 rounded-lg",
              activeTab === 'settings' ? "bg-purple-500/20" : "opacity-50"
            )}>
              <Settings className="w-4 h-4" />
              <span>1. Basic Settings</span>
            </div>
            <div className="h-px w-8 bg-gray-600" />
            <div className={cn(
              "flex items-center space-x-2 p-2 rounded-lg",
              activeTab === 'security' ? "bg-purple-500/20" : "opacity-50"
            )}>
              <Shield className="w-4 h-4" />
              <span>2. Security Features</span>
            </div>
            <div className="h-px w-8 bg-gray-600" />
            <div className={cn(
              "flex items-center space-x-2 p-2 rounded-lg",
              activeTab === 'code' ? "bg-purple-500/20" : "opacity-50"
            )}>
              <Code className="w-4 h-4" />
              <span>3. Generate Code</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
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
              <Button onClick={() => setActiveTab('security')} className="bg-gradient-to-r from-pulse-purple to-pulse-orange">
                Next: Security Features
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 border-none">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(settings.securityFeatures).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center space-x-4 p-4 rounded-lg border border-purple-500/20">
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleSecurityFeatureToggle(feature as keyof SecurityFeatures)}
                  />
                  <div>
                    <h3 className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}</h3>
                    <p className="text-sm text-gray-400">{getFeatureDescription(feature)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveTab('settings')}>
                Back to Settings
              </Button>
              <Button onClick={() => setActiveTab('code')} className="bg-gradient-to-r from-pulse-purple to-pulse-orange">
                Next: Generate Code
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-0 border-none">
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <Button onClick={generateContract} className="bg-gradient-to-r from-pulse-purple to-pulse-orange">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Smart Contract
                </Button>
              </div>

              {generatedCode && (
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-black/70 border border-purple-500/20 overflow-x-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-500/20">
                    <code className="text-sm text-gray-300">{generatedCode}</code>
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
      </CardContent>
    </Card>
  );
};

export default ContractCodeGenerator;
