#!/bin/bash
set -euo pipefail

# PURPOSE: Prepare DAO contracts for deployment. Set name, symbol, description, price, and supply

# Called by Express.js server file, build-contract.js

# Order of Arguments sent to script:
    # contractName, daoName, symbol,  price, supply, timestamp

    # echo "The first argument is contractName: " $1
    # echo "The second argument is daoName (with spaces): " $2
    # echo "The third argument is ticker symbol: $3"
    # #echo "All arguments are: $@"


cp ../contracts/ERC721Minter.sol ../contracts/ERC721Minter-${6}.sol 

file1="../contracts/ERC721Minter-${6}.sol"

contract_name_old="TestToken"
contract_name_new=$1

name_spaces_old="Test Token"
name_spaces_new=$2

symbol_old="TEST"
symbol_new=$3

supply_old="maxSupply = 5"
supply_new="maxSupply = $5"

price_old="salesPrice = 10\*\*16;"
price_new="salesPrice = $4 \* 10\*\*18;"


# sed -i "27i $line27" $file1
# sed -i "27i $line28" $file1

sed -i "s/$contract_name_old/$contract_name_new/" "$file1"
sed -i "s/$name_spaces_old/$name_spaces_new/g" "$file1"
sed -i "s/$symbol_old/$symbol_new/" "$file1"
sed -i "s/$price_old/$price_new/" "$file1"
sed -i "s/$supply_old/$supply_new/" "$file1"


cp ../contracts/OZGovernor.sol ../contracts/OZGovernor-${6}.sol

file2="../contracts/OZGovernor-${6}.sol"

old2="OZGovernor"
new2=${1}OZGovernor
sed -i "s/$old2/$new2/" "$file2"


cp ../contracts/TimeLock.sol ../contracts/TimeLock-${6}.sol

file3="../contracts/TimeLock-${6}.sol"

old3="TimeLock"
new3=${1}TimeLock
sed -i "s/$old3/$new3/" "$file3"

# Deploy DAO
#npx hardhat run ../scripts/deploy-dao.js --network hardhat