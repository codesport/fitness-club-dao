const handleDeployContract = async ( axios, event, image,  currentAccount) => {
//name, ticker, image, description, price, totalsupply, description
    console.log( image)

    const description = event.target.description.value
    const name        = event.target.name.value
    const ticker      = event.target.symbol.value
    const price       = event.target.price.value
    const supply      = event.target.supply.value


	//1. Package data like a formS
	let formData = new FormData();
    formData.append("owner", currentAccount) 
    formData.append("name", name)
    formData.append("ticker", ticker) 
    formData.append("description", description)
    formData.append("price", price) 
    formData.append("supply", supply) 

	formData.append("file", image)

  
    console.log( formData.get("image") )
    
    //let reactData = { tokenID: currentTokenID, message: personalMessage, address: contractAddress, image: image} ;
    const serverURL = "http://localhost:3001/deploy-dao"
        
    const response = await axios.post( serverURL, formData, {
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }
    })

    console.log(response.data)

    //logo_url, metadata_url, minterAddress, timelockAddress, governorAddress

    return {success: true, status:<>
    <p style={{ fontSize: "1em", position: "absolute", marginTop:"1em"}}>Congratulations! {name} Was Succesfully Launched as a DAO on the Blockchain!</p>
        <ol className="output-list" style={{ fontSize: ".7em", lineHeight: "2em", marginTop: "4em" }}>
        <li>Logo URL: <a href={response.data[0]} target="_blank">{response.data[0]}</a></li>
        <li>JSON Metadata URL (i.e., description, royalties, etc): <a href={response.data[1]} target="_blank">{response.data[1]}</a></li>
        <li>Minting Contract Address: <a href={response.data[2]} target="_blank">{response.data[2]}</a></li>
        <li>Timelock Address: <a href={response.data[3]} target="_blank">{response.data[3]}</a></li>
        <li>Governor Address: <a href={response.data[4]} target="_blank">{response.data[4]}</a></li>
        </ol></>
    } 


    
}


const handleMintNFT = async (axios, event, contract, contractAddress, fileStream, ethers, currentAccount, daoName) => {

    console.log( fileStream )

    const personalMessage =  event.target.message.value
    //const filePath = (event.target.image.value ? event.target.image.value : "")

    const price = (await contract.salesPrice()).toString()

    let currentTokenID
    currentTokenID = ( await contract.getTokenCurrentTokenID() ).toString();
    console.log(currentTokenID)


	//1. Package data like a formS
	let formData = new FormData();
    formData.append("tokenID", currentTokenID);
    formData.append("message", personalMessage);
    formData.append("address", contractAddress)
    formData.append("daoName", daoName)     
	formData.append("file", fileStream);

    console.log(personalMessage)
    console.log( formData.get("address"))
    
    //let reactData = { tokenID: currentTokenID, message: personalMessage, address: contractAddress, image: image} ;
    const serverURL = "http://localhost:3001/mint-nft"
        
    const response = await axios.post( serverURL, formData, {
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }
    })

    console.log(response.data)

    const tokenURI = response.data[0]

    const overrides = { //https://ethereum.stackexchange.com/a/93559/3506
        value: price,     // ether in this case MUST be a string
        gasLimit: ethers.utils.hexlify(500000),
    };

    try{

        console.log("Now minting to" + currentAccount);

        let transaction
        transaction = await contract.receivePayThenMint( currentAccount, tokenURI, overrides );
        
        console.log("Mining..." + transaction.hash);
        await transaction.wait();
        console.log("Mined -- " + transaction.hash)

        return {success: true, status:<>
            <p style={{ fontSize: "1em", position: "absolute", marginTop:"1em"}}>Congratulations! Your NFT Was Successfuly Minted!</p>
                <ol style={{ fontSize: ".7em", lineHeight: "2em", marginTop: "4em" }}>
                <li>Token URI (i.e., NFT Metadata on IPFS): <a href={response.data[0]} target="_blank">{response.data[0]}</a></li>
                <li>Token URL (NFT Metadata URL on Pinata): <a href={response.data[1]} target="_blank">{response.data[1]}</a></li>
                <li>Image URI (NFT on IPFS): <a href={response.data[2]} target="_blank">{response.data[2]}</a></li>
                <li>Image URL (NFT Image on Pinata): <a href={response.data[3]} target="_blank">{response.data[3]}</a></li>
                </ol></>
                
        }

    }catch(error){

        console.log(error)
        return{success: false, status: error}      

    }   

}



const handleGetMaxSupply = async (contract) => {
    try {
        console.log(contract)
        if (ethereum) {

           let transaction = await contract.maxSupply();
            
            console.log("Max Supply: " + transaction)
            return{success: true, status: "Max Supply: " + transaction}
            
        } else {
            console.log("Ethereum object doesn't exist!");
            setError("Ethereum object doesn't exist!");
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}

const handleGetContractBalance = async (provider, ethers, contractAddress) => {
    try {

        if (ethereum) {
        
            let transaction = await  provider.getBalance(contractAddress) 

                transaction = ethers.utils.formatEther( transaction )

            console.log("Contract Balance: " + transaction)
            return{success: true, status: "Contract Balance: " + transaction}
            
        } else {
            console.log("Ethereum object doesn't exist!");
            return{success: false, status: "Ethereum object doesn't exist!"}
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}

const handleGetTotalMinted = async (contract) => {
    try {

        if (ethereum) {   

           let transaction = await contract.getTotalSupply()
    
           console.log("Total Minted: " + transaction)
           return{success: true, status: "Total Minted: " + transaction}
            
        } else {
            console.log("Ethereum object doesn't exist!");
            setError("Ethereum object doesn't exist!");
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}

const handleWithdrawToOwner = async (event, contract, admin) => {
    try {

        if (ethereum) {

        let transaction = await contract.withdraw( event.target.value, admin)

           console.log("Mining..." + transaction.hash);
           
           await transaction.wait();

           console.log("Mined -- " + transaction.hash)

           return{success: true, status: "Successfully Withdrew " + event.target.value + " and deposited into " +  admin}           
           //setStatus("Mining..." + transaction.hash);
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }

}

const handleSetTotalSupply = async (event, contract) => {

    const supply =  event.target.maxSupply.value

    try {

        if (ethereum) {

            let transaction = await contract.setTotalSupply(supply);
            console.log("Mining..." + transaction.hash);
           
            await transaction.wait();
            console.log("Success! Mining Complete..." + transaction.hash)
            return{success: true, status: "Successfully Updated Maximum Token Supply To: ..." + supply}


        } else {
            console.log("Ethereum object doesn't exist!");
            return{success: false, status: "Ethereum object doesn't exist!"}
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}

const handleSetSalesPrice = async (event, contract, ethers) => {

    const newPrice =  ethers.utils.parseEther( event.target.newPrice.value )

    console.log("handleSetSalesPrice() Called")

    try {

        if (ethereum) {

            let transaction = await contract.setSalesPrice(newPrice);
            console.log("Mining..." + transaction.hash);
           
            await transaction.wait();
            console.log("Success! Mining Complete..." + transaction.hash)
            return{success: true, status: "Succesfully Updated Sales Price To: ..." + event.target.newPrice.value}


        } else {
            console.log("Ethereum object doesn't exist!");
            return{success: false, status: "Ethereum object doesn't exist!"}
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}


const handleShutDown = async (contract) => {
    try {

        if (ethereum) {

            await contract.deleteContract();
            
            console.log("Contract Deleted")
            return {success: true, status: "Contract Deleted"}
            
        } else {
            console.log("Ethereum object doesn't exist!");
            setError("Ethereum object doesn't exist!");
        }

    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}

function arrayContains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}


const showNetwork = (network) => {

    //const network = await provider.getNetwork();

    console.log ("Show Network: " , network.chainId)
    const ethLogo = 'https://smartcontract.imgix.net/icons/ethereum.svg?auto=compress%2Cformat*';
    const polygonLogo = 'https://smartcontract.imgix.net/icons/polygon.svg?auto=compress%2Cformat*';
    const meterLogo = 'https://meter.io/assets/meter-logo-d.svg'

    try{
        if (  [42,3,4,5,1,4].includes( network.chainId ) ){

            return {success: true, status:  <span id="wallet-network-info"><img className="network-logo-sm" src={ethLogo}/>{network.name}</span>, networkName: network.name } 

        }else if ( [80001].includes( network.chainId ) ) {

            return{ success: true, status: <span id="wallet-network-info"><img className="network-logo-sm" src={polygonLogo} />Polygon Mumbai</span> , networkName: "Polygon Mumbai" }

        }else if ([83].includes( network.chainId ) ){

            return{ success: true, status: <span id="wallet-network-info"><img className="network-logo-sm" src={meterLogo} style={{width:"5.1em", height:"1em"}}/></span>, networkName: "Meter Testnet" }

        }else if ( [137].includes( network.chainId ) ) {

            return{ success: true, status: <span id="wallet-network-info"><img className="network-logo-sm" src={polygonLogo} />Polygon Mainnet</span>, networkName: "Polygon Mainnet" }

        } else{

            return{ success: true, status: `${network.name}` }
        }
        
    } catch (error) {
        console.log(error)
        return{success: false, status: error}
    }
}



const getExternalData = async ( axios, url ) => {
    const response = await axios.get(url);
    return response.data;
}

const getContractURI = async (axios, output ) =>{

    output = await getExternalData(axios, output) 

    //output = output.map( (singleItem, index) => { //https://linguinecode.com/post/how-to-use-map-react
        console.log(output)
        return(
            [<li key="1"><strong>DAO Name:</strong> {output.name}</li>,
            <li key="2"><strong>Website:</strong> {output.external_link}</li>,
            <li key="3"><strong>Description:</strong> {output.description}</li>,
            <li key="4"><strong>IPFS URI for Logo:</strong> {output.image}</li>,
            <li key="5"><strong>Dev/Creator Fee on NFT Resales:</strong> { `${output.seller_fee_basis_points/100}%` }</li>,
            <li key="6"><strong>Recipient:</strong> { output.fee_recipient }</li>]
        )

   // })


}


//Named Exports
export { handleShutDown, handleWithdrawToOwner, handleSetTotalSupply, handleSetSalesPrice, showNetwork, handleDeployContract, handleMintNFT, getExternalData, getContractURI }

// /// Persist state after session reload: Hotload contract from sesion storage:

//https://stackoverflow.com/a/44190532
//https://www.google.com/search?q=how+save+state+after+page+reload+in+react
//https://www.delftstack.com/howto/javascript/javascript-set-session-variable/
//https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
//https://www.digitalocean.com/community/tutorials/js-introduction-localstorage-sessionstorage
//https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
//https://www.google.com/search?q=check+if+browser+localstorage+variable+is+set+in+javascript+-php
//

// https://ethereum.stackexchange.com/questions/32755/how-to-read-all-token-balances-from-wallet
// https://ethereum.stackexchange.com/questions/112271/implementing-ierc721enumerable-interface
// https://www.reddit.com/r/ethdev/comments/lt8792/how_to_find_all_erc721_tokens_of_a_specific/
// https://ethereum.stackexchange.com/questions/103442/showcase-all-nfts-a-user-has
// https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721Enumerable-tokenOfOwnerByIndex-address-uint256-


//// Real Answer: https://ethereum.stackexchange.com/a/95006
//// Explainer: https://ethereum.stackexchange.com/a/112091
// IERC721Enumerable token = IERC721Enumerable(0x12341234...)
// try token.tokenOfOwnerByIndex(user, 0) returns (uint tokenId) {
//     // First token owned by user
// } catch (bytes memory) {
//     // No tokens owned by user
// }

//Payment Splitter
//https://www.google.com/search?q=how+to+add+payment+splitter+to+a+contract
//https://medium.com/codex/how-to-use-openzeppelins-paymentsplitter-8ba8de09dbf
//https://medium.com/coinmonks/create-an-erc20-token-payment-splitting-smart-contract-c79436470ccc
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol
//https://docs.openzeppelin.com/contracts/2.x/api/payment

//ContractURI
//https://ethereum.stackexchange.com/questions/110924/how-to-properly-implement-a-contracturi-for-on-chain-nfts
//https://docs.opensea.io/docs/contract-level-metadata
//https://www.google.com/search?q=is+%22contractURI%22+an+erc-721+standard


//Fetch Data APIS          
// async ( output ) => {
//     console.log(output)
//     let response = await axios.get(output);

//     console.log(reponse)
//     command( response.data )
// }

// async (output) => {
//     try{
//         const response = await fetch(output)
//         const data = await response.json()
//         console.log(data)
//         return(data)
//     } catch(error){     
//         console.log(error)
//     }
// } 

//Deploy from frontend using ethers

//no answers, button question articulated well: https://ethereum.stackexchange.com/q/112866/3506

//compile using hardhat as standalone library directly from node (i.e., no cli) on the backend:
// https://hardhat.org/guides/scripts.html#standalone-scripts-using-hardhat-as-a-library
// await hre.run('compile');

//https://docs.ethers.io/v4/api-contract.html#creating-a-contract-factory
// new ethers . ContractFactory ( abi.abi , abi.bytecode [ , signer ] )
/*
https://docs.ethers.io/v5/api/contract/example/#example-erc-20-contract--deploying-a-contract


const factory = new ethers.ContractFactory(abi, bytecode, signer)
const contract = await factory.deploy(parseUnits("100"));
await contract.deployTransaction.wait();

Patrick Question: https://forum.openzeppelin.com/t/governance-contract-or-timelock-contract-which-comes-first/17048/3

Built in transfer function in: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts//access/Ownable.sol

*/