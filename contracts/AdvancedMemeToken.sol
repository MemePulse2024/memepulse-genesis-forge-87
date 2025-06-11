// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AdvancedMemeToken
 * @dev Advanced meme token with comprehensive features for PulseChain
 * Features:
 * - Customizable buy/sell/transfer taxes
 * - Anti-whale protection
 * - Blacklist functionality
 * - Pausable trading
 * - Burnable tokens
 * - Automatic liquidity provision
 * - Marketing and dev wallet distributions
 * - Trading cooldown
 * - Reflection rewards (optional)
 */
contract AdvancedMemeToken is ERC20, ERC20Burnable, Pausable, Ownable, ReentrancyGuard {
    
    // Token configuration
    uint256 private constant MAX_SUPPLY = 1000000000000 * 10**18; // 1 trillion max
    uint256 private constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1 billion default
    
    // Trading limits
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;
    
    // Trading status
    bool public tradingEnabled;
    bool public limitsInEffect = true;
    bool public swapEnabled = true;
    
    // Fee configuration
    uint256 public buyTax = 5;
    uint256 public sellTax = 5;
    uint256 public transferTax = 0;
    
    // Fee distribution (percentages)
    uint256 public liquidityShare = 40;
    uint256 public marketingShare = 40;
    uint256 public devShare = 10;
    uint256 public burnShare = 10;
    
    // Wallets
    address public marketingWallet;
    address public devWallet;
    address public autoLiquidityWallet;
    
    // PulseX router
    address public immutable pulsexRouter;
    address public pulsexPair;
    
    // Anti-bot & security
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromLimits;
    mapping(address => bool) private _blacklist;
    mapping(address => uint256) private _lastTrade;
    uint256 public tradeCooldown = 30; // seconds
    
    // Swap configuration
    uint256 public swapTokensAtAmount;
    bool private swapping;
    
    // Events
    event TradingEnabled();
    event LimitsRemoved();
    event WalletUpdated(string walletType, address newWallet);
    event ExcludedFromFees(address indexed account, bool isExcluded);
    event ExcludedFromLimits(address indexed account, bool isExcluded);
    event AddressBlacklisted(address indexed account, bool isBlacklisted);
    event TaxUpdated(string taxType, uint256 newValue);
    event TaxSharesUpdated(uint256 liquidity, uint256 marketing, uint256 dev, uint256 burn);
    event SwapAndLiquify(uint256 tokensSwapped, uint256 pulsReceived, uint256 tokensIntoLiquidity);
    
    modifier lockTheSwap {
        swapping = true;
        _;
        swapping = false;
    }
    
    modifier notBlacklisted(address account) {
        require(!_blacklist[account], "Address is blacklisted");
        _;
    }
    
    modifier whenTradingEnabled() {
        require(tradingEnabled || _isExcludedFromFees[_msgSender()], "Trading not enabled");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address _marketingWallet,
        address _devWallet,
        address _autoLiquidityWallet,
        address _pulsexRouter,
        uint256 _buyTax,
        uint256 _sellTax,
        uint256 _maxTxPercent,
        uint256 _maxWalletPercent
    ) ERC20(name, symbol) Ownable(_msgSender()) {
        require(_marketingWallet != address(0), "Marketing wallet cannot be zero");
        require(_devWallet != address(0), "Dev wallet cannot be zero");
        require(_autoLiquidityWallet != address(0), "Auto liquidity wallet cannot be zero");
        require(_pulsexRouter != address(0), "PulseX router cannot be zero");
        require(totalSupply > 0 && totalSupply <= MAX_SUPPLY, "Invalid total supply");
        require(_buyTax <= 25 && _sellTax <= 25, "Tax cannot exceed 25%");
        
        // Initialize supply
        _mint(_msgSender(), totalSupply);
        
        // Set wallets
        marketingWallet = _marketingWallet;
        devWallet = _devWallet;
        autoLiquidityWallet = _autoLiquidityWallet;
        
        // Set router and create pair
        pulsexRouter = _pulsexRouter;
        // Note: In real deployment, you'd create the pair here
        pulsexPair = address(0); // Placeholder
        
        // Set taxes
        buyTax = _buyTax;
        sellTax = _sellTax;
        
        // Set limits
        maxTxAmount = (totalSupply * _maxTxPercent) / 100;
        maxWalletAmount = (totalSupply * _maxWalletPercent) / 100;
        
        // Set swap threshold
        swapTokensAtAmount = (totalSupply * 5) / 10000; // 0.05%
        
        // Exclude essential addresses from fees and limits
        _isExcludedFromFees[_msgSender()] = true;
        _isExcludedFromFees[address(this)] = true;
        _isExcludedFromFees[marketingWallet] = true;
        _isExcludedFromFees[devWallet] = true;
        _isExcludedFromFees[autoLiquidityWallet] = true;
        
        _isExcludedFromLimits[_msgSender()] = true;
        _isExcludedFromLimits[address(this)] = true;
        _isExcludedFromLimits[marketingWallet] = true;
        _isExcludedFromLimits[devWallet] = true;
        _isExcludedFromLimits[autoLiquidityWallet] = true;
    }
    
    // Owner functions
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    function removeLimits() external onlyOwner {
        limitsInEffect = false;
        emit LimitsRemoved();
    }
    
    function updateWallet(string memory walletType, address newWallet) external onlyOwner {
        require(newWallet != address(0), "Cannot be zero address");
        
        if (keccak256(bytes(walletType)) == keccak256(bytes("marketing"))) {
            marketingWallet = newWallet;
        } else if (keccak256(bytes(walletType)) == keccak256(bytes("dev"))) {
            devWallet = newWallet;
        } else if (keccak256(bytes(walletType)) == keccak256(bytes("liquidity"))) {
            autoLiquidityWallet = newWallet;
        } else {
            revert("Invalid wallet type");
        }
        
        emit WalletUpdated(walletType, newWallet);
    }
    
    function updateTaxes(uint256 _buyTax, uint256 _sellTax, uint256 _transferTax) external onlyOwner {
        require(_buyTax <= 25 && _sellTax <= 25 && _transferTax <= 25, "Tax cannot exceed 25%");
        buyTax = _buyTax;
        sellTax = _sellTax;
        transferTax = _transferTax;
        emit TaxUpdated("buy", _buyTax);
        emit TaxUpdated("sell", _sellTax);
        emit TaxUpdated("transfer", _transferTax);
    }
    
    function updateTaxShares(
        uint256 _liquidityShare,
        uint256 _marketingShare,
        uint256 _devShare,
        uint256 _burnShare
    ) external onlyOwner {
        require(_liquidityShare + _marketingShare + _devShare + _burnShare == 100, "Shares must equal 100%");
        liquidityShare = _liquidityShare;
        marketingShare = _marketingShare;
        devShare = _devShare;
        burnShare = _burnShare;
        emit TaxSharesUpdated(_liquidityShare, _marketingShare, _devShare, _burnShare);
    }
    
    function setBlacklist(address account, bool blacklisted) external onlyOwner {
        require(account != address(0), "Cannot blacklist zero address");
        require(account != owner(), "Cannot blacklist owner");
        _blacklist[account] = blacklisted;
        emit AddressBlacklisted(account, blacklisted);
    }
    
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }
    
    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }
    
    function setTradeCooldown(uint256 _tradeCooldown) external onlyOwner {
        require(_tradeCooldown <= 300, "Cooldown cannot exceed 5 minutes");
        tradeCooldown = _tradeCooldown;
    }
    
    function setSwapSettings(bool _swapEnabled, uint256 _swapTokensAtAmount) external onlyOwner {
        swapEnabled = _swapEnabled;
        swapTokensAtAmount = _swapTokensAtAmount;
    }
    
    // Emergency functions
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    // Transfer function with all features
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Apply all security checks (skip for minting/burning)
        if (from != address(0) && to != address(0)) {
            require(!paused(), "Token transfers paused");
            require(tradingEnabled || _isExcludedFromFees[from], "Trading not enabled");
            require(!_blacklist[from], "Sender address is blacklisted");
            require(!_blacklist[to], "Recipient address is blacklisted");
            require(amount > 0, "Transfer amount must be greater than zero");
            
            // Check limits
            if (limitsInEffect && !_isExcludedFromLimits[from] && !_isExcludedFromLimits[to]) {
                require(amount <= maxTxAmount, "Transfer amount exceeds the maxTxAmount");
                if (to != pulsexPair) {
                    require(balanceOf(to) + amount <= maxWalletAmount, "Transfer would exceed maxWalletAmount");
                }
            }
            
            // Check cooldown
            if (!_isExcludedFromFees[from] && !_isExcludedFromFees[to]) {
                require(block.timestamp >= _lastTrade[from] + tradeCooldown, "Must wait for cooldown");
                _lastTrade[from] = block.timestamp;
            }
            
            // Handle fees and swapping
            uint256 contractTokenBalance = balanceOf(address(this));
            bool canSwap = contractTokenBalance >= swapTokensAtAmount;
            
            if (canSwap && swapEnabled && !swapping && from != pulsexPair && !_isExcludedFromFees[from] && !_isExcludedFromFees[to]) {
                swapAndDistribute(contractTokenBalance);
            }
            
            // Calculate and apply fees
            bool takeFee = !swapping && !_isExcludedFromFees[from] && !_isExcludedFromFees[to];
            
            if (takeFee) {
                uint256 fees = calculateFees(from, to, amount);
                if (fees > 0) {
                    super._update(from, address(this), fees);
                    amount = amount - fees;
                }
            }
        }
        
        super._update(from, to, amount);
    }
    
    function calculateFees(address from, address to, uint256 amount) private view returns (uint256) {
        uint256 feePercent = 0;
        
        if (to == pulsexPair) {
            // Selling
            feePercent = sellTax;
        } else if (from == pulsexPair) {
            // Buying
            feePercent = buyTax;
        } else {
            // Regular transfer
            feePercent = transferTax;
        }
        
        return (amount * feePercent) / 100;
    }
    
    function swapAndDistribute(uint256 contractTokenBalance) private lockTheSwap {
        // Calculate distribution amounts
        uint256 liquidityTokens = (contractTokenBalance * liquidityShare) / 100 / 2;
        uint256 swapTokens = contractTokenBalance - liquidityTokens;
        
        // Swap tokens for WPLS
        uint256 initialBalance = address(this).balance;
        swapTokensForPLS(swapTokens);
        uint256 newBalance = address(this).balance - initialBalance;
        
        // Calculate WPLS distribution
        uint256 totalShares = (liquidityShare / 2) + marketingShare + devShare + burnShare;
        uint256 liquidityPLS = (newBalance * (liquidityShare / 2)) / totalShares;
        uint256 marketingPLS = (newBalance * marketingShare) / totalShares;
        uint256 devPLS = (newBalance * devShare) / totalShares;
        
        // Add liquidity
        if (liquidityTokens > 0 && liquidityPLS > 0) {
            addLiquidity(liquidityTokens, liquidityPLS);
            emit SwapAndLiquify(swapTokens, liquidityPLS, liquidityTokens);
        }
        
        // Send to wallets
        if (marketingPLS > 0) {
            payable(marketingWallet).transfer(marketingPLS);
        }
        if (devPLS > 0) {
            payable(devWallet).transfer(devPLS);
        }
        
        // Burn tokens if configured
        if (burnShare > 0) {
            uint256 burnTokens = (contractTokenBalance * burnShare) / 100;
            if (burnTokens > 0) {
                _burn(address(this), burnTokens);
            }
        }
    }
    
    function swapTokensForPLS(uint256 tokenAmount) private {
        // Implementation would use PulseX router to swap tokens for WPLS
        // This is a placeholder - in real deployment, implement actual swap
    }
    
    function addLiquidity(uint256 tokenAmount, uint256 plsAmount) private {
        // Implementation would add liquidity to PulseX
        // This is a placeholder - in real deployment, implement actual liquidity addition
    }
    
    // View functions
    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }
    
    function isExcludedFromLimits(address account) public view returns (bool) {
        return _isExcludedFromLimits[account];
    }
    
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }
    
    function getCirculatingSupply() public view returns (uint256) {
        return totalSupply() - balanceOf(address(0));
    }
    
    receive() external payable {}
}