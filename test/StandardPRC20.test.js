const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StandardPRC20", function () {
    let StandardPRC20;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    const NAME = "Test Token";
    const SYMBOL = "TEST";
    const TOTAL_SUPPLY = ethers.utils.parseEther("1000000");
    const MAX_TX_AMOUNT = ethers.utils.parseEther("10000");
    const MAX_WALLET_AMOUNT = ethers.utils.parseEther("20000");

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        
        StandardPRC20 = await ethers.getContractFactory("StandardPRC20");
        token = await StandardPRC20.deploy(
            NAME,
            SYMBOL,
            TOTAL_SUPPLY,
            owner.address,
            MAX_TX_AMOUNT,
            MAX_WALLET_AMOUNT
        );
        await token.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right name and symbol", async function () {
            expect(await token.name()).to.equal(NAME);
            expect(await token.symbol()).to.equal(SYMBOL);
        });

        it("Should assign the total supply to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should set correct limits", async function () {
            expect(await token.maxTransactionAmount()).to.equal(MAX_TX_AMOUNT);
            expect(await token.maxWalletAmount()).to.equal(MAX_WALLET_AMOUNT);
        });

        it("Should exclude owner from transfer limits", async function () {
            expect(await token.isExcludedFromTransferLimits(owner.address)).to.be.true;
            expect(await token.isExcludedFromTransferLimits(token.address)).to.be.true;
        });

        it("Should start with trading disabled", async function () {
            expect(await token.tradingEnabled()).to.be.false;
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

        it("Should not allow non-owner to enable trading", async function () {
            await expect(token.connect(addr1).enableTrading())
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow enabling trading twice", async function () {
            await token.enableTrading();
            await expect(token.enableTrading())
                .to.be.revertedWith("Trading already enabled");
        });

        it("Should prevent transfers when trading is disabled", async function () {
            await expect(token.transfer(addr1.address, ethers.utils.parseEther("100")))
                .to.be.revertedWith("Trading not enabled");
        });

        it("Should allow excluded addresses to transfer when trading is disabled", async function () {
            // Owner is excluded by default
            await token.transfer(addr1.address, ethers.utils.parseEther("100"));
            expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
        });
    });

    describe("Transfer Limits", function () {
        beforeEach(async function () {
            await token.enableTrading();
            await token.transfer(addr1.address, ethers.utils.parseEther("50000"));
        });

        it("Should enforce max transaction amount", async function () {
            const overLimit = MAX_TX_AMOUNT.add(1);
            await expect(token.connect(addr1).transfer(addr2.address, overLimit))
                .to.be.revertedWith("Transfer amount exceeds maximum");
        });

        it("Should enforce max wallet amount", async function () {
            const amount = MAX_WALLET_AMOUNT.add(1);
            await expect(token.connect(addr1).transfer(addr2.address, amount))
                .to.be.revertedWith("Transfer would exceed maximum wallet amount");
        });

        it("Should allow transfers within limits", async function () {
            const amount = ethers.utils.parseEther("5000");
            await token.connect(addr1).transfer(addr2.address, amount);
            expect(await token.balanceOf(addr2.address)).to.equal(amount);
        });

        it("Should not enforce limits for excluded addresses", async function () {
            await token.excludeFromTransferLimits(addr1.address, true);
            const overLimit = MAX_TX_AMOUNT.add(1);
            await token.connect(addr1).transfer(addr2.address, overLimit);
            expect(await token.balanceOf(addr2.address)).to.equal(overLimit);
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint", async function () {
            const mintAmount = ethers.utils.parseEther("1000");
            await token.mint(addr1.address, mintAmount);
            expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
        });

        it("Should not allow non-owner to mint", async function () {
            await expect(token.connect(addr1).mint(addr2.address, ethers.utils.parseEther("1000")))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow minting after finishing", async function () {
            await token.finishMinting();
            await expect(token.mint(addr1.address, ethers.utils.parseEther("1000")))
                .to.be.revertedWith("Minting has been finished");
        });

        it("Should not allow minting to zero address", async function () {
            await expect(token.mint(ethers.constants.AddressZero, ethers.utils.parseEther("1000")))
                .to.be.revertedWith("Cannot mint to zero address");
        });
    });

    describe("Owner Functions", function () {
        it("Should allow owner to update max transaction amount", async function () {
            const newAmount = ethers.utils.parseEther("5000");
            await token.setMaxTransactionAmount(newAmount);
            expect(await token.maxTransactionAmount()).to.equal(newAmount);
        });

        it("Should allow owner to update max wallet amount", async function () {
            const newAmount = ethers.utils.parseEther("15000");
            await token.setMaxWalletAmount(newAmount);
            expect(await token.maxWalletAmount()).to.equal(newAmount);
        });

        it("Should allow owner to exclude from transfer limits", async function () {
            await token.excludeFromTransferLimits(addr1.address, true);
            expect(await token.isExcludedFromTransferLimits(addr1.address)).to.be.true;
        });

        it("Should emit events for configuration changes", async function () {
            const newAmount = ethers.utils.parseEther("5000");
            await expect(token.setMaxTransactionAmount(newAmount))
                .to.emit(token, "MaxTransactionAmountUpdated")
                .withArgs(newAmount);
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow owner to emergency withdraw PLS", async function () {
            // Send some PLS to contract
            await owner.sendTransaction({
                to: token.address,
                value: ethers.utils.parseEther("1")
            });

            const initialBalance = await owner.getBalance();
            const tx = await token.emergencyWithdraw(ethers.constants.AddressZero, ethers.utils.parseEther("1"));
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
            
            const finalBalance = await owner.getBalance();
            expect(finalBalance.add(gasUsed)).to.be.closeTo(
                initialBalance.add(ethers.utils.parseEther("1")),
                ethers.utils.parseEther("0.01")
            );
        });

        it("Should not allow non-owner to emergency withdraw", async function () {
            await expect(token.connect(addr1).emergencyWithdraw(ethers.constants.AddressZero, 0))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Edge Cases", function () {
        it("Should handle zero amount transfers", async function () {
            await token.enableTrading();
            await expect(token.transfer(addr1.address, 0))
                .to.not.be.reverted;
        });

        it("Should handle transfers to self", async function () {
            await token.enableTrading();
            const initialBalance = await token.balanceOf(owner.address);
            await token.transfer(owner.address, ethers.utils.parseEther("100"));
            expect(await token.balanceOf(owner.address)).to.equal(initialBalance);
        });

        it("Should reject invalid constructor parameters", async function () {
            await expect(StandardPRC20.deploy(
                NAME,
                SYMBOL,
                0, // Invalid total supply
                owner.address,
                MAX_TX_AMOUNT,
                MAX_WALLET_AMOUNT
            )).to.be.revertedWith("Total supply must be greater than 0");

            await expect(StandardPRC20.deploy(
                NAME,
                SYMBOL,
                TOTAL_SUPPLY,
                ethers.constants.AddressZero, // Invalid owner
                MAX_TX_AMOUNT,
                MAX_WALLET_AMOUNT
            )).to.be.revertedWith("Owner cannot be zero address");
        });
    });
});