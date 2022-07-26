// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
* @dev 
* see https://github.com/PatrickAlphaC/dao-template/blob/main/helper-hardhat-config.ts
*     https://docs.openzeppelin.com/contracts/4.x/api/governance#TimelockController
*
*  MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
*  minDelay is how long you have to wait before executing
*  proposers is the list of addresses that can propose
*  executors is the list of addresses that can execute
*
*/
contract TimeLock is TimelockController {

  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}