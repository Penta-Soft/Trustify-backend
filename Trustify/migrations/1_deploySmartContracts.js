const TCoin = artifacts.require("TCoin");
const trustify = artifacts.require("Trustify");

module.exports = async function(deployer) {
    await deployer.deploy(TCoin);
    console.log("TCoin contract address: " + TCoin.address);

    await deployer.deploy(trustify, TCoin.address);
    console.log("Trustify contract address: " + trustify.address);
}