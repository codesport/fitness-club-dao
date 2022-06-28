
* **Attribution:** This dApp and its business plan were created by **Marcos (Marcus) A. B.** His GitHub username is [codesport](https://github.com/codesport/)

* **NB:** Version bump from 0.1.0-alpha to 0.1.5-alpha. See [release notes](https://github.com/codesport/fitness-club-dao/releases/tag/mvp2): 

# Navigation

* [Overview](#overview)
* [Unit Testing Results: One-Stop DAO Launchpad and Governance Destination](#unit-testing-results-one-stop-dao-launchpad-and-governance-destination)
* [Background: A Novel Use Case for ERC-721 Tokens](#background-a-novel-use-case-for-erc-721-tokens)
* [How It Works](#how-it-works)
* [How It Is Made](#how-its-made)
* [Frontend](#frontend)


# Overview

This application demonstrates DAO and NFT tooling.

It allows:

1. Creation of a fitness club (organized as a DAO) and 
2. Fee-based sign-up of new members to an existing club by means of an NFT minter.

Please refer to the Youtube video for links to the timestamped and minted DAO contracts.

Below is a screenshot of the application's homepage running on the Express backend:


![Fitness Ventures](https://github.com/codesport/fitness-club-dao/blob/master/frontend/src/images/girl2.png "Fitness Ventures Homepage")

# Unit Testing Results: One-Stop DAO Launchpad and Governance Destination


![Unit Testing](https://github.com/codesport/fitness-club-dao/blob/master/frontend/src/images/6-25-2022-fitness-ventures-unit-tests.png?raw=true "DAO Governance Unit Testing")

In unit tests `ERC721Minter.sol` and `Box.sol` were transferred to TimeLock. This forced Goverance (i.e., voting) to mint new NFTs and interact with Box contract. For `Box.sol`, Funds were deposited and withdrawn, and a public state variable was changed.

## Background: A Novel Use Case for ERC-721 Tokens 

This project explores a use case of utility and programmable ERC-721 tokens. Such tokens offer post issuance and programmable utility such as:

1. Authenticating users to portions of a website
2. Providing membership certificates and credentials 
3. Distribution of ad hoc cash rewards or regular income

## How It Works

Fitness club  memberships are conveyed by "hot-minting" an ERC-721 token (NFTs) from the fitness club. By "hot-minting" the NFTs are minted on-demand and are not pre-generated. 

Through the form-based UI, club creators are able customize:

1. Club Name
2. Logo
3. Symbol
4. Member Cost (of issuing memberships as NFTs)
5. Description

This project imports, uses, and customizes several OpenZeppelin templates to build a DAO based on audited code and accepted industry best practices. 

Customizations were made to the minter contract order to:

1. Set token sales price and enforce fees for minting:  `receivePayThenMint()`, `setSalesPrice()`, `getSalesPrice()`
2. Implement getter and setters for `contractURI`:  used by [Opensea](https://docs.opensea.io/docs/contract-level-metadata) to auto-populate metadata for a collection
3. Customize maximum token supply: `setTotalSupply()` and `getTotalSupply()`
4. Block token minting when maximum token supply is reached: `require( _tokenIdCounter.current() < maxSupply, "Max supply of NFTs exhausted");`
5. Receive Donations and other funds: `receive()` and `receiveDonations()`
6. Expose next `tokenID` for printing on minted NFT: `getTokenCurrentTokenID()`


Additionally, several debugging and "exit" functions were included for testing purposes. These functions will be moved after through testing of the money transfer functionality using the Governance and Timelock contracts (e.g., voting to withdraw funds).

1. `withdraw()`
2. `deleteContract()`: A self-destruct solely for the purpose of testing on testnets


This project is a web-based tool for deploying an NFT-based DAO. This tool deploys 3  contracts that permit issuance, governance, and treasury operations. Specifically it customizes and deploys:

1. ERC721 Token Minter
2. Timelock Controller
3. Governor 


## How It's Made

On the backend, it relies upon node, Express.js, bash, and heavily upon Hardhat libraries which are called directly by Express.  Javascript and RegEx are used to sanitize user inputs to conform with smart contract name conventions.

Express is used to  call a custom bash script. The script serves as a workhorse which duplicates and customizes DAO contract templates. Specifically,  based on information provided by the end user, the bash script customizes and modifies:

1. Contract Name 
2. Total Memberships (token supply) 
3. Token Pricing
4. Contract URI (contract metadata consisting of description and logo)

Hardhat is the the star of the show. It compiles and deploys the contracts to the block chain. Hardhat has a JS library that allows for native non command line use on node. 

### Frontend

The UI is itentionally rudimentry.  It was quickly protyped to show functionality required for an MVP.

The frontend uses React functional components.  I began learning React in August 2020 using a strict [Model-View-Controller (MVC)](https://github.com/codesport/admin-panel)] design pattern with a Class Component a the Controller.  With that pattern, I would send props downstream (prop-drilling) to my functional components. Facebook's React team now encourages devs to use Functional Components instead.

 The CSS classes are semi-custom.  The base CSS classes for the read and write buttons are from [Chainlink's VRF2 Subscription Manager](https://vrf.chain.link/rinkeby/).  The website design is from [Illdy](https://colorlib.com/wp/themes/illdy/).  Illdy is an older (2016 - 2018), open sourced WordPress theme based on Bootstrap 3.