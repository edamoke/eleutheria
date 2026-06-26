// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ITP is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;

    constructor() ERC20("Eleutheria Protocol Token", "ITP") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "cap reached");
        _mint(to, amount);
    }
}
