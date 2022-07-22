// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//get erc721 from open zeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMembership is ERC721URIStorage {
     uint public    tokenCount;

     // string public  athleteName;
     // string public  coachName;
     // uint public    membershipStartDate;
     // uint public    membershipEndDate;

     //transfer variables to mapping so it can be accesed for every new minted nft

     // Mapping from token ID to athleteName
    mapping(uint256 => string) private _athletes;

    // Mapping from token ID to coachName
    //mapping(uint256 => string) private _coaches;

     constructor() ERC721("NFT Membership", "NFTMembership"){}
     function mint(string memory _tokenURI, string memory _athleteName) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        _athletes[tokenCount] = _athleteName;
        return(tokenCount);
    }
    function atheleteName(uint256 tokenId) public view virtual returns (string memory) {
        string memory athelete = _athletes[tokenId];
        return athelete;
    }
}