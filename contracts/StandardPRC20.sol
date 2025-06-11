// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StandardPRC20
 * @dev A standard PRC20 token with no taxes, designed for PulseChain
 * Features:
 * - Standard ERC20 functionality
 * - Ownership controls
 * - Reentrancy protection
 * - Minting capability for owner
 * - Emergency pause functionality
 */
contract StandardPRC20 is ERC20, Ownable, ReentrancyGuard {
    bool public tradingEnabled;
    bool public mintingFinished;
    
    mapping(address => bool) public isExcludedFromTransferLimits;
    
    uint256 public maxTransactionAmount;
    uint256 public maxWalletAmount;
    
    event TradingEnabled();
    event MintingFinished();
    event MaxTransactionAmountUpdated(uint256 newAmount);
    event MaxWalletAmountUpdated(uint256 newAmount);
    event ExcludedFromTransferLimits(address indexed account, bool excluded);
    
    modifier whenTradingEnabled() {
        require(tradingEnabled || isExcludedFromTransferLimits[_msgSender()], "Trading not enabled");
        _;
    }
    
    modifier whenMintingAllowed() {
        require(!mintingFinished, "Minting has been finished");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address owner,
        uint256 _maxTransactionAmount,
        uint256 _maxWalletAmount
    ) ERC20(name, symbol) Ownable(owner) {
        require(totalSupply > 0, "Total supply must be greater than 0");
        require(owner != address(0), "Owner cannot be zero address");
        
        _mint(owner, totalSupply);
        
        maxTransactionAmount = _maxTransactionAmount;
        maxWalletAmount = _maxWalletAmount;
        
        // Exclude owner and contract from limits
        isExcludedFromTransferLimits[owner] = true;
        isExcludedFromTransferLimits[address(this)] = true;
        
        emit ExcludedFromTransferLimits(owner, true);
        emit ExcludedFromTransferLimits(address(this), true);
    }
    
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    function finishMinting() external onlyOwner {
        require(!mintingFinished, "Minting already finished");
        mintingFinished = true;
        emit MintingFinished();
    }
    
    function mint(address to, uint256 amount) external onlyOwner whenMintingAllowed {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
    }
    
    function setMaxTransactionAmount(uint256 _maxTransactionAmount) external onlyOwner {
        require(_maxTransactionAmount > 0, "Max transaction amount must be greater than 0");
        maxTransactionAmount = _maxTransactionAmount;
        emit MaxTransactionAmountUpdated(_maxTransactionAmount);
    }
    
    function setMaxWalletAmount(uint256 _maxWalletAmount) external onlyOwner {
        require(_maxWalletAmount > 0, "Max wallet amount must be greater than 0");
        maxWalletAmount = _maxWalletAmount;
        emit MaxWalletAmountUpdated(_maxWalletAmount);
    }
    
    function excludeFromTransferLimits(address account, bool excluded) external onlyOwner {
        require(account != address(0), "Cannot exclude zero address");
        isExcludedFromTransferLimits[account] = excluded;
        emit ExcludedFromTransferLimits(account, excluded);
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Check trading enabled (skip for minting/burning)
        if (from != address(0) && to != address(0)) {
            require(tradingEnabled || isExcludedFromTransferLimits[from], "Trading not enabled");
        }
        
        // Skip limits for minting/burning and excluded addresses
        if (from != address(0) && to != address(0) && 
            !isExcludedFromTransferLimits[from] && !isExcludedFromTransferLimits[to]) {
            
            // Check transaction limits
            if (maxTransactionAmount > 0) {
                require(amount <= maxTransactionAmount, "Transfer amount exceeds maximum");
            }
            
            // Check wallet limits
            if (maxWalletAmount > 0 && to != address(0)) {
                require(balanceOf(to) + amount <= maxWalletAmount, "Transfer would exceed maximum wallet amount");
            }
        }
        
        super._update(from, to, amount);
    }
    
    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    receive() external payable {}
}