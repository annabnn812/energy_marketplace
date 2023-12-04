//0x208782b021fA7704139CE703ED8Edc5be4b41ffb Polygon zkEVM testnets 


//Energy token address 
//0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC

//Polygon zkEVM testnets oracle address 
//0x0715A7794a1dc8e42615F059dD6e406A6594651A

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSwap is Ownable {
    using SafeMath for uint256;

    uint256 public feePercent = 10;
    address payable public platformOwner; 
    uint256 public totalTransfer;

     address public ecoContractAddress = 0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC;
    address public oracleAddress = 0x0715A7794a1dc8e42615F059dD6e406A6594651A;

    constructor(address payable _platformOwner) {
        platformOwner = _platformOwner;
    }

    function getLatestPrice() public view returns (int) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(oracleAddress);
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function getUSDAmount(uint256 ethAmount) public view returns (uint256) {
        int price = getLatestPrice();
        require(price > 0, "Invalid price");
        uint256 usdAmount = ethAmount.mul(uint256(price)).div(1e18);
        return usdAmount;
    }

    function buyTokens(uint256 totalPriceInUSD, uint256 numberOfTokensToBuy) public payable {
        require(msg.value > 0, "You must send some ether");
        uint256 usdAmount = getUSDAmount(msg.value);
        require(usdAmount >= totalPriceInUSD, "Insufficient funds");
        uint256 feeAmount = totalPriceInUSD.mul(feePercent).div(100);
        uint256 transferAmount = totalPriceInUSD.sub(feeAmount);
        platformOwner.transfer(feeAmount);
        totalTransfer = totalTransfer.add(transferAmount);
        emit DonationMade(msg.sender, transferAmount);

        uint256 ecoTokensToTransfer = numberOfTokensToBuy;
        IERC20 ecoToken = IERC20(ecoContractAddress);

        require(ecoToken.balanceOf(address(this)) >= ecoTokensToTransfer, "Not enough ECO tokens in the contract");

        // Transfer the ETH to the contract owner
        payable(owner()).transfer(msg.value);

        // Transfer the ECO tokens to the user
        ecoToken.transfer(msg.sender, ecoTokensToTransfer);
    }

    function withdrawExcessEth() public onlyOwner {
        // Transfer all excess ETH to the contract owner
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawExcessEcoTokens() public onlyOwner {
        // Transfer all excess ECO tokens to the contract owner
        IERC20 ecoToken = IERC20(ecoContractAddress);
        ecoToken.transfer(owner(), ecoToken.balanceOf(address(this)));
    }

    event DonationMade(address indexed sender, uint256 amount);
}
