import React, { useState } from "react";


const FormDAO =   ( {callback} ) =>{

    const [image, setImage] = useState({ preview: '', data: '' })
    const handleFileChange = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }
    
    
    return(
        
        <div className="center">
            <form id="buildDAO" onSubmit={() => callback(event, image.data)}>
            <fieldset className="shade">
                {/* <legend>Fitness Team DAO Deploy Tool</legend> */}

                <p className="form-header">Create a New Team (NFT DAO Deployment)</p>
                <label>Team Name</label>
                <input 
                    type='text'
                    name='name'

                    size='30'
                    form="buildDAO"
                />
                <p> </p>
                <label>Team Symbol (BFT Symbol)</label>
                <input 
                    type='text'
                    name='symbol'

                    size='15'
                    form="buildDAO"
                />
                <p> </p>                
                <label>Team Logo:</label>    
                <br /><br />
                <input 
                    // className="adminButtonGreen"
                    type="file" 
                    name="image" 
                    id="fileInput" 
                    onChange={handleFileChange}
                    form="buildDAO"
                />
                <hr />
                {image.preview && <img src={image.preview} style={{ margin:"0 auto", display:"block"}} width='150' height='150' />}
                    <hr />
                    <p> </p>
                    <label>Membership Sales Price</label>
                    <input
                            type='number'
                            name='price'
                            placeholder='3'
                            size='4'
                            min='.001'
                            step=".001"
                            form="buildDAO"
                            required    
                    />
                   <p> </p>
                    <label>Maximum Members (Membership Certs Issues)</label>    
                    <input  
                            type='number'
                            name='supply'
                            placeholder='5'
                            min='1'
                            step='1'
                            size='5'
                            form="buildDAO"
                            required 
                          />

                            <label>Team Description</label>

                            <div>
                                <textarea 
                                    rows='5'
                                    cols='40'
                                    name='description'
                                    placeholder='Describe your team and tell why people should join'
                                />
                            </div>                           
                </fieldset>
                <div className="enterRaffleButton">
                    <button type='submit' className="adminButtonGreen kviMVi" id="enterRaffle" form="buildDAO">Launch a New Team (Deploy a DAO)</button>            
                </div>
            </form>
            
        </div>


    )  

}

const FormMint =   ( props ) =>{

    const [image, setImage] = useState({ preview: '', data: '' })
    const handleFileChange = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }
    
    
   // console.log(props.teamName)
    return(
        
        <div className="center">
            <form id="buyNFT" onSubmit={() => props.callback(event, image.data, props.teamName)}>
            <fieldset className="shade">
                {/* <legend>DAO NFT Minter!</legend> */}

            <p className="form-header">{`Join ${props.teamName} (NFT Membership)`}</p>
                <label>You May Optionally Add a Personal Message (NB: Will Appear in NFT Metadata):</label>
                <input 
                    type='text'
                    name='message'

                    size='30'
                    form="buyNFT"
                />
                <p> </p>
                <label> (Optional) Include a PPF or any Image on your NFT (NB: Dimensions resized to 150x150):</label>    
                <br /><br />
                <input 
                    // className="adminButtonGreen"
                    type="file" 
                    name="image" 
                    id="fileInput" 
                    onChange={handleFileChange}
    
                />
                <hr />
                {image.preview && <img src={image.preview} style={{ margin:"0 auto", display:"block"}} width='150' height='150' />}
                    
                </fieldset>
                <div className="enterRaffleButton">
                    <button type='submit' className="adminButtonGreen kviMVi" id="enterRaffle" form="buyNFT">Join {props.teamName} (Mint My NFT)</button>            
                </div>
            </form>
            
        </div>


    )  

}

const MaxSupplyForm = ({callback}) =>{

    return(
        <form id="updateSupply" onSubmit={callback}>
            <button className="adminButton kviMVi" form="updateSupply">Update Max Supply</button>
            <input type="number" name="maxSupply"  step="1"  min="5" form="updateSupply" className="totalSupply white" placeholder="enter new supply" required/>
        </form>
    )

}

const SalesPriceForm = ({callback}) =>{

    return(
        <form id="updatePrice" onSubmit={callback}>
            <button className="adminButton kviMVi" form="updatePrice">Update Sales Price</button>
            <input type="number" step=".001" name="newPrice" form="updatePrice" className="totalSupply white" placeholder="enter new price" required/>
        </form>
    )

}


const InstallContractForm = ({callback}) =>{

    const [files, setFiles] = useState("");
    // //https://stackoverflow.com/a/61707546

    // const handleABI= file => {
    //     const fileReader = new FileReader();
    //     fileReader.readAsText(file);
    //     fileReader.onload = (file) => {
    //       console.log("file.result" + file.result);
    //       setFiles(file);
    //     };
    //   };    

    const handleABI = (uploadedFile) =>{
        //https://medium.com/@ravishankar_69706/reading-json-image-input-file-in-react-6fbf7bbf94e
        const fileReader = new FileReader();
        fileReader.onloadend = ()=>{
           try{
            setFiles(JSON.parse(fileReader.result))
              //setErrorData(null)

           }catch(error){
               console.log(error)
              //setErrorData("**Not valid JSON file!**");
           }
        }
        if( uploadedFile!== undefined){
           fileReader.readAsText(uploadedFile);
         }

     }


    // let FileReader
    //https://dev.to/ilonacodes/frontend-shorts-how-to-read-content-from-the-file-input-in-react-1kfb
    // const handleFileRead = (event) => {
    //     const content = fileReader.result;
    //     console.log(content)
    //     // … do something with the 'content' …
    //   };
      
    //   const handleFileChosen = (file) => {
    //     fileReader = new FileReader();
    //     fileReader.onloadend = handleFileRead;
    //     fileReader.readAsText(file);
    //   }

    //https://stackoverflow.com/a/56377153

    // console.log(files.abi)

    return(
        <form id="installContract" onSubmit={() => callback(event, files.abi)}>
            <button className="adminButton kviMVi" form="installContract">Install a New Minting Contract</button>
            <input type="text" name="newContractAddress"  form="installContract" className="totalSupply white" placeholder="0x..." required/>
            <input type="number" name="newChainId" form="installContract" className="totalSupply white" placeholder="80001" required/>
            <input 
                type="file" 
                name="newABI"   
                form="installContract" 
                className="totalSupply white" 
                onChange={event => handleABI(event.target.files[0])}
                required

            />
            {/* { "uploaded file content -- " + files} */}
        </form>
    )

}


    //Named Exports
export { FormDAO, FormMint, MaxSupplyForm, SalesPriceForm, InstallContractForm }