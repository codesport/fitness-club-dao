/**
 * references:
 * @link https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts//access/Ownable.sol
 * 
 * https://drdr-zz.medium.com/analysis-of-oz-timelockcontroller-security-vulnerability-patch-23da47a3c158
 * 
 * https://ethereum.stackexchange.com/questions/111444/what-is-this-function-do-internally-of-time-lock-controller-of-solidity
 * 
 * @link https://ethereum.stackexchange.com/a/48726/3506 https://ethereum.stackexchange.com/a/35667/3506
 * 
 * 
 */

const { expect } = require("chai");
const { ethers } = require("hardhat")
//const axios = require("axios")

describe("Minter Contract Transfer Tests", function() {//name to the set of tests we are going to perform

    this.beforeEach(async function() {
        [owner, user1, user2] = await hre.ethers.getSigners(); //set as globals  

        //TEST 1: Contract Shall Deploy Successfully
        const factory = await hre.ethers.getContractFactory("TransferTest");

        // wait until the transaction is mined
        contract = await factory.deploy(); 

        await contract.deployed();

        //user1.address, { value: hre.ethers.utils.parseEther( contractDepositWhenDeployed ) }

    })

    it("1. Should allow transferring contract to new owner", async function(){

        let whoIsOwner = await contract.owner()

        console.log("Old Owner:" + whoIsOwner)

        expect(  owner.address ).to.equal( whoIsOwner ) 

        const transfer = await contract.transferOwnership( user1.address )


        await transfer.wait()


        whoIsOwner = await contract.owner()

        console.log("New Owner:" + whoIsOwner)

        expect(  user1.address ).to.equal( whoIsOwner ) 


        // let balance = await hre.ethers.provider.getBalance(contract.address)
        // expect(  balance ).to.equal(hre.ethers.utils.parseEther(contractDepositWhenDeployed ) ) 

    })

})

//npx hardhat test    