// SPDX-License-Identifier: MIT

// 0x1bB5122dE2Db0D7803bd048c809b0B6501D88353
// owner 0xaD96c0b51D5be8C190F2d7cdABbFd4173Af2b06c
pragma solidity ^0.8.1;

import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@4.9.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC20/extensions/ERC20Permit.sol";

contract ECO_Carbon_Xchange is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit {
    constructor()
        ERC20("ECO_Carbon_Xchange", "ECO")
        ERC20Permit("ECO_Carbon_Xchange")
    {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
