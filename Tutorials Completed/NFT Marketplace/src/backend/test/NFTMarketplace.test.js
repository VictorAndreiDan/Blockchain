const { expect } = require("chai");
//const { ethers } = require("ethers");

describe("NFTMarketplace", function () {
    //constants
    let deployer, addr1, addr2, nft, marketplace;
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
    })
});