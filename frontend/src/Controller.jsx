import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios"
import { FormDAO, FormMint, MaxSupplyForm, SalesPriceForm, InstallContractForm } from "./Forms"
import { handleSetTotalSupply, handleSetSalesPrice, showNetwork, handleMintNFT, handleDeployContract } from "./HelperFunctions"
import { Boilerplate } from "./Boilerplate"
import abi from './utils/EightTestToken.json';
import splash from './images/splash.png'

const admin1 = import.meta.env.VITE_CONTRACT_CHAINBLOCK_ADDR
const admin2 = import.meta.env.VITE_CONTRACT_CODESPORT_ADDR


const Controller = () => { //deplyed via remix: https://rinkeby.etherscan.io/address/0xB1566a176D114DfC9dA5b4828AFfDB627C582be0

    const { ethereum } = window
    const [currentAccount, setCurrentAccount] = useState("");

    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [serverStatus, setServerStatus] = useState("")
    const [viewMinter, setViewMinter] = useState(false)
    const [networkNameHTML, setNetworkNameHTML] = useState("");
    const [teamName, setTeamName ] = useState("")

    
    const [networkName, setNetworkName] = useState("");
    const [simpleNetworkName, setSimpleNetworkName] = useState("");    

    const provider = new ethers.providers.Web3Provider(ethereum); //fix 1
    const signer = provider.getSigner();
  
    /**
     * Prevent infinite React re-renders by
     * set the default value for the state property using a ternary 
     * 
     * mumbai: eight test: 0x001fd467D74CC8c3c2e4884a1810D06F082aeFe3
     * mumbai: alpha 0x09b97b93a02131A0C0fF9B502bE7ecf8040455a8
     * meter: 0xa2aD607291443242924CA56C55aD4FB030A344d1
     * 
     * @link https://stackoverflow.com/a/55266240
     */
    const [contractABI, setContractABI] = useState( sessionStorage.getItem("contractAddress") ?  JSON.parse( sessionStorage.getItem('abi') ): abi.abi  )
    const [contractAddress, setContractAddress] = useState( sessionStorage.getItem("contractAddress") ? sessionStorage.getItem('contractAddress') : "0x001fd467D74CC8c3c2e4884a1810D06F082aeFe3")

    const [newChainId, setNewChainId] = useState( sessionStorage.getItem("contractAddress") ? sessionStorage.getItem('chainId') : 80001 )
    const [contract, setContract] = useState( new ethers.Contract(contractAddress, contractABI, signer))



//NB: list NFTs owned using this tokenOfOwnerByIndex(address _owner, uint256 _index)
   
    const checkIfWalletIsConnected = async () => {
    
        try {

            if (!ethereum) {  
                console.log("Make sure you have metamask!");
                setError(<a target="_blank" href={`https://metamask.io/download.html`}> Make sure you have metamask.</a>)
                return;
            } else {
                console.log("Metmask is installed");
                //setStatus("Wallet connected!");
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                //const account = accounts[0];
                console.log("checkIfWalletIsConnected(): Found an authorized account: " + accounts[0]);
                setStatus("Found an authorized account: " + accounts[0])
                setError("")

                //Initializing important state variables here
                //TODO: find a cleaner way to init varaible from contract on page load
                setCurrentAccount(accounts[0])
                setTeamName(await contract.name() )

                onNetworkChange('checkIfWalletIsConnected()')
                             

            } else {
                console.log("Connect to Metamask using the top right button")
                setError(
                    <>
                    <div style={{ position: "absolute", padding: ".5em" }}>Connect to Metamask using the top right button</div> 
                    
                    <img style={{ marginTop: "3em", width: "80%" }} src={splash} alt="splash image" />
                    </>          
                )               
            }

        } catch (error) {
            console.log(error.message);
            setError(error.message)         
        }
    }

    const connectWallet = async () => {
        try {

            if (!ethereum) {
                alert("Get MetaMask!");
                setError("Make sure you have metamask")
                return;
            }
            
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Message from 'connectWallet()': Now connected to: " + accounts[0]);
            setCurrentAccount(accounts[0]);

            onNetworkChange('connectWallet')
            
        
        } catch (error) {
            console.log(error.message);
            setError(error.message)  
        }
    }

    const addWalletListener = async () => {

        

        if (ethereum) {

            ethereum.on("accountsChanged", (accounts) => {

                console.log("Runing event listener")

                if (accounts.length > 0) {

                    setCurrentAccount( accounts[0] )
                    setStatus("Connected to a new wallet address: " + currentAccount)
                    setError("")

                    //onNetworkChange('addWalletListener()')

                } else {

                    setCurrentAccount("")
                    setStatus("") 
                    console.log("Message from 'addWalletListener': Connect your wallet by clicking the top right button")
                    setError("Connect your wallet by clicking the top right button")
           
                }
            });

            //https://stackoverflow.com/q/70663898/946957  https://docs.metamask.io/guide/ethereum-provider.html#methods
            ethereum.on('chainChanged', (chainId) => {

                console.log(`Hex formatted chain id: ${chainId}`)
                console.log(`Decimal formatted chain id: ${parseInt(chainId, 16)}`) //hex to number: 
                //console.log(`Decimal formatted chain id: ${(chainId)}`)

                onNetworkChange('addWalletListener()')
                setError("")
                window.location.reload()

                // if(chainId !== "0x13881") {

                //     setError("Please connect on testnet Polygon Mumbai")

                // } else {

                //     setError("")
                //     window.location.reload()

                // }

            })

            // provider.on("network", (network, oldNetwork) => {
                ////https://github.com/ethers-io/ethers.js/issues/899#issuecomment-646945824 https://ethereum.stackexchange.com/a/123347
            //     console.log(network);

            //     if (oldNetwork.name !== null ){

            //         console.log("Detected a network change from " + oldNetwork.name + " to " + network.name + " Auto-reloading your browser in 2 seconds!")

            //         setStatus("Detected a network change from " + oldNetwork.name + " to " + network.name + " Auto-refreshing your browser in 5 seconds!")

            //          setError("")
    
            //         sleep(5000)

            //     }                

            //    // window.location.reload()
            // });



        } else {

            setError(<a target="_blank" href={`https://metamask.io/download.html`}> Click here to learn install and learn more about Metamask.</a>)

        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        addWalletListener()
        
        fetch("http://localhost:3001/api")
        .then((res) => res.json())
        .then((serverStatus) => setServerStatus(serverStatus.message), console.log(serverStatus))        

    }, [])
    
    const handleCopyText =  (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
        setStatus("Successfully copied " + textToCopy + "to clipboard")
    }

    const onNetworkChange = async ( callingFunctionName ) =>{
        
        const network = await provider.getNetwork()
        console.log( `${callingFunctionName} Has Called Network Detector. Raw Network Name: ${network.name}`)    
        const callback = showNetwork( network );
    
        if (callback.success === true){
            
            setNetworkNameHTML(callback.status)
    
            setSimpleNetworkName(callback.networkName)
    
            console.log("You're now Connected to: " + callback.networkName)
    
            setError("")
            
         }else{
             
            
            setError(callback.error)
         }
    }

    const onSetTotalSupply_pressed = async (event) => {
        event.preventDefault()   
        const callback = await handleSetTotalSupply(event, contract);
        callback.success ? setStatus(callback.status) : setError(callback.error)
    }  

    const onSetSalesPrice_pressed = async (event) => {
        event.preventDefault()   
        const callback = await handleSetSalesPrice(event, contract, ethers);
        callback.success ? setStatus(callback.status) : setError(callback.error)
    } 

    const onInstallContract_pressed = (event, abi) => {
        event.preventDefault()  

        // setContractABI(abi)
        // setContractAddress(event.target.newContractAddress.value)
        // setNewChainId(event.target.newChainId.value)

        sessionStorage.setItem('abi', JSON.stringify(abi));
        sessionStorage.setItem('contractAddress', event.target.newContractAddress.value);
        sessionStorage.setItem('chainId', event.target.newChainId.value);

        setContractABI(   JSON.parse( sessionStorage.getItem('abi') )  )
        setContractAddress( sessionStorage.getItem('contractAddress')  )
        setNewChainId( sessionStorage.getItem('chainId') )
        setContract(new ethers.Contract(contractAddress, contractABI, signer))

        console.log("New Contract Loaded")
        console.log(contractAddress)
        console.log(contractABI)
        window.location.reload()
        //console.log( contract.name() )

    } 


    const onBuildDAO_pressed = async (event, image) => {
        event.preventDefault()   

        console.log(image);                         //axios, event, contract, fileStream, ethers, currentAccount
        const callback = await handleDeployContract( axios, event, image, currentAccount);
        callback.success ? setStatus(callback.status) : setError(callback.error)
    }

    const onMintNFT_pressed = async (event, image, daoName) => {
        event.preventDefault()   

        console.log("Minter: " + daoName); 
        const callback = await handleMintNFT(axios, event, contract, contractAddress, image, ethers, currentAccount, daoName);
        callback.success ? setStatus(callback.status) : setError(callback.error)
    }    


    const handleViewMinter = async (bool) => {

        setViewMinter(bool)


        if (bool === true){
            setStatus("You're Viewing: Membership Signup (mint nft)")
        } else{
            setStatus("You're Viewing: Launch a Club (Create a DOA)")
        }
        
      
    }    


    const getContractProperties = async ( get /* readonly contract function */, command /* name of state to update */ ,
     message /* Status Message */, format=false /* eth || base64 */ ) => {
        
        let output = ( await get)
        
        if (format === 'eth') {

            output =  ethers.utils.formatEther( output )
            command(  `${message} ${output}` )

        } else if (format === 'base64'){
            
            output =  output.split(',')
            let [, output1] = output //https://github.com/oliver-moran/jimp/issues/231
            output = atob(output1)
            command( <span style={{fontSize:".5em", margin:"0 2em", maxWidth:"44%", overflow:"scroll"}}> {output} </span> )
        
        } else if (command != '') {

            command( `${message} ${output}` )

        } else{

            return output
        }

    }
    


    let form = null,
        viewWalletStatus = null,
        viewMinterButton = null,
        updateMaxSupplyForm = null,
        updateSalesPriceForm = null,
        renderInstallContractForm = null,
        getMaxSupplyButton = null,
        getTotalMintedButton = null,
        getContractBalanceButton = null,
        getContractMetadataButton = null,
        getSalesPriceButton = null,
        withdrawToOwnerAddressButton = null,
        handleShutDownButton = null, 
        getContractNameButton = null
        


    //console.log(admin1)
    if (!currentAccount ){

        viewWalletStatus = <button className="green-button" onClick={connectWallet}>Connect Wallet</button>
    
    } else {
        viewWalletStatus = 
        <>
        {networkNameHTML}
        <button className="status-button green-button" onClick={() => handleCopyText(currentAccount) }><b>Connected:</b> {String(currentAccount).substring(0, 6) + "..." + String(currentAccount).substring(38)}</button>
        </>

        if (viewMinter === false){

            form = <FormDAO callback={onBuildDAO_pressed} contractMeta="5" />
            viewMinterButton = <button className="adminButton kviMVi" style={{borderRadius:"3em", fontWeight:"bold"}} onClick={ () => handleViewMinter(true) }>Pay for Membership (Mint NFT)</button>

        } else{

            form = <FormMint callback={onMintNFT_pressed} teamName={teamName} /> 

            viewMinterButton = <button className="adminButton kviMVi"  style={{borderRadius:"3em", fontWeight:"bold"}} onClick={ () => handleViewMinter(false) }>Create a New Team (Deploy DAO)</button>

            getMaxSupplyButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( contract.maxSupply(), setStatus, "Maximum Members Allowed (Max Token Supply): " ) }>Maximum Members (Token Supply)</button>
    
            getSalesPriceButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( contract.salesPrice(), setStatus, "Membership Price Is: ", "eth" ) }>Get Membership NFT Price</button>
    
            getTotalMintedButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( contract.getTotalSupply(), setStatus, "Current Membership Count (Minted Memberships): ") }>Membership Count</button>
    
            getContractBalanceButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( provider.getBalance(contractAddress), setStatus, "The team's contract balance is: ", 'eth' ) }>Contract Cash Balance</button>
    
            getContractMetadataButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( contract.contractURI(), setStatus, '', 'base64' ) }>View Contract Metadata</button>

            getContractNameButton = 
            <button className="adminButtonGreen kviMVi" onClick={ () => getContractProperties( contract.name(), setStatus, "Team's (contract's) name is: " ) }>View Contract Name</button>

        }

    }

    if(currentAccount === admin1 && viewMinter === true ){
        
        updateMaxSupplyForm = <MaxSupplyForm callback={onSetTotalSupply_pressed}/>
        updateSalesPriceForm = <SalesPriceForm callback={onSetSalesPrice_pressed}/>
        renderInstallContractForm = <InstallContractForm callback={onInstallContract_pressed}/>

        // handleShutDownButton = <button className="kviMVi adminButton" onClick={handleShutDown}>Delete App</button>

        // withdrawToOwnerAddressButton = <button className="kviMVi adminButton" onClick={handleWithdrawToOwner}>Withdraw Funds</button>
    }
   
        
    return(
        <React.Fragment>

        <Boilerplate />
            <div className="connectButton">
                {viewWalletStatus}
            </div>
                {form}    
            <div className="center shade">
                {viewMinterButton}
                    </div>
            <div className="center shade">
            <div>{getMaxSupplyButton} {getTotalMintedButton} {getSalesPriceButton}</div>
                {getContractBalanceButton}{getContractMetadataButton}{getContractNameButton}
            </div>

            <span id="status" className="pad2em white center">{status}{error}</span>

            <div id="admin" className="center shade">{updateMaxSupplyForm}{updateSalesPriceForm}{renderInstallContractForm}{handleShutDownButton}{withdrawToOwnerAddressButton}</div>    
            <p>{!serverStatus? "Express JS Backend is Offline" : serverStatus}</p>
        
        </React.Fragment>

        
    )

  
}


export default Controller