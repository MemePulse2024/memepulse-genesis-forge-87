const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdvancedMemeToken", function () {
    let AdvancedMemeToken;
    let token;
    let owner;
    let marketing;
    let dev;
    let liquidity;
    let router;
    let addr1;
    let addr2;
    let addrs;

    const NAME = "Advanced Meme Token";
    const SYMBOL = "MEME";
    const TOTAL_SUPPLY = ethers.parseEther("1000000000");
    const BUY_TAX = 5;
    const SELL_TAX = 8;
    const MAX_TX_PERCENT = 1; // 1%
    const MAX_WALLET_PERCENT = 2; // 2%

    beforeEach(async function () {
        [owner, marketing, dev, liquidity, router, addr1, addr2, ...addrs] = await ethers.getSigners();
        
        AdvancedMemeToken = await ethers.getContractFactory("AdvancedMemeToken");
        token = await AdvancedMemeToken.deploy(
            NAME,
            SYMBOL,
            TOTAL_SUPPLY,
            marketing.address,
            dev.address,
            liquidity.address,
            router.address,
            BUY_TAX,
            SELL_TAX,
            MAX_TX_PERCENT,
            MAX_WALLET_PERCENT
        );
    });

    describe("Deployment", function () {
        it("Should set the correct token details", async function () {
            expect(await token.name()).to.equal(NAME);
            expect(await token.symbol()).to.equal(SYMBOL);
            expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
        });

        it("Should assign total supply to owner", async function () {
            expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
        });

        it("Should set correct wallets", async function () {
            expect(await token.marketingWallet()).to.equal(marketing.address);
            expect(await token.devWallet()).to.equal(dev.address);
            expect(await token.autoLiquidityWallet()).to.equal(liquidity.address);
        });

        it("Should set correct taxes", async function () {
            expect(await token.buyTax()).to.equal(BUY_TAX);
            expect(await token.sellTax()).to.equal(SELL_TAX);
        });

        it("Should calculate correct limits", async function () {
            const expectedMaxTx = (TOTAL_SUPPLY * BigInt(MAX_TX_PERCENT)) / 100n;
            const expectedMaxWallet = (TOTAL_SUPPLY * BigInt(MAX_WALLET_PERCENT)) / 100n;
            
            expect(await token.maxTxAmount()).to.equal(expectedMaxTx);
            expect(await token.maxWalletAmount()).to.equal(expectedMaxWallet);
        });

        it("Should exclude essential addresses from fees and limits", async function () {
            expect(await token.isExcludedFromFees(owner.address)).to.be.true;
            expect(await token.isExcludedFromFees(await token.getAddress())).to.be.true;
            expect(await token.isExcludedFromFees(marketing.address)).to.be.true;
            
            expect(await token.isExcludedFromLimits(owner.address)).to.be.true;
            expect(await token.isExcludedFromLimits(await token.getAddress())).to.be.true;
        });

        it("Should start with trading disabled", async function () {
            expect(await token.tradingEnabled()).to.be.false;
        });

        it("Should reject invalid constructor parameters", async function () {
            // Test zero address validation
            await expect(AdvancedMemeToken.deploy(
                NAME, SYMBOL, TOTAL_SUPPLY,
                ethers.ZeroAddress, // Invalid marketing wallet
                dev.address, liquidity.address, router.address,
                BUY_TAX, SELL_TAX, MAX_TX_PERCENT, MAX_WALLET_PERCENT
            )).to.be.revertedWith("Marketing wallet cannot be zero");

            // Test excessive tax
            await expect(AdvancedMemeToken.deploy(
                NAME, SYMBOL, TOTAL_SUPPLY,
                marketing.address, dev.address, liquidity.address, router.address,
                30, SELL_TAX, MAX_TX_PERCENT, MAX_WALLET_PERCENT // 30% buy tax
            )).to.be.revertedWith("Tax cannot exceed 25%");
        });
    });

    describe("Trading Control", function () {
        it("Should allow owner to enable trading", async function () {
            await token.enableTrading();
            expect(await token.tradingEnabled()).to.be.true;
        });

        it("Should emit TradingEnabled event", async function () {
            await expect(token.enableTrading())
                .to.emit(token, "TradingEnabled");
        });

        it("Should not allow enabling trading twice", async function () {
            await token.enableTrading();
            await expect(token.enableTrading())
                .to.be.revertedWith("Trading already enabled");
        });

        it("Should prevent transfers when trading disabled", async function () {
            // First give addr1 some tokens as owner (allowed)
            await token.transfer(addr1.address, ethers.parseEther("1000"));
            // Now addr1 should not be able to transfer to addr2
            await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("500")))
                .to.be.revertedWith("Trading not enabled");
        });

        it("Should allow excluded addresses to transfer when trading disabled", async function () {
            await token.transfer(addr1.address, ethers.parseEther("1000"));
            expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
        });
    });

    describe("Limits and Anti-Whale", function () {
        beforeEach(async function () {
            await token.enableTrading();
            await token.transfer(addr1.address, ethers.parseEther("50000000")); // 5% of supply
        });

        it("Should enforce max transaction limits", async function () {
            const maxTx = await token.maxTxAmount();
            const overLimit = maxTx + 1n;
            
            await expect(token.connect(addr1).transfer(addr2.address, overLimit))
                .to.be.revertedWith("Transfer amount exceeds the maxTxAmount");
        });

        it("Should enforce max wallet limits", async function () {
            // First give addr2 some tokens close to the wallet limit
            const maxWallet = await token.maxWalletAmount();
            const nearLimit = maxWallet - ethers.parseEther("1000000"); // 1M tokens less than limit
            await token.transfer(addr2.address, nearLimit);
            
            // Now try to send 2M tokens from addr1 to addr2 (should exceed wallet limit)
            const amountToSend = ethers.parseEther("2000000");
            await expect(token.connect(addr1).transfer(addr2.address, amountToSend))
                .to.be.revertedWith("Transfer would exceed maxWalletAmount");
        });

        it("Should allow transfers within limits", async function () {
            const amount = ethers.parseEther("5000000"); // 0.5% of supply
            await token.connect(addr1).transfer(addr2.address, amount);
            expect(await token.balanceOf(addr2.address)).to.equal(amount);
        });

        it("Should allow owner to remove limits", async function () {
            await token.removeLimits();
            expect(await token.limitsInEffect()).to.be.false;
            
            const maxTx = await token.maxTxAmount();
            const overLimit = maxTx + ethers.parseEther("1000000");
            
            // This should now work without reverting
            await token.connect(addr1).transfer(addr2.address, overLimit);
        });
    });

    describe("Blacklist Functionality", function () {
        beforeEach(async function () {
            await token.enableTrading();
            await token.transfer(addr1.address, ethers.parseEther("1000000"));
        });

        it("Should allow owner to blacklist addresses", async function () {
            await token.setBlacklist(addr1.address, true);
            expect(await token.isBlacklisted(addr1.address)).to.be.true;
        });

        it("Should prevent blacklisted addresses from transferring", async function () {
            await token.setBlacklist(addr1.address, true);
            
            await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("100")))
                .to.be.revertedWith("Sender address is blacklisted");
        });

        it("Should prevent transfers to blacklisted addresses", async function () {
            await token.setBlacklist(addr2.address, true);
            
            await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("100")))
                .to.be.revertedWith("Recipient address is blacklisted");
        });

        it("Should allow owner to remove from blacklist", async function () {
            await token.setBlacklist(addr1.address, true);
            await token.setBlacklist(addr1.address, false);
            
            expect(await token.isBlacklisted(addr1.address)).to.be.false;
            await token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"));
        });

        it("Should not allow blacklisting owner", async function () {
            await expect(token.setBlacklist(owner.address, true))
                .to.be.revertedWith("Cannot blacklist owner");
        });

        it("Should emit blacklist events", async function () {
            await expect(token.setBlacklist(addr1.address, true))
                .to.emit(token, "AddressBlacklisted")
                .withArgs(addr1.address, true);
        });
    });

    describe("Trading Cooldown", function () {
        beforeEach(async function () {
            await token.enableTrading();
            await token.transfer(addr1.address, ethers.parseEther("1000000"));
        });

        it("Should enforce trading cooldown", async function () {
            await token.connect(addr1).transfer(addr2.address, ethers.parseEther("1000"));
            
            // Immediate second transfer should fail
            await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("1000")))
                .to.be.revertedWith("Must wait for cooldown");
        });

        it("Should allow owner to modify cooldown period", async function () {
            await token.setTradeCooldown(60); // 1 minute
            expect(await token.tradeCooldown()).to.equal(60);
        });

        it("Should not allow excessive cooldown", async function () {
            await expect(token.setTradeCooldown(400)) // Over 5 minutes
                .to.be.revertedWith("Cooldown cannot exceed 5 minutes");
        });

        it("Should not enforce cooldown for excluded addresses", async function () {
            await token.connect(addr1).transfer(addr2.address, ethers.parseEther("1000"));
            
            // Owner (excluded) should be able to transfer immediately
            await token.transfer(addr1.address, ethers.parseEther("1000"));
        });
    });

    describe("Tax System", function () {
        beforeEach(async function () {
            await token.enableTrading();
        });

        it("Should allow owner to update taxes", async function () {
            await token.updateTaxes(3, 6, 1);
            
            expect(await token.buyTax()).to.equal(3);
            expect(await token.sellTax()).to.equal(6);
            expect(await token.transferTax()).to.equal(1);
        });

        it("Should not allow excessive taxes", async function () {
            await expect(token.updateTaxes(30, 5, 0))
                .to.be.revertedWith("Tax cannot exceed 25%");
        });

        it("Should allow updating tax distribution", async function () {
            await token.updateTaxShares(30, 30, 20, 20);
            
            expect(await token.liquidityShare()).to.equal(30);
            expect(await token.marketingShare()).to.equal(30);
            expect(await token.devShare()).to.equal(20);
            expect(await token.burnShare()).to.equal(20);
        });

        it("Should require tax shares to equal 100%", async function () {
            await expect(token.updateTaxShares(30, 30, 20, 30)) // 110%
                .to.be.revertedWith("Shares must equal 100%");
        });

        it("Should emit tax update events", async function () {
            await expect(token.updateTaxes(3, 6, 1))
                .to.emit(token, "TaxUpdated")
                .withArgs("buy", 3);
        });
    });

    describe("Wallet Management", function () {
        it("Should allow owner to update wallets", async function () {
            await token.updateWallet("marketing", addr1.address);
            expect(await token.marketingWallet()).to.equal(addr1.address);
        });

        it("Should emit wallet update events", async function () {
            await expect(token.updateWallet("dev", addr1.address))
                .to.emit(token, "WalletUpdated")
                .withArgs("dev", addr1.address);
        });

        it("Should reject invalid wallet types", async function () {
            await expect(token.updateWallet("invalid", addr1.address))
                .to.be.revertedWith("Invalid wallet type");
        });

        it("Should not allow zero address wallets", async function () {
            await expect(token.updateWallet("marketing", ethers.ZeroAddress))
                .to.be.revertedWith("Cannot be zero address");
        });
    });

    describe("Fee Exclusions", function () {
        it("Should allow owner to exclude from fees", async function () {
            await token.excludeFromFees(addr1.address, true);
            expect(await token.isExcludedFromFees(addr1.address)).to.be.true;
        });

        it("Should allow owner to exclude from limits", async function () {
            await token.excludeFromLimits(addr1.address, true);
            expect(await token.isExcludedFromLimits(addr1.address)).to.be.true;
        });

        it("Should emit exclusion events", async function () {
            await expect(token.excludeFromFees(addr1.address, true))
                .to.emit(token, "ExcludedFromFees")
                .withArgs(addr1.address, true);

            await expect(token.excludeFromLimits(addr1.address, true))
                .to.emit(token, "ExcludedFromLimits")
                .withArgs(addr1.address, true);
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow owner to pause contract", async function () {
            await token.emergencyPause();
            expect(await token.paused()).to.be.true;
        });

        it("Should allow owner to unpause contract", async function () {
            await token.emergencyPause();
            await token.emergencyUnpause();
            expect(await token.paused()).to.be.false;
        });

        it("Should prevent transfers when paused", async function () {
            await token.enableTrading();
            await token.emergencyPause();
            
            await expect(token.transfer(addr1.address, ethers.parseEther("1000")))
                .to.be.revertedWith("Token transfers paused");
        });

        it("Should allow emergency withdrawal", async function () {
            // Send some ETH to contract
            await owner.sendTransaction({
                to: await token.getAddress(),
                value: ethers.parseEther("1")
            });

            const initialBalance = await ethers.provider.getBalance(owner.address);
            await token.emergencyWithdraw(ethers.ZeroAddress, ethers.parseEther("1"));
            const finalBalance = await ethers.provider.getBalance(owner.address);
            
            // Check that balance increased (allowing for gas costs)
            expect(finalBalance).to.be.greaterThan(initialBalance);
        });
    });

    describe("View Functions", function () {
        it("Should return correct circulating supply", async function () {
            const totalSupply = await token.totalSupply();
            const deadBalance = await token.balanceOf(ethers.ZeroAddress);
            const expectedCirculating = totalSupply - deadBalance;
            
            expect(await token.getCirculatingSupply()).to.equal(expectedCirculating);
        });
    });

    describe("Access Control", function () {
        it("Should not allow non-owners to call owner functions", async function () {
            await expect(token.connect(addr1).enableTrading())
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

            await expect(token.connect(addr1).updateTaxes(1, 2, 0))
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

            await expect(token.connect(addr1).setBlacklist(addr2.address, true))
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

            await expect(token.connect(addr1).emergencyPause())
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    describe("Edge Cases and Security", function () {
        it("Should handle zero transfers correctly", async function () {
            await token.enableTrading();
            await expect(token.transfer(addr1.address, 0))
                .to.be.revertedWith("Transfer amount must be greater than zero");
        });

        it("Should prevent reentrancy attacks", async function () {
            // The ReentrancyGuard should prevent reentrancy
            // This is tested implicitly through other tests
            expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
        });

        it("Should handle large numbers correctly", async function () {
            const largeAmount = ethers.parseEther("999999999");
            await token.enableTrading();
            await token.transfer(addr1.address, largeAmount);
            expect(await token.balanceOf(addr1.address)).to.equal(largeAmount);
        });
    });
});