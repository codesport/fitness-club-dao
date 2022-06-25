#!/bin/bash
set -euo pipefail

# PURPOSE: Prepare DAO contracts for deployment. Set name, symbol, description, price, and supply

# Called by Express.js server file, build-contract.js


#contractName, daoName, symbol,  price, supply,, timestamp]

# echo "The first fruit is: " $1
# echo "The second fruit is: " $2
# echo "The third fruit is: $3"
# #echo "All fruits are: $@"


cp ../contracts/ERC721Minter.sol ../contracts/ERC721Minter-${6}.sol 

file1="../contracts/ERC721Minter-${6}.sol"

old1="TestToken"
new1=$1

name_spaces_old="Test Token"
name_spaces_new=$2

symbol_old="TEST"
symbol_new=$3

# price_old="10**16"
# price_new="${4} 10**18"

supply_old="maxSupply = 5"
supply_new="maxSupply = $5"

priceOld2="salesPrice = 10\*\*16;"
priceNew2="salesPrice = $4 \* 10\*\*18;"


# sed -i "27i $line27" $file1
# sed -i "27i $line28" $file1

sed -i "s/$old1/$new1/" "$file1"
sed -i "s/$name_spaces_old/$name_spaces_new/g" "$file1"
sed -i "s/$symbol_old/$symbol_new/" "$file1"
sed -i "s/$priceOld2/$priceNew2/" "$file1"
sed -i "s/$supply_old/$supply_new/" "$file1"


cp ../contracts/OZGovernor.sol ../contracts/OZGovernor-${6}.sol

file2="../contracts/OZGovernor-${6}.sol"

old2="OZGovernor"
new2=${1}OZGovernor
sed -i "s/$old2/$new2/" "$file2"

# cp ../contracts/TimelockController.sol ../contracts/TimelockController-${6}.sol
cp ../contracts/TimeLock.sol ../contracts/TimeLock-${6}.sol

file3="../contracts/TimeLock-${6}.sol"

old3="TimeLock"
new3=${1}TimeLock
sed -i "s/$old3/$new3/" "$file3"

# Deploy DAO
#npx hardhat run ../scripts/deploy-dao.js --network hardhat