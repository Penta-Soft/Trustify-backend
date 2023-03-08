const tullioCoin = artifacts.require("TullioCoin");

module.exports = async function(deployer) {
    await deployer.deploy(tullioCoin);

    console.log("TullioCoin contract address: " + tullioCoin.address);
}