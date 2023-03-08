const trustify = artifacts.require("ReviewHolder");

module.exports = async function(deployer) {
    await deployer.deploy(trustify);

    console.log("Trustify contract address: " + trustify.address);
}