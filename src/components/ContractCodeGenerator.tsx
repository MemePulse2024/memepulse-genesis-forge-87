import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Code, Zap, Shield, Settings, Coins, AlertTriangle, Cog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TokenomicsData } from '@/utils/tokenomicsValidation';

interface ContractCodeGeneratorProps {
  tokenomics: TokenomicsData;
  coinIdea: { name: string; ticker: string } | null;
}

interface ContractSettings {
  name: string;
  symbol: string;
  maxTxAmount: string;
  maxWalletAmount: string;
  antiWhaleEnabled: boolean;
  blacklistEnabled: boolean;
  pausableEnabled: boolean;
  mintableEnabled: boolean;
  burnableEnabled: boolean;
  reflectionEnabled: boolean;
  liquidityLockDays: number;
  version: 'standard' | 'advanced' | 'premium';
  gasFee: string;
  minimumTokensBeforeSwap: string;
}

const ContractCodeGenerator = ({ tokenomics, coinIdea }: ContractCodeGeneratorProps) => {
  const [contractSettings, setContractSettings] = useState<ContractSettings>({
    name: coinIdea?.name || 'YourMemeCoin',
    symbol: coinIdea?.ticker?.replace('$', '') || 'MEME',
    maxTxAmount: '1',
    maxWalletAmount: '2',
    antiWhaleEnabled: true,
    blacklistEnabled: true,
    pausableEnabled: true,
    mintableEnabled: false,
    burnableEnabled: true,
    reflectionEnabled: true,
    liquidityLockDays: 365,
    version: 'standard',
    gasFee: '300000',
    minimumTokensBeforeSwap: '0.05'
  });

  const [generatedContract, setGeneratedContract] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  // Auto-update contract name and symbol when coinIdea changes
  useEffect(() => {
    if (coinIdea) {
      setContractSettings(prev => ({
        ...prev,
        name: coinIdea.name,
        symbol: coinIdea.ticker?.replace('$', '') || prev.symbol
      }));
    }
  }, [coinIdea]);

  const generateContract = () => {
    const contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        _transferOwnership(_msgSender());
    }
    
    function owner() public view virtual returns (address) {
        return _owner;
    }
    
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
    
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }
    
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

${contractSettings.pausableEnabled ? `
abstract contract Pausable is Context {
    event Paused(address account);
    event Unpaused(address account);
    
    bool private _paused;
    
    constructor() {
        _paused = false;
    }
    
    function paused() public view virtual returns (bool) {
        return _paused;
    }
    
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }
    
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }
    
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}
` : ''}

contract ${contractSettings.name} is IERC20, IERC20Metadata, Ownable${contractSettings.pausableEnabled ? ', Pausable' : ''} {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    ${contractSettings.blacklistEnabled ? 'mapping(address => bool) private _blacklisted;' : ''}
    ${contractSettings.reflectionEnabled ? `
    mapping(address => bool) private _isExcludedFromReflection;
    address[] private _excludedFromReflection;
    uint256 private _reflectionTotal;
    uint256 private _totalFees;` : ''}
    
    uint256 private _totalSupply = ${tokenomics.totalSupply} * 10**18;
    string private _name = "${contractSettings.name}";
    string private _symbol = "${contractSettings.symbol}";
    uint8 private _decimals = 18;
    
    // Tax settings
    uint256 public buyTax = ${tokenomics.buyTax}00; // ${tokenomics.buyTax}% (in basis points)
    uint256 public sellTax = ${tokenomics.sellTax}00; // ${tokenomics.sellTax}% (in basis points)
    
    // Tax allocation (in basis points)
    uint256 public liquidityAllocation = ${tokenomics.taxAllocation.liquidity}00;
    uint256 public marketingAllocation = ${tokenomics.taxAllocation.marketing}00;
    uint256 public reflectionAllocation = ${tokenomics.taxAllocation.reflection}00;
    
    // Anti-whale settings
    ${contractSettings.antiWhaleEnabled ? `
    uint256 public maxTransactionAmount = (_totalSupply * ${contractSettings.maxTxAmount}00) / 10000; // ${contractSettings.maxTxAmount}%
    uint256 public maxWalletAmount = (_totalSupply * ${contractSettings.maxWalletAmount}00) / 10000; // ${contractSettings.maxWalletAmount}%` : ''}
    
    // Contract settings
    uint256 public minimumTokensBeforeSwap = (_totalSupply * ${parseFloat(contractSettings.minimumTokensBeforeSwap) * 100}) / 10000;
    bool public swapAndLiquifyEnabled = true;
    bool private inSwapAndLiquify;
    
    address public marketingWallet;
    address public liquidityWallet;
    address public deadWallet = 0x000000000000000000000000000000000000dEaD;
    
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public automatedMarketMakerPairs;
    
    // Events
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(uint256 tokensSwapped, uint256 ethReceived, uint256 tokensIntoLiquidity);
    ${contractSettings.blacklistEnabled ? `
    event AddedToBlacklist(address indexed account);
    event RemovedFromBlacklist(address indexed account);` : ''}
    
    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }
    
    constructor(address _marketingWallet, address _liquidityWallet) {
        marketingWallet = _marketingWallet;
        liquidityWallet = _liquidityWallet;
        
        ${contractSettings.reflectionEnabled ? `
        _reflectionTotal = (~uint256(0) - (~uint256(0) % _totalSupply));` : ''}
        
        // Allocate initial supply according to tokenomics
        uint256 pulsexAmount = (_totalSupply * ${tokenomics.supplyAllocation.pulsex}) / 100;
        uint256 airdropAmount = (_totalSupply * ${tokenomics.supplyAllocation.airdrop}) / 100;
        uint256 devAmount = (_totalSupply * ${tokenomics.supplyAllocation.dev}) / 100;
        uint256 marketingAmount = (_totalSupply * ${tokenomics.supplyAllocation.marketing}) / 100;
        uint256 burnAmount = (_totalSupply * ${tokenomics.supplyAllocation.burn}) / 100;
        
        _balances[owner()] = pulsexAmount + devAmount;
        _balances[marketingWallet] = marketingAmount + airdropAmount;
        
        ${contractSettings.burnableEnabled ? '_balances[deadWallet] = burnAmount;' : '_balances[owner()] += burnAmount;'}
        
        // Exclude owner and contract from taxes
        isExcludedFromTax[owner()] = true;
        isExcludedFromTax[address(this)] = true;
        isExcludedFromTax[marketingWallet] = true;
        isExcludedFromTax[deadWallet] = true;
        
        emit Transfer(address(0), owner(), pulsexAmount + devAmount);
        emit Transfer(address(0), marketingWallet, marketingAmount + airdropAmount);
        emit Transfer(address(0), deadWallet, burnAmount);
    }
    
    // ERC20 Functions
    function name() public view override returns (string memory) {
        return _name;
    }
    
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        ${contractSettings.reflectionEnabled ? `
        if (_isExcludedFromReflection[account]) return _balances[account];
        return tokenFromReflection(_balances[account]);` : 'return _balances[account];'}
    }
    
    function transfer(address recipient, uint256 amount) public override ${contractSettings.pausableEnabled ? 'whenNotPaused' : ''} returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        
        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        
        _approve(sender, _msgSender(), currentAllowance - amount);
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        ${contractSettings.blacklistEnabled ? `
        require(!_blacklisted[sender] && !_blacklisted[recipient], "Address is blacklisted");` : ''}
        
        ${contractSettings.antiWhaleEnabled ? `
        // Anti-whale checks
        if (!isExcludedFromTax[sender] && !isExcludedFromTax[recipient]) {
            require(amount <= maxTransactionAmount, "Transfer amount exceeds the maxTransactionAmount");
            
            if (!automatedMarketMakerPairs[recipient]) {
                require(balanceOf(recipient) + amount <= maxWalletAmount, "Exceeds maximum wallet amount");
            }
        }` : ''}
        
        uint256 contractTokenBalance = balanceOf(address(this));
        bool overMinimumTokenBalance = contractTokenBalance >= minimumTokensBeforeSwap;
        
        if (overMinimumTokenBalance && !inSwapAndLiquify && swapAndLiquifyEnabled && automatedMarketMakerPairs[recipient]) {
            contractTokenBalance = minimumTokensBeforeSwap;
            swapAndLiquify(contractTokenBalance);
        }
        
        bool takeFee = true;
        
        if (isExcludedFromTax[sender] || isExcludedFromTax[recipient]) {
            takeFee = false;
        }
        
        _tokenTransfer(sender, recipient, amount, takeFee);
    }
    
    function _tokenTransfer(address sender, address recipient, uint256 amount, bool takeFee) private {
        uint256 taxAmount = 0;
        
        if (takeFee) {
            uint256 taxRate = buyTax;
            if (automatedMarketMakerPairs[sender]) {
                taxRate = buyTax;
            } else if (automatedMarketMakerPairs[recipient]) {
                taxRate = sellTax;
            }
            
            taxAmount = (amount * taxRate) / 10000;
        }
        
        uint256 transferAmount = amount - taxAmount;
        
        ${contractSettings.reflectionEnabled ? `
        if (_isExcludedFromReflection[sender] && !_isExcludedFromReflection[recipient]) {
            _transferFromExcluded(sender, recipient, amount, transferAmount, taxAmount);
        } else if (!_isExcludedFromReflection[sender] && _isExcludedFromReflection[recipient]) {
            _transferToExcluded(sender, recipient, amount, transferAmount, taxAmount);
        } else if (!_isExcludedFromReflection[sender] && !_isExcludedFromReflection[recipient]) {
            _transferStandard(sender, recipient, amount, transferAmount, taxAmount);
        } else {
            _transferBothExcluded(sender, recipient, amount, transferAmount, taxAmount);
        }` : `
        _balances[sender] -= amount;
        _balances[recipient] += transferAmount;
        
        if (taxAmount > 0) {
            _balances[address(this)] += taxAmount;
            emit Transfer(sender, address(this), taxAmount);
        }
        
        emit Transfer(sender, recipient, transferAmount);`}
    }
    
    ${contractSettings.reflectionEnabled ? `
    function _transferStandard(address sender, address recipient, uint256 tAmount, uint256 transferAmount, uint256 taxAmount) private {
        uint256 rAmount = reflectionFromToken(tAmount);
        uint256 rTransferAmount = reflectionFromToken(transferAmount);
        uint256 rTax = reflectionFromToken(taxAmount);
        
        _balances[sender] -= rAmount;
        _balances[recipient] += rTransferAmount;
        
        if (taxAmount > 0) {
            _reflectionTotal -= rTax;
            _totalFees += taxAmount;
            _balances[address(this)] += reflectionFromToken(taxAmount);
            emit Transfer(sender, address(this), taxAmount);
        }
        
        emit Transfer(sender, recipient, transferAmount);
    }
    
    function reflectionFromToken(uint256 tAmount) public view returns (uint256) {
        require(tAmount <= _totalSupply, "Amount must be less than supply");
        uint256 currentRate = _getRate();
        return tAmount * currentRate;
    }
    
    function tokenFromReflection(uint256 rAmount) public view returns (uint256) {
        require(rAmount <= _reflectionTotal, "Amount must be less than total reflections");
        uint256 currentRate = _getRate();
        return rAmount / currentRate;
    }
    
    function _getRate() private view returns (uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply / tSupply;
    }
    
    function _getCurrentSupply() private view returns (uint256, uint256) {
        uint256 rSupply = _reflectionTotal;
        uint256 tSupply = _totalSupply;
        
        for (uint256 i = 0; i < _excludedFromReflection.length; i++) {
            if (_balances[_excludedFromReflection[i]] > rSupply || _balances[_excludedFromReflection[i]] > tSupply) {
                return (_reflectionTotal, _totalSupply);
            }
            rSupply -= _balances[_excludedFromReflection[i]];
            tSupply -= _balances[_excludedFromReflection[i]];
        }
        
        if (rSupply < _reflectionTotal / _totalSupply) return (_reflectionTotal, _totalSupply);
        return (rSupply, tSupply);
    }` : ''}
    
    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        uint256 half = contractTokenBalance / 2;
        uint256 otherHalf = contractTokenBalance - half;
        
        // This is the amount of ETH/PLS we have
        uint256 initialBalance = address(this).balance;
        
        // Swap tokens for ETH/PLS
        swapTokensForEth(half);
        
        // How much ETH/PLS did we just swap into?
        uint256 newBalance = address(this).balance - initialBalance;
        
        // Add liquidity to PulseX
        addLiquidity(otherHalf, newBalance);
        
        emit SwapAndLiquify(half, newBalance, otherHalf);
    }
    
    function swapTokensForEth(uint256 tokenAmount) private {
        // Generate the PulseX pair path of token -> WPLS
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = 0xA1077a294dDE1B09bB078844df40758a5D0f9a27; // WPLS on PulseChain
        
        _approve(address(this), 0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02, tokenAmount); // PulseX Router
        
        // Make the swap (placeholder - implement with actual PulseX router)
        // IPulseXRouter(0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02).swapExactTokensForETHSupportingFeeOnTransferTokens(
        //     tokenAmount,
        //     0,
        //     path,
        //     address(this),
        //     block.timestamp
        // );
    }
    
    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        _approve(address(this), 0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02, tokenAmount);
        
        // Add the liquidity (placeholder - implement with actual PulseX router)
        // IPulseXRouter(0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02).addLiquidityETH{value: ethAmount}(
        //     address(this),
        //     tokenAmount,
        //     0,
        //     0,
        //     liquidityWallet,
        //     block.timestamp
        // );
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    // Owner functions
    function setTaxRates(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= 2500 && _sellTax <= 2500, "Tax cannot exceed 25%");
        buyTax = _buyTax;
        sellTax = _sellTax;
    }
    
    function excludeFromTax(address account, bool excluded) external onlyOwner {
        isExcludedFromTax[account] = excluded;
    }
    
    ${contractSettings.antiWhaleEnabled ? `
    function setMaxTransactionAmount(uint256 _maxTxAmount) external onlyOwner {
        require(_maxTxAmount >= (_totalSupply * 1) / 1000, "Cannot set maxTransactionAmount lower than 0.1%");
        maxTransactionAmount = _maxTxAmount;
    }
    
    function setMaxWalletAmount(uint256 _maxWalletAmount) external onlyOwner {
        require(_maxWalletAmount >= (_totalSupply * 5) / 1000, "Cannot set maxWalletAmount lower than 0.5%");
        maxWalletAmount = _maxWalletAmount;
    }` : ''}
    
    ${contractSettings.blacklistEnabled ? `
    function addToBlacklist(address account) external onlyOwner {
        _blacklisted[account] = true;
        emit AddedToBlacklist(account);
    }
    
    function removeFromBlacklist(address account) external onlyOwner {
        _blacklisted[account] = false;
        emit RemovedFromBlacklist(account);
    }
    
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklisted[account];
    }` : ''}
    
    ${contractSettings.pausableEnabled ? `
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }` : ''}
    
    ${contractSettings.mintableEnabled ? `
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }` : ''}
    
    ${contractSettings.burnableEnabled ? `
    function burn(uint256 amount) external {
        require(_balances[_msgSender()] >= amount, "ERC20: burn amount exceeds balance");
        _balances[_msgSender()] -= amount;
        _totalSupply -= amount;
        emit Transfer(_msgSender(), address(0), amount);
    }` : ''}
    
    function updateWallets(address _marketingWallet, address _liquidityWallet) external onlyOwner {
        marketingWallet = _marketingWallet;
        liquidityWallet = _liquidityWallet;
    }
    
    function setAutomatedMarketMakerPair(address pair, bool value) external onlyOwner {
        automatedMarketMakerPairs[pair] = value;
    }
    
    function setSwapAndLiquifyEnabled(bool _enabled) external onlyOwner {
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }
    
    function withdrawStuckTokens(address token) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
        }
    }
    
    receive() external payable {}
}`;

    setGeneratedContract(contract);
    toast({
      title: "Advanced Smart Contract Generated! 🚀",
      description: `Your ${contractSettings.version} PulseChain contract is ready with enhanced features!`,
    });
  };

  const copyContract = () => {
    navigator.clipboard.writeText(generatedContract);
    toast({
      title: "Contract Copied! 📋",
      description: "Smart contract code copied to clipboard.",
    });
  };

  const downloadContract = () => {
    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractSettings.name}.sol`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Contract Downloaded! 📁",
      description: "Smart contract file saved successfully.",
    });
  };

  const updateSetting = (key: keyof ContractSettings, value: any) => {
    setContractSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section id="contract" className="py-20 bg-gradient-to-br from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            🔧 Smart Contract Generator
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate a complete, feature-rich smart contract for your PulseChain meme coin with advanced settings
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-md border-purple-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-center flex items-center justify-center gap-2">
                <Code className="w-6 h-6" />
                Advanced Contract Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-gray-800/70 backdrop-blur-md border border-purple-500/20">
                  <TabsTrigger 
                    value="basic" 
                    className="text-white data-[state=active]:bg-blue-600/70 data-[state=active]:text-white flex items-center gap-2 py-3"
                  >
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">Basic Settings</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="text-white data-[state=active]:bg-red-600/70 data-[state=active]:text-white flex items-center gap-2 py-3"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold">Security Features</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="text-white data-[state=active]:bg-green-600/70 data-[state=active]:text-white flex items-center gap-2 py-3"
                  >
                    <Cog className="w-4 h-4" />
                    <span className="font-semibold">Advanced Options</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Coins className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-bold text-blue-300">Core Token Configuration</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="contractName" className="text-white font-medium">Contract Name</Label>
                          <Input
                            id="contractName"
                            value={contractSettings.name}
                            onChange={(e) => updateSetting('name', e.target.value)}
                            className="bg-black/50 border-blue-500/30 text-white mt-2"
                            placeholder="YourMemeCoin"
                          />
                          <p className="text-xs text-blue-300 mt-1">✨ Auto-synced with Idea Generator</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="contractSymbol" className="text-white font-medium">Token Symbol</Label>
                          <Input
                            id="contractSymbol"
                            value={contractSettings.symbol}
                            onChange={(e) => updateSetting('symbol', e.target.value)}
                            className="bg-black/50 border-blue-500/30 text-white mt-2"
                            placeholder="MEME"
                          />
                          <p className="text-xs text-blue-300 mt-1">✨ Auto-synced with Idea Generator</p>
                        </div>

                        <div>
                          <Label className="text-white font-medium">Contract Version</Label>
                          <Select value={contractSettings.version} onValueChange={(value) => updateSetting('version', value)}>
                            <SelectTrigger className="bg-black/50 border-blue-500/30 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="standard">🔷 Standard (Basic features)</SelectItem>
                              <SelectItem value="advanced">🔸 Advanced (Enhanced features)</SelectItem>
                              <SelectItem value="premium">💎 Premium (All features)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-blue-800/20 rounded-lg p-4 border border-blue-500/30">
                        <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          Basic Features Included
                        </h4>
                        <ul className="text-sm text-blue-200 space-y-1">
                          <li>• ERC-20 compliant token standard</li>
                          <li>• Configurable buy/sell tax rates</li>
                          <li>• Automatic tax distribution system</li>
                          <li>• PulseChain network optimized</li>
                          <li>• Gas efficient transactions</li>
                          <li>• Owner management functions</li>
                          <li>• Token transfer controls</li>
                          <li>• Emergency wallet functions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-red-400" />
                      <h3 className="text-xl font-bold text-red-300">Security & Protection Features</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <Label className="text-white font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                Anti-Whale Protection
                              </Label>
                              <p className="text-xs text-red-300">Prevents large transactions from manipulating price</p>
                            </div>
                            <Switch
                              checked={contractSettings.antiWhaleEnabled}
                              onCheckedChange={(checked) => updateSetting('antiWhaleEnabled', checked)}
                            />
                          </div>

                          {contractSettings.antiWhaleEnabled && (
                            <div className="space-y-4 pl-4 border-l-2 border-red-500/30">
                              <div>
                                <Label className="text-white text-sm">Max Transaction Amount (%)</Label>
                                <Slider
                                  value={[parseFloat(contractSettings.maxTxAmount)]}
                                  onValueChange={(value) => updateSetting('maxTxAmount', value[0].toString())}
                                  max={5}
                                  min={0.1}
                                  step={0.1}
                                  className="mt-2"
                                />
                                <p className="text-xs text-red-300 mt-1">{contractSettings.maxTxAmount}% of total supply per transaction</p>
                              </div>

                              <div>
                                <Label className="text-white text-sm">Max Wallet Amount (%)</Label>
                                <Slider
                                  value={[parseFloat(contractSettings.maxWalletAmount)]}
                                  onValueChange={(value) => updateSetting('maxWalletAmount', value[0].toString())}
                                  max={10}
                                  min={0.5}
                                  step={0.1}
                                  className="mt-2"
                                />
                                <p className="text-xs text-red-300 mt-1">{contractSettings.maxWalletAmount}% of total supply per wallet</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <div>
                            <Label className="text-white font-medium">Address Blacklist</Label>
                            <p className="text-xs text-red-300">Block malicious addresses from trading</p>
                          </div>
                          <Switch
                            checked={contractSettings.blacklistEnabled}
                            onCheckedChange={(checked) => updateSetting('blacklistEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <div>
                            <Label className="text-white font-medium">Emergency Pause</Label>
                            <p className="text-xs text-red-300">Ability to pause all token transfers</p>
                          </div>
                          <Switch
                            checked={contractSettings.pausableEnabled}
                            onCheckedChange={(checked) => updateSetting('pausableEnabled', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <div>
                            <Label className="text-white font-medium">Reflection Rewards</Label>
                            <p className="text-xs text-red-300">Automatic rewards for token holders</p>
                          </div>
                          <Switch
                            checked={contractSettings.reflectionEnabled}
                            onCheckedChange={(checked) => updateSetting('reflectionEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <div>
                            <Label className="text-white font-medium">Token Burning</Label>
                            <p className="text-xs text-red-300">Allow permanent token removal</p>
                          </div>
                          <Switch
                            checked={contractSettings.burnableEnabled}
                            onCheckedChange={(checked) => updateSetting('burnableEnabled', checked)}
                          />
                        </div>

                        <div className="bg-red-800/20 rounded-lg p-4 border border-red-500/30">
                          <Label className="text-white font-medium">Liquidity Lock Period</Label>
                          <Slider
                            value={[contractSettings.liquidityLockDays]}
                            onValueChange={(value) => updateSetting('liquidityLockDays', value[0])}
                            max={1095}
                            min={30}
                            step={30}
                            className="mt-2"
                          />
                          <p className="text-xs text-red-300 mt-1">{contractSettings.liquidityLockDays} days locked</p>
                        </div>

                        <div className="bg-red-700/20 rounded-lg p-3 border border-red-400/30">
                          <h4 className="text-red-300 font-bold mb-2 text-sm">🛡️ Security Benefits</h4>
                          <ul className="text-xs text-red-200 space-y-1">
                            <li>• Prevents pump and dump schemes</li>
                            <li>• Protects against flash loan attacks</li>
                            <li>• Blocks known malicious addresses</li>
                            <li>• Emergency response capabilities</li>
                            <li>• Automated holder rewards</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  <div className="bg-green-900/20 border-l-4 border-green-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cog className="w-5 h-5 text-green-400" />
                      <h3 className="text-xl font-bold text-green-300">Advanced Technical Settings</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-green-800/20 rounded-lg p-4 border border-green-500/30">
                          <Label htmlFor="gasFee" className="text-white font-medium">Gas Limit Optimization</Label>
                          <Input
                            id="gasFee"
                            value={contractSettings.gasFee}
                            onChange={(e) => updateSetting('gasFee', e.target.value)}
                            className="bg-black/50 border-green-500/30 text-white mt-2"
                            placeholder="300000"
                          />
                          <p className="text-xs text-green-300 mt-1">Recommended: 300,000 - 500,000 gas units</p>
                        </div>

                        <div className="bg-green-800/20 rounded-lg p-4 border border-green-500/30">
                          <Label className="text-white font-medium">Auto-Swap Threshold (%)</Label>
                          <Slider
                            value={[parseFloat(contractSettings.minimumTokensBeforeSwap)]}
                            onValueChange={(value) => updateSetting('minimumTokensBeforeSwap', value[0].toString())}
                            max={1}
                            min={0.01}
                            step={0.01}
                            className="mt-2"
                          />
                          <p className="text-xs text-green-300 mt-1">{contractSettings.minimumTokensBeforeSwap}% triggers automatic liquidity swap</p>
                        </div>

                        <div className="flex items-center justify-between bg-green-800/20 rounded-lg p-4 border border-green-500/30">
                          <div>
                            <Label className="text-white font-medium">Mintable Supply</Label>
                            <p className="text-xs text-green-300">Allow creating new tokens (use carefully)</p>
                          </div>
                          <Switch
                            checked={contractSettings.mintableEnabled}
                            onCheckedChange={(checked) => updateSetting('mintableEnabled', checked)}
                          />
                        </div>
                      </div>

                      <div className="bg-green-700/20 rounded-lg p-4 border border-green-400/30">
                        <h4 className="text-green-300 font-bold mb-3 flex items-center gap-2">
                          <Cog className="w-4 h-4" />
                          Advanced Capabilities
                        </h4>
                        <ul className="text-sm text-green-200 space-y-2">
                          <li>• Automated liquidity generation</li>
                          <li>• Dynamic tax rate adjustments</li>
                          <li>• Multi-signature wallet support</li>
                          <li>• Time-locked contract functions</li>
                          <li>• Cross-chain bridge compatibility</li>
                          <li>• Governance voting mechanisms</li>
                          <li>• Advanced staking protocols</li>
                          <li>• Flash loan attack protection</li>
                          <li>• MEV (front-running) protection</li>
                          <li>• Automated market maker integration</li>
                          <li>• Real-time analytics hooks</li>
                          <li>• Emergency recovery functions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-6 border-t border-gray-600">
                <Button
                  onClick={generateContract}
                  className="w-full bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple text-lg py-4 font-bold"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Generate {contractSettings.version.charAt(0).toUpperCase() + contractSettings.version.slice(1)} Smart Contract
                </Button>
              </div>

              {generatedContract && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-orbitron text-lg font-bold text-pulse-orange">
                      Generated Smart Contract ({contractSettings.version})
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyContract}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadContract}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    value={generatedContract}
                    readOnly
                    className="bg-black/50 border-gray-600 text-white min-h-[400px] font-mono text-xs"
                  />
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-300 font-bold mb-2">📚 Deployment Steps:</h4>
                    <ol className="text-sm text-blue-200 space-y-1">
                      <li>1. Review and test the generated contract code</li>
                      <li>2. Deploy to PulseChain testnet for testing</li>
                      <li>3. Get contract audited (highly recommended)</li>
                      <li>4. Deploy to PulseChain mainnet</li>
                      <li>5. Verify contract on PulseScan</li>
                      <li>6. Add liquidity to PulseX DEX</li>
                      <li>7. Lock liquidity for {contractSettings.liquidityLockDays} days</li>
                      <li>8. Set up marketing wallet and configure taxes</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContractCodeGenerator;
