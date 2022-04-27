/**
 * References to Understand Timelock and Governance Contracts:
 * 
 * @link https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts//access/Ownable.sol
 * @link https://drdr-zz.medium.com/analysis-of-oz-timelockcontroller-security-vulnerability-patch-23da47a3c158
 * @link https://ethereum.stackexchange.com/questions/111444/what-is-this-function-do-internally-of-time-lock-controller-of-solidity
 * @link https://ethereum.stackexchange.com/a/48726/3506 https://ethereum.stackexchange.com/a/35667/3506
 * 
 *  Configure TimelockController
 * 
 * ex 1a: https://forum.openzeppelin.com/t/governance-contract-or-timelock-contract-which-comes-first/17048/3
 * ex 1b: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/e6f26b46fc8015f1b9b09bb85297464069302125/test/governance/extensions/GovernorTimelockControl.test.js#L31-L37
 * ex 2a: https://github.com/PatrickAlphaC/dao-template/blob/main/deploy/04-setup-governance-contracts.ts
 * ex 2b:  https://docs.openzeppelin.com/defender/guide-timelock-roles
 * 
 */

const { expect } = require("chai");
const { ethers } = require("hardhat")


const contractDepositWhenDeployed = "0.01"
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

describe("Test Deploying a DAO on Behalf of a Customer", function() {//name to the set of tests we are going to perform

    let minter_contract //declare as global variable s.t. is accessible to other tests
    

    this.beforeEach(async function() {

        [owner, customer1, user2] = await hre.ethers.getSigners(); //set as globals  

        //TEST 0: Contract Shall Deploy Successfully
        const factory = await hre.ethers.getContractFactory("TransferTest");
  
        minter_contract = await factory.deploy({ value: hre.ethers.utils.parseEther( contractDepositWhenDeployed ) }); 

        await minter_contract.deployed();

        // //customer1.address, { value: hre.ethers.utils.parseEther( contractDepositWhenDeployed ) }

 
        // //TEST 0: Shall Allow: Successful Contract Deployment on Behalf of Customer as noted in from.
        // const factory = await hre.ethers.getContractFactory("TransferTest");
  
        // //this mints as an arbitrary user and not as deployer
        // minter_contract = await factory.deploy( {value: hre.ethers.utils.parseEther( contractDepositWhenDeployed ) }); 

        // await minter_contract.deployed();        

    })

    // it("1. Should Deploy Minter on Behalf of Owner", async function(){

    //     [owner, customer1, user2] = await hre.ethers.getSigners(); //set as globals  

    //     const factory = await hre.ethers.getContractFactory("TransferTest");
  
    //     contract = await factory.deploy( {from: customer1.address,  value: hre.ethers.utils.parseEther( contractDepositWhenDeployed ) }); 

    //     await contract.deployed();


    // })


    // it("1. Should Confirm Minter Contract Is Owned By Customer #1, And  Not The Deployer", async function(){

    //     let whoIsOwner = await minter_contract.owner()

    //     console.log("Current Owner: " + whoIsOwner)

    //     expect(  customer1.address ).to.equal( whoIsOwner ) //TODO: is there a "not equal to equivalent to unit tests"

    //     // const transfer = await contract.transferOwnership( customer1.address )

    //     // await transfer.wait()

    //     // whoIsOwner = await contract.owner()

    //     // console.log("New Owner:" + whoIsOwner)

    //     // expect(  customer1.address ).to.equal( whoIsOwner ) 


    //     // let balance = await hre.ethers.provider.getBalance(contract.address)
    //     // expect(  balance ).to.equal(hre.ethers.utils.parseEther(contractDepositWhenDeployed ) ) 

    // })

    it("1. Should allow transfer of Mint contract to new owner", async function(){

        let whoIsOwner = await minter_contract.owner()

        console.log("Old Owner:" + whoIsOwner)

        const transfer = await minter_contract.transferOwnership( customer1.address )
        await transfer.wait()

        whoIsOwner = await minter_contract.owner()
        expect(  customer1.address ).to.equal( whoIsOwner ) 
        console.log("New Owner:" + whoIsOwner)

        // let balance = await hre.ethers.provider.getBalance(contract.address)
        // expect(  balance ).to.equal(hre.ethers.utils.parseEther(contractDepositWhenDeployed ) ) 

    })


    it("2.  Should Deploy and Configure TimeLock As Owner & Deployer.", async function(){

        const factory = await hre.ethers.getContractFactory( "TimeLock" ); //from: deployer,

        //an array of proposers and executors 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
        const contract = await factory.deploy( 3600, [owner.address, /* admin */], [ owner.address, /*admin*/]);
        await contract.deployed();
             

    })

    // it("2. Should Deploy and Configure TimeLock In Customer's Name", async function(){

    //     const factory = await hre.ethers.getContractFactory( TimeLock ); //from: deployer,

    //                                                             //an array of proposers and executors
    //     const contract = await factory.deploy( 3600, [owner.address, customer1.address], [ owner.address, customer1.address], {from: customer1.address,});
    //     await contract.deployed();
      
    //     console.log("TimeLock deployed TO:", contract.address);


    // })    


    it("3. Should Deploy and Configure Governor", async function(){

        //1. Deploy timelock
        let factory = await hre.ethers.getContractFactory( "BetaTeamTimelockController" ); //from: deployer,
        const timeLock_contract = await factory.deploy( 3600, [owner.address, customer1.address/* admin */], [ owner.address, customer1.address /*admin*/] );
        await timeLock_contract.deployed();
        console.log("TimeLock deployed TO:", timeLock_contract.address);

        //2. Now deploy governor
        factory = await hre.ethers.getContractFactory( "TestGovernor");  //voting delay, voting period, proposal threshold
        const governor_contract = await factory.deploy( minter_contract.address, timeLock_contract.address );
        await governor_contract.deployed();    
        console.log("Governor deployed TO: ", governor_contract.address);


        //3. Config TimeLock Governance // normal setup: governor is proposer, everyone is executor, timelock is its own admin

        let proposer_role = await timeLock_contract.PROPOSER_ROLE()
        let admin_role = await timeLock_contract.TIMELOCK_ADMIN_ROLE()
        let executor_role = await timeLock_contract.EXECUTOR_ROLE()

        console.log( "PROPOSER_ROLE: " +  proposer_role )
        console.log( "TIMELOCK_ADMIN_ROLE: " +  admin_role )
        console.log( "EXECUTOR_ROLE: " +  executor_role ) 

        //TimeLock is AccessControl: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/AccessControl.sol
        const proposerTx = await timeLock_contract.grantRole( proposer_role,  governor_contract.address)
        await proposerTx.wait()

        const executorTx = await timeLock_contract.grantRole( executor_role,  ADDRESS_ZERO)
        await executorTx.wait()  

        const adminRevokeTx = await timeLock_contract.revokeRole( admin_role,  owner.address)
        await adminRevokeTx.wait()




    })    


})

//npx hardhat test    