// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBurner is Ownable {
    IERC721 public nftContract;
    bool public isPaused = false;

    constructor(address _nftContractAddress) {
        nftContract = IERC721(_nftContractAddress);
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    function pause() external onlyOwner {
        isPaused = true;
    }

    function unpause() external onlyOwner {
        isPaused = false;
    }

    function delistNFT(uint256 tokenId) external onlyOwner whenNotPaused {
        address currentOwner = nftContract.ownerOf(tokenId);
        require(currentOwner != address(0), "Token not owned");
        nftContract.transferFrom(currentOwner, address(this), tokenId);
        nftContract.transferFrom(address(this), address(0xaD96c0b51D5be8C190F2d7cdABbFd4173Af2b06c), tokenId);
    }

    function burnNFT(uint256 tokenId) external onlyOwner whenNotPaused {
        address currentOwner = nftContract.ownerOf(tokenId);
        require(currentOwner != address(0), "Token not owned");
        nftContract.transferFrom(currentOwner, address(this), tokenId);
        nftContract.transferFrom(address(this), address(0), tokenId);
    }
}
