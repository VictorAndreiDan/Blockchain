const { expect } = require("chai");
//const { ethers } = require("ethers");

describe("NFTMarketplace", function () {
    //constants
    let deployer, addr1, addr2, nft, marketplace;
    let URI = "Sample URI";
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
});