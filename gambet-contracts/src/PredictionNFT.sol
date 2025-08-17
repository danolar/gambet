// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract PredictionNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct PredictionMetadata {
        uint256 betId;
        uint256 outcomeIndex;
        uint256 amount;
    }

    mapping(uint256 => PredictionMetadata) public getPredictionMetadata;

    constructor() ERC721("Gambet Prediction", "GPT") Ownable(msg.sender) {}

    function safeMint(
        address to,
        uint256 _betId,
        uint256 _outcomeIndex,
        uint256 _amount
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        getPredictionMetadata[tokenId] = PredictionMetadata({
            betId: _betId,
            outcomeIndex: _outcomeIndex,
            amount: _amount
        });
    }
}
