// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IvoryVault {
    mapping(address => uint256) public collateral;
    uint256 public totalLiabilities;

    function deposit() external payable {
        collateral[msg.sender] += msg.value;
        totalLiabilities += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(collateral[msg.sender] >= amount, "insufficient");
        require(totalCollateral() - amount >= totalLiabilities, "risk: undercollateralized");

        collateral[msg.sender] -= amount;
        totalLiabilities -= amount;
        payable(msg.sender).transfer(amount);
    }

    function totalCollateral() public view returns (uint256) {
        return address(this).balance;
    }
}
