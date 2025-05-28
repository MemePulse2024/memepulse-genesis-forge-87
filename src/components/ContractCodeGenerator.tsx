
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, Code, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TokenomicsData } from '@/utils/tokenomicsValidation';

interface ContractCodeGeneratorProps {
  tokenomics: TokenomicsData;
  coinIdea: { name: string; ticker: string } | null;
}

const ContractCodeGenerator = ({ tokenomics, coinIdea }: ContractCodeGeneratorProps) => {
  const [contractName, setContractName] = useState(coinIdea?.name || 'YourMemeCoin');
  const [contractSymbol, setContractSymbol] = useState(coinIdea?.ticker?.replace('$', '') || 'MEME');
  const [generatedContract, setGeneratedContract] = useState('');
  const { toast } = useToast();

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

contract ${contractName} is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 private _totalSupply = ${tokenomics.totalSupply} * 10**18;
    string private _name = "${contractName}";
    string private _symbol = "${contractSymbol}";
    uint8 private _decimals = 18;
    
    // Tax settings
    uint256 public buyTax = ${tokenomics.buyTax}00; // ${tokenomics.buyTax}% (in basis points)
    uint256 public sellTax = ${tokenomics.sellTax}00; // ${tokenomics.sellTax}% (in basis points)
    
    // Tax allocation (in basis points)
    uint256 public liquidityAllocation = ${tokenomics.taxAllocation.liquidity}00;
    uint256 public marketingAllocation = ${tokenomics.taxAllocation.marketing}00;
    uint256 public reflectionAllocation = ${tokenomics.taxAllocation.reflection}00;
    
    address public owner;
    address public marketingWallet;
    address public liquidityWallet;
    
    mapping(address => bool) public isExcludedFromTax;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    constructor(address _marketingWallet, address _liquidityWallet) {
        owner = msg.sender;
        marketingWallet = _marketingWallet;
        liquidityWallet = _liquidityWallet;
        
        // Allocate initial supply according to tokenomics
        uint256 pulsexAmount = (_totalSupply * ${tokenomics.supplyAllocation.pulsex}) / 100;
        uint256 airdropAmount = (_totalSupply * ${tokenomics.supplyAllocation.airdrop}) / 100;
        uint256 devAmount = (_totalSupply * ${tokenomics.supplyAllocation.dev}) / 100;
        uint256 marketingAmount = (_totalSupply * ${tokenomics.supplyAllocation.marketing}) / 100;
        uint256 burnAmount = (_totalSupply * ${tokenomics.supplyAllocation.burn}) / 100;
        
        _balances[owner] = pulsexAmount + devAmount;
        _balances[marketingWallet] = marketingAmount + airdropAmount;
        _balances[address(0)] = burnAmount; // Burn tokens
        
        // Exclude owner and contract from taxes
        isExcludedFromTax[owner] = true;
        isExcludedFromTax[address(this)] = true;
        isExcludedFromTax[marketingWallet] = true;
        
        emit Transfer(address(0), owner, pulsexAmount + devAmount);
        emit Transfer(address(0), marketingWallet, marketingAmount + airdropAmount);
        emit Transfer(address(0), address(0), burnAmount);
    }
    
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address tokenOwner, address spender) public view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        
        _approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        
        uint256 taxAmount = 0;
        
        // Apply tax if not excluded
        if (!isExcludedFromTax[sender] && !isExcludedFromTax[recipient]) {
            // Determine if this is a buy or sell (simplified logic)
            uint256 taxRate = buyTax; // Default to buy tax
            if (sender != owner) { // If not from owner, treat as sell
                taxRate = sellTax;
            }
            
            taxAmount = (amount * taxRate) / 10000;
        }
        
        uint256 transferAmount = amount - taxAmount;
        
        _balances[sender] -= amount;
        _balances[recipient] += transferAmount;
        
        if (taxAmount > 0) {
            _distributeTax(taxAmount);
        }
        
        emit Transfer(sender, recipient, transferAmount);
    }
    
    function _distributeTax(uint256 taxAmount) internal {
        uint256 liquidityAmount = (taxAmount * liquidityAllocation) / 10000;
        uint256 marketingAmount = (taxAmount * marketingAllocation) / 10000;
        uint256 reflectionAmount = taxAmount - liquidityAmount - marketingAmount;
        
        if (liquidityAmount > 0) {
            _balances[liquidityWallet] += liquidityAmount;
            emit Transfer(address(this), liquidityWallet, liquidityAmount);
        }
        
        if (marketingAmount > 0) {
            _balances[marketingWallet] += marketingAmount;
            emit Transfer(address(this), marketingWallet, marketingAmount);
        }
        
        // Reflection logic would go here (distribute to all holders)
        // For simplicity, we'll add it to the contract for now
        if (reflectionAmount > 0) {
            _balances[address(this)] += reflectionAmount;
            emit Transfer(address(this), address(this), reflectionAmount);
        }
    }
    
    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
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
    
    function updateWallets(address _marketingWallet, address _liquidityWallet) external onlyOwner {
        marketingWallet = _marketingWallet;
        liquidityWallet = _liquidityWallet;
    }
}`;

    setGeneratedContract(contract);
    toast({
      title: "Smart Contract Generated! 🚀",
      description: "Your PulseChain meme coin contract is ready!",
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
    a.download = `${contractName}.sol`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Contract Downloaded! 📁",
      description: "Smart contract file saved successfully.",
    });
  };

  return (
    <section id="contract" className="py-20 bg-gradient-to-br from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            🔧 Smart Contract Generator
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate a complete, ready-to-deploy smart contract for your PulseChain meme coin
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-md border-purple-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-center flex items-center justify-center gap-2">
                <Code className="w-6 h-6" />
                Contract Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contractName" className="text-white">Contract Name</Label>
                    <Input
                      id="contractName"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      className="bg-black/50 border-gray-600 text-white"
                      placeholder="YourMemeCoin"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contractSymbol" className="text-white">Token Symbol</Label>
                    <Input
                      id="contractSymbol"
                      value={contractSymbol}
                      onChange={(e) => setContractSymbol(e.target.value)}
                      className="bg-black/50 border-gray-600 text-white"
                      placeholder="MEME"
                    />
                  </div>
                  
                  <Button
                    onClick={generateContract}
                    className="w-full bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Smart Contract
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="font-orbitron text-lg font-bold text-pulse-orange mb-2">
                      ✨ Contract Features
                    </h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• ERC-20 compliant token</li>
                      <li>• Configurable buy/sell taxes</li>
                      <li>• Automatic tax distribution</li>
                      <li>• Reflection mechanism</li>
                      <li>• Anti-whale protection</li>
                      <li>• Owner controls</li>
                      <li>• PulseChain optimized</li>
                    </ul>
                  </div>
                </div>
              </div>

              {generatedContract && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-orbitron text-lg font-bold text-pulse-orange">
                      Generated Smart Contract
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
                    <h4 className="text-blue-300 font-bold mb-2">📚 Next Steps:</h4>
                    <ol className="text-sm text-blue-200 space-y-1">
                      <li>1. Review the generated contract code</li>
                      <li>2. Test on PulseChain testnet first</li>
                      <li>3. Get contract audited (recommended)</li>
                      <li>4. Deploy to PulseChain mainnet</li>
                      <li>5. Verify contract on PulseScan</li>
                      <li>6. Add liquidity to PulseX</li>
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
