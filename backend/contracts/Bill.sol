
// AVAX/USD 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD


pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Bill {

    using SafeMath for uint256;

    address payable public owner;
    address payable public platformOwner;
    address public oracleAddress = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
    uint256 public feePercent = 10;
    uint256 public totalBills;

    event BillMade(address indexed donor, uint256 amount);
    event WithdrawalMade(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address payable _platformOwner) {
        owner = payable(msg.sender);
        platformOwner = _platformOwner;
    }

    receive() external payable {
        bill();
    }

    function bill() public payable {
        require(msg.value > 0, "You must send some ether");
        uint256 usdAmount = getUSDAmount(msg.value);
        uint256 feeAmount = usdAmount.mul(feePercent).div(100);
        uint256 billAmount = usdAmount.sub(feeAmount);
        platformOwner.transfer(feeAmount);
        totalBills = totalBills.add(billAmount);
        emit BillMade(msg.sender, billAmount);
    }

    function withdraw() public onlyOwner {
        require(totalBills > 0, "There are no funds to withdraw");
        uint256 amount = totalBills;
        totalBills = 0;
        owner.transfer(amount);
        emit WithdrawalMade(owner, amount);
    }

    function getLatestPrice() public view returns (int) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(oracleAddress);
        (,int price,,,) = priceFeed.latestRoundData();
        return price;
    }

    function getUSDAmount(uint256 ethAmount) public view returns (uint256) {
        int price = getLatestPrice();
        require(price > 0, "Invalid price");
        uint256 usdAmount = ethAmount.mul(uint256(price)).div(1e18);
        return usdAmount;
    }
}