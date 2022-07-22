const { expect } = require("chai"); 

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMembership", function () {

    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let NFTMembership;
    let nftmembership;
    let URI = 'any random uri';
    let athlete = 'randomAthleteName'
    let coach = 'randomCoachName'
    let startDate = '01-01-2020'
    let endDate = '01-01-2022'

  beforeEach(async function () {
    // Get the ContractFactories and Signers here.
    NFTMembership = await ethers.getContractFactory("NFTMembership");
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contracts
    nftmembership = await NFTMembership.deploy();
  });

  describe("Deployment", function () {

    it("Should track name and symbol of the nft collection", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "NFT Membership"
      const nftSymbol = "NFTMembership"
      expect(await nftmembership.name()).to.equal(nftName);
      expect(await nftmembership.symbol()).to.equal(nftSymbol);
    });

  });

  describe("Minting NFTs", function () {

    it("Mint 2 new memberships at the gym and verify every value", async function () {
      // addr1 mints an nft
      await nftmembership.connect(addr1).mint(URI, athlete, coach, startDate, endDate)
      expect(await nftmembership.tokenCount()).to.equal(1);
      expect(await nftmembership.balanceOf(addr1.address)).to.equal(1);
      expect(await nftmembership.tokenURI(1)).to.equal(URI);
      expect(await nftmembership.atheleteName(1)).to.equal(athlete);
      expect(await nftmembership.coachName(1)).to.equal(coach);
      expect(await nftmembership.membershipStartDate(1)).to.equal(startDate);
      expect(await nftmembership.membershipEndDate(1)).to.equal(endDate);
      // addr2 mints a different nft with different values made with concat
      await nftmembership.connect(addr2).mint(URI, athlete.concat("2"), coach.concat("2"), startDate.concat("2"), endDate.concat("2"))
      expect(await nftmembership.tokenCount()).to.equal(2);
      expect(await nftmembership.balanceOf(addr2.address)).to.equal(1);
      expect(await nftmembership.tokenURI(2)).to.equal(URI);
      expect(await nftmembership.atheleteName(2)).to.equal(athlete.concat("2"));
      expect(await nftmembership.coachName(2)).to.equal(coach.concat("2"));
      expect(await nftmembership.membershipStartDate(2)).to.equal(startDate.concat("2"));
      expect(await nftmembership.membershipEndDate(2)).to.equal(endDate.concat("2"));
    });
  })

})
