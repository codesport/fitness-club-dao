// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

//source: https://github.com/zeuslawyer/hackathon-dao-governance-demo/blob/main/contracts/Box.sol

contract Box is Ownable {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 _value);

    // Stores a new value in the contract
    function setValue(uint256 _value) public onlyOwner {
        value = _value;
        emit ValueChanged(_value);
    }

    // Reads the last stored value
    function getValue() public view returns (uint256) {
        return value;
    }

    /**
     * @dev Contract might receive/hold ETH as part of the maintenance process.
     */
    receive() external payable {}

    //TODO: delete in production: for unit testing only
    function deleteContract(address payable _admin) public onlyOwner{ 
        selfdestruct(_admin); 
    } 

    
    /* 
    * @dev reference docs:
    *
    * https://solidity-by-example.org/sending-ether/
    * https://medium.com/daox/three-methods-to-transfer-funds-in-ethereum-by-means-of-solidity-5719944ed6e9
    */
    function withdraw(uint256 amount, address payable destAddress) public onlyOwner{
        require(amount <= address(this).balance, "Can't withdraw more than current balance");
        destAddress.transfer(amount);
    }  

     function deposit() payable public onlyOwner{} 

}