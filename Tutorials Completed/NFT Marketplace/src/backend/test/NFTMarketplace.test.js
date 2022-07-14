const { expect } = require("chai");
//const { ethers } = require("ethers");

//conversion functions
const toWei     = (num) => ethers.utils.parseEther(num.toString());
const fromWei   = (num) => ethers.utils.formatEther(num);


describe("NFTMarketplace", function () {
    //constants
    let deployer, addr1, addr2, nft, marketplace;
    let URI = "Sample URI";
    let feePercent = 1;
    beforeEach(async function (){
        //factories
        const NFT = await ethers.getContractFactory("NFT");
        const MARKETPLACE = await ethers.getContractFactory("Marketplace");
        //signers
        [deployer, addr1, addr2] =  await ethers.getSigners()
        //deploy
        nft = await NFT.deploy();
        marketplace = await MARKETPLACE.deploy(1);
    });
    //tests about the deployment part
    describe("Deployment", function (){
        //test nr1 - check name and symbol of contract to make sure we got the right one
        it("Should track name and symbol of nft", async function(){
            expect(await nft.name()).to.equal("newNftName")
            expect(await nft.symbol()).to.equal("NNN")
        })
        //test fees
        it("Should track name and symbol of nft", async function(){
            expect(await marketplace.feePercent()).to.equal(1)
            expect(await marketplace.feeAccount()).to.equal(deployer.address)
        })
    })
    //test mint
    describe("Mint", function (){
        //minting
        it("Should track each minted nft", async function(){
            //addr1
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            //addr2
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
    //making marketplace item
    describe("Making marketplace item", function (){
        beforeEach(async function (){
            //addr1 mints nft
            await nft.connect(addr1).mint(URI);
            //addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        })
        it("Should track new nft, transfer NFT from seller to marketplace and emit Offered event", async function () {
            // addr1 offers their nft at a price of 1 ether
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1 , toWei(1)))
            .to.emit(marketplace, "Offered")
              .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                addr1.address
              )
            //nft is owned by marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // Item count should now equal 1
            expect(await marketplace.itemCount()).to.equal(1)
            // Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(1))
            expect(item.sold).to.equal(false)
        })
        it("Should fail if price is set to zero", async function () {
            await expect(
              marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        });
    });
    describe("Purchasing marketplace items", function (){
        let price = 2
        let fee = (feePercent/100)*price
        let totalPriceInWei;
        beforeEach(async function (){
            //addr1 mints nft
            await nft.connect(addr1).mint(URI);
            //addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            //addr1 makes nft a marketplace item
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(2));
        })
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitalEthBal = await addr1.getBalance()
            const feeAccountInitialEthBal = await deployer.getBalance()
            // fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.getTotalPrice(1);
            // addr 2 purchases item.
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
            .to.emit(marketplace, "Bought")
              .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
              )
            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()
            // Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true)
            // Seller should receive payment for the price of the NFT sold.
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitalEthBal))
            // feeAccount should receive fee
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal))
            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
          })
          it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(
              marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
            ).to.be.revertedWith("item doesn't exist");
            await expect(
              marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
            ).to.be.revertedWith("item doesn't exist");
            // Fails when not enough ether is paid with the transaction. 
            // In this instance, fails when buyer only sends enough ether to cover the price of the nft
            // not the additional market fee.
            await expect(
              marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)})
            ).to.be.revertedWith("not enough ether to cover item price and market fee"); 
            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})
            // deployer tries purchasing item 1 after its been sold 
            await expect(
              marketplace.connect(deployer).purchaseItem(1, {value: totalPriceInWei})
            ).to.be.revertedWith("item already sold");
          });
    })
});