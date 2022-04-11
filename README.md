# OVERVIEW

This application demonstrates DAO and NFT tooling.

It allows (1) the creation of a fitness club (organized as a DAO) and (2) the fee-based sign-up of new members to an existing club by means of an NFT minter.

Please refer to the Youtube video for links to the timestamped and minted DAO contracts.


![Fitness Ventures](https://github.com/codesport/fitness-club-dao/blob/master/frontend/src/images/girl2.png "Fitness Veptures Homepage")

## Background: A Novel Use Case for ERC-721 Tokens 

This project explores a use case of utility and programmable ERC-721 tokens. Such tokens offer post issuance and programmable utility such as:

1. Authenticating users to portions of a website
2.  Provide membership certificates and credentials 
3. Distribution of ad hoc cash rewards or regular income

## More Details

Fitness club  memberships are conveyed by "hot-minting" an ERC-721 token (NFTs) from the fitness club. By "hot-minting" the NFTs are minted on-demand and are not pre-generated. 

Through the form-based UI, club creators are able customize:

1. Club Name
2. Logo
3. Symbol
4. Member Cost (of issuing memberships as NFTs)
5. Description


## How It Works

This project is a web-based tool for deploying an NFT-based DAO. This tool deploys 3  contracts that permit issuance, governance, and treasury operations. Specifically it customizes and deploys

1. ERC721 Token Minter
2. Timelock Controller
3. Governor Contract

## How it's made


On the backend, it relies upon node, Express.js, bash, and heavily upon Hardhat libraries which are called directly by Express.  Javascript and RegEx are used to sanitize user inputs to conform with smart contract name conventions.

Express is used to  call a custom bash script. The script serves as a workhorse which duplicates and customizes DAO contract templates. Specifically,  based on information provided by the end user, the bash script customizes and modifies:

1. Contract Name 
2. Total Memberships (token supply) 
3. Token Pricing
4. Contract URI (contract metadata consisting of description and logo)

Hardhat is the the star of the show. It compiles and deploys the contracts to the block chain. Hardhat has a JS library that allows for native non command line use on node. 

### Frontend

The frontend uses React functional components.  I began learning in React in August 2020 using a strict [Model-View-Controller (MVC)](https://github.com/codesport/admin-panel)] design pattern with a Class Component a the Controller.  With that pattern, I would send props downstream (prop-drilling) to my functional components. Facebook's React team now encourages devs to use Functional Components instead

 The CSS classes are semi-custom.  The original CSS classes for contract read and write buttons are from [Chainllink's VRF2 Subscription Manager](https://vrf.chain.link/rinkeby/).  The website design is from [Illdy](https://colorlib.com/wp/themes/illdy/).  Illdy is an older (2016 - 2018), open sourced WordPress theme based on Bootstrap 3..