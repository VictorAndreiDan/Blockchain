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
    mapping(uint256 => string) private _coach;

    // Mapping from token ID to start date
    mapping(uint256 => string) private _startDate;

    // Mapping from token ID to start date
    mapping(uint256 => string) private _endDate;

     constructor() ERC721("NFT Membership", "NFTMembership"){}
     function mint(string memory _tokenURI, string memory _athleteName, string memory _coachName, string memory _start, string memory _end) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        _athletes[tokenCount]   =   _athleteName;
        _coach[tokenCount]      =   _coachName;
        _startDate[tokenCount]  =   _start;
        _endDate[tokenCount]    =   _end;
        return(tokenCount);
    }
    // functions to acces the data of the nft that is on the chain instead of ipfs
    // return name of athlete
    function atheleteName(uint256 tokenId) public view virtual returns (string memory) {
        string memory athelete = _athletes[tokenId];
        return athelete;
    }
    // return name of the coach
    function coachName(uint256 tokenId) public view virtual returns (string memory) {
        string memory coach = _coach[tokenId];
        return coach;
    }
    // return the date when training began
    function membershipStartDate(uint256 tokenId) public view virtual returns (string memory) {
        string memory membershipStart = _startDate[tokenId];
        return membershipStart;
    }
    // return the date when training stopped
    function membershipEndDate(uint256 tokenId) public view virtual returns (string memory) {
        string memory membershipEnd = _endDate[tokenId];
        return membershipEnd;
    }
}

