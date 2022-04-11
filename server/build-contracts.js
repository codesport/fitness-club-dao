/**
 * Called by Express.js via index.js
 * 
 * File ops managed by hardhat.sh. Notes and tutorials at end of module
 */

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

 const buildDAO = async (owner, name, ticker, description, price, supply ) =>  {

    const regex = /[^A-Za-z0-9\s'\.\!]/g;

    const minterNameRegex = /[^A-Za-z0-9]/g;
    const DAOnameRegex = /[^A-Za-z0-9\s']/g
    const tokenTickerRegex = /[^A-Za-z0-9]/g
    const supplyRegex = /[^0-9]/g
    const priceRegex = /[^0-9\.]/g

    const timestamp = new Date().getTime();
     
    const minterName = name.replace(minterNameRegex,"");
    const daoName = name.replace(DAOnameRegex,"")
    const symbol  = ticker.replace(tokenTickerRegex,"").toUpperCase()
    price   =  price.toString().replace(priceRegex,"")
    supply  =  supply.toString().replace(supplyRegex,"")
  
    
    try {
        const { stdout, stderr } = await execFile( 'bash', ['../scripts/hardhat.sh', minterName, daoName, symbol, price, supply, timestamp] );

        // console.log('Bash script stdout:', stdout);
        // console.log('stderr:', stderr);
    }catch (err){
        console.error(err);
    };

     
    const timelockName = `${minterName}TimelockController`
    const governorName = `${minterName}Governor`


    return[owner, description, minterName, timelockName, governorName ]

    // try {
    //     const { stdout, stderr } = await execFile( 'npx hardhat run', ['../scripts/deploy-dao.js --network hardhat', owner, description, minterName, timelockName, governorName, image] );
        
    //     const payload = stdout
    //     console.log(stdout);
    //     console.log('stderr:', stderr);

    //     return payload
    // }catch (err){
    //     console.error(err);
    // }; 


    //return payload
// After templates are build and cleaned deploy them

}


module.exports = { buildDAO }

// let name="Hello World", ticker="Hello", description="Description Here",  supply=19, price=1, image="test"

// // const arg1 = "#Hello They're are Wor!@#%%&%&ld123$%";
// // const arg2 = "#Hello World. No we pray##!123$%";
// run(name, ticker, description, image, supply, price);


//Junk to Delete

//Token Symbol Length 
//there is no central registry for token contracts so the uniqueness of a particular name or symbol is not guaranteed
//no restriction on its size it is usually 3 or 4 characters in length.
// https://medium.com/@jgm.orinoco/understanding-erc-20-token-contracts-a809a7310aa5
//https://ethereum.stackexchange.com/questions/25619/is-there-length-limits-on-token-symbols

// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// child_process = require('child_process')
// child_process.execFile('./cert-check-script-delete.sh', [req.body.deletedCert])
//https://medium.com/stackfame/how-to-run-shell-script-file-or-command-using-nodejs-b9f2455cb6b7
//https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback

//console.log(arg1, arg2)

    // await execFile( 'bash', ['../../server/shell-scripts/hardhat.sh', arg1, arg2] , function(error, stdout, stderr) {
    
    // console.log(stdout);
    // console.log('stderr:', stderr);
    // console.log(error)
    // })
