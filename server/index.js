const express    = require("express");
const bodyParser = require('body-parser');
const cors       = require("cors");
const multer     = require('multer')
const app        = express();
const fs         = require("fs");

//import the script that does the work
const mint      = require("./mint-nft")
const deploy    = require("./build-contracts")
const hardhat   = require("../scripts/deploy-dao")
 
const storage    = multer.memoryStorage()
const upload     = multer({ storage: storage })

 
app.use(cors()); //https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

// parse application/json
app.use(bodyParser.urlencoded({extended:true})); //https://heynode.com/tutorial/process-user-login-form-expressjs/
  

app.use(express.static("public"));


app.get("/api", (req, res) => {
    res.json({ message: "Express JS Status: Connected to Node-Express Backend! Hardhat is Using: " + process.env.HARDHAT_NETWORK });
  });

 
//add new user
app.post('/mint-nft', upload.single('file'), async (req, res, next) => {

    console.log(req.file, req.body)

    const payload = await mint.mintNFT(req.body.tokenID, req.body.message, req.body.address, req.file, req.body.daoName )

    console.log(payload)

    res.send(payload)

    //res.json({success: true, status: }) 
    //https://www.reddit.com/r/node/comments/80q7sy/comment/duy7epk/?utm_source=share&utm_medium=web2x&context=3

});


app.post('/deploy-dao', upload.single('file'), async (req, res, next) => {

    console.log('Deploying to: ' + process.env.HARDHAT_NETWORK)

    console.log(req.file, req.body)
    const [owner, description, minterName, timelockName, governorName] = await deploy.buildDAO(req.body.owner, req.body.name, req.body.ticker, req.body.description, req.body.price, req.body.supply )

    //console.log("Read Payload data for building dao Express.js: " + payload) //console.log(req.file)

                                    //(owner, description, minterName, timelockName, governorName, image
    const publish = await hardhat.main( owner, description, minterName, timelockName, governorName, req.file )
  
    console.log(publish)

    /**
     * Store log in textfile for user to download now or at future date
     * @link https://nodejs.dev/learn/writing-files-with-nodejs 
     * @link https://stackoverflow.com/a/351421 https://stackoverflow.com/a/52190609 https://stackoverflow.com/a/51128043
     */
    const content = publish.push(owner)//.join('\n')

    // fs.writeFile(`public/dao-output-files/${owner}-${publish[2]}.txt`, content, err => {

    //     if (err) {
    //         console.error(err)
    //         return
    //     }

    // })

    // publish.push(`/dao-output-files/${owner}-${publish[2]}.txt`)


    res.send(publish)


});
 
// app.listen(3000, () => {
//   console.log("Server running successfully on 3000");
// });


const port = process.env.PORT || 3001;
app.listen(port, (err) => {
    if (err) throw err;
    else {
        console.log('Server is running at Port: ' + port);
    }

})
