const tullioCoin = artifacts.require("TullioCoin");
const trustify = artifacts.require("ReviewHolder");

module.exports = async function(deployer) {
    await deployer.deploy(tullioCoin);
    console.log("TullioCoin contract address: " + tullioCoin.address);

    await deployer.deploy(trustify, tullioCoin.address);
    console.log("Trustify contract address: " + trustify.address);
}