/**
 * 
 * Called by Express.js via index.js
 * 
 * Network to connect to is opiionated in .env with HARDHAT_NETWORK
 * @link https://hardhat.org/guides/scripts.html#hardhat-arguments 
 *
 * 
 */


const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios");

const main = async ( owner, description, minterName, timelockName, governorName, image /* , admin*/  ) =>{

	try{

		console.log( " Hardhat is Now Compiling Smart Contracts" )
		// return
		await hre.run("compile");

		// const CONTRACT_NAME = "EightTestToken"
		// const [owner] = await hre.ethers.getSigners();
		// const factory = await hre.ethers.getContractFactory( CONTRACT_NAME );
		
		const [ file_IPFSHashCID, logo_url ] = await pinFileToIPFS( image )
		console.log( 'Image IPFS CID: ' + file_IPFSHashCID )
		let DAOlogo_URI = 'ipfs://' + file_IPFSHashCID   

	// tokenURI === IFPS json metadata URI/CID for json metadata  (for a specific NFT )
	// IFPS json metadata URI => (points to) JSON file that represents the metadata for our NFT 
	// image property === IPFS image URI/CID
	// IPFS image URI => (points to) our image file
	// contract_metadataURI ===  IFPS json metadata URI/CID (for contract only)


		const contract_metadata = { //embedded into contract!
			"name": minterName,
			"description": description,
			"image": DAOlogo_URI, //or ipfs file
			"external_link": "https://codesport.io",
			"seller_fee_basis_points": 2000, // Indicates a 20% seller fee.
			"fee_recipient": owner // Where seller fees will be paid to.
		}

	//	let contract_metadataURI  = Buffer.from(JSON.stringify({contract_metadata})).toString("base64")
	//	contract_metadataURI = 'data:application/json;base64,' + contract_metadataURI

		//call functions inside contracts

		const [metadata_IPFSHashCID, metadata_url] = await pinMetaDataToIPFS( contract_metadata );

		console.log('Minter Meta Data CID: ' + metadata_IPFSHashCID )

		const contract_metadataURI = 'ipfs://' + metadata_IPFSHashCID


		const minterAddress = await deployMinter(minterName, metadata_url )

		const timelockAddress = await deployTimelock( timelockName, owner /* , admin*/)

		const governorAddress = await deployGovernor( governorName, minterAddress, timelockAddress)
		//const timelockAddress = deployTimelock (owner, admin)

		return [logo_url, metadata_url, minterAddress, timelockAddress, governorAddress]

      process.exit(0);

    } catch (error) {
      console.log(error);
      process.exit(1);
    }

}


const deployMinter = async ( minterName, contract_metadataURI  )=> {

    //const [owner] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory( minterName );

    const contract = await factory.deploy(contract_metadataURI, { value:  hre.ethers.utils.parseEther("0.03") }); //deploy  contract to the blockchain
    await contract.deployed();

    console.log("Minter deployed TO:", contract.address);
    console.log('Reading Contract URI from deployed minter: ' +  await contract.contractURI() )	

	let balance = await hre.ethers.provider.getBalance( contract.address )
	balance = hre.ethers.utils.formatEther( balance )

	console.log('Reading Balance of deployed minter: ' +  balance  )	

	return contract.address

}


const deployTimelock = async (timelockName, owner /*, admin*/) =>{
 
	const factory = await hre.ethers.getContractFactory( timelockName );

	//an array of proposers and executors
	const contract = await factory.deploy( 1, [owner, /* admin */], [ owner, /*admin*/]);
	await contract.deployed();
  
	console.log("Timelock deployed TO:", contract.address);
	//console.log("Contract deployed BY: ", owner.address);

	return contract.address
  
	
  }

const deployGovernor = async ( governorName, minterAddress, timelockAddress ) =>{

    const factory = await hre.ethers.getContractFactory( governorName);

    //minter token address, timelock contract address
    const contract = await factory.deploy( minterAddress, timelockAddress );
    await contract.deployed();

    console.log("Governor deployed TO: ", contract.address);
   // console.log("Contract deployed BY: ", owner.address);

   return contract.address

}  


const  pinFileToIPFS = async ( logo ) => {

	const fs = require("fs");
	const FormData = require("form-data");


	//rsconsole.log('Pinata: ' + logo.buffer)
	//1. Pin File to IPFS
	//const stream = fs.createReadStream( logo.buffer );
	const data = new FormData();
	data.append("file", logo.buffer, { filename: logo.originalname } ); //https://dev.to/kgrvaidya/attach-file-stream-buffer-in-nodejs-ndj

	const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {

		//maxContentLength: "Infinity", new
		headers: {
			"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
			pinata_api_key: process.env.PINATA_KEY,
			pinata_secret_api_key: process.env.PINATA_SECRET,
		},
		
	});

	console.log('pinFileToIPFS Output:')
	console.log( fileResponse.data )

	const { data: fileData = {} } = fileResponse;
	const { IpfsHash } = fileData;
	const fileIPFS_url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

	console.log( 'Image URL: ' + fileIPFS_url )
	return [IpfsHash, fileIPFS_url]
	
};

const pinMetaDataToIPFS = async (metadata ) => { //customize meta for meta: https://docs.pinata.cloud/api-pinning/pin-json

	const pinataJSONBody = {
		pinataContent: metadata 
	};

	const jsonResponse = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", pinataJSONBody, {
		//maxContentLength: "Infinity", new
		headers: {
		'Content-Type': `application/json`,
		pinata_api_key: process.env.PINATA_KEY,
		pinata_secret_api_key: process.env.PINATA_SECRET,
	},
	});

	console.log('pinMetaDataToIPFS Output:')
	console.log( jsonResponse.data )

	const { data: jsonData = {} } = jsonResponse;
	const { IpfsHash } = jsonData;
	const metadataIPFS_url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`; //this is what minter needs

	console.log( 'Meta Data URL: ' + metadataIPFS_url )
	return [IpfsHash, metadataIPFS_url]

}


// //boiler plate
// const runMain = async () => {
//     try {
//       await main();
//     //   await testAuthentication();
//       process.exit(0);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
// };
  
//   runMain();
module.exports = { main }
  //npx hardhat run scripts/deploy-nine.js --network hardhat