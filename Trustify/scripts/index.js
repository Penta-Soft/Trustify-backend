var ethers = require('ethers');

module.exports = async function main (callback) {
    try {

        const reviewHolder = artifacts.require('ReviewHolder');
        const TullioCoin = artifacts.require('TullioCoin');
        const holder = await reviewHolder.deployed();
        const coin = await TullioCoin.deployed();

        //await coin.drip();
        console.log(ethers.utils.formatEther((await coin.balanceOf("0xbef64b2909B05190C3d636F477F9D3AFFd04be63")).toString()));
        await coin.approve(holder.address, ethers.utils.parseEther("10"));
        console.log(ethers.utils.formatEther((await holder.CheckAllowanceAddress()).toString()));
        await holder.DepositTokens("0x501d6b620d34aE94bA969200A5fd484650BA0179", ethers.utils.parseEther("1"));
        console.log(ethers.utils.formatEther((await coin.balanceOf("0xbef64b2909B05190C3d636F477F9D3AFFd04be63")).toString()));
        console.log(ethers.utils.formatEther((await coin.balanceOf("0x501d6b620d34aE94bA969200A5fd484650BA0179")).toString()));


        await holder.WriteAReview("0x501d6b620d34aE94bA969200A5fd484650BA0179", "HELOOOOOO", 3);
        console.log(await holder.GetAReview("0x501d6b620d34aE94bA969200A5fd484650BA0179"));
        console.log((await holder.GetStars("0x501d6b620d34aE94bA969200A5fd484650BA0179")).toString());

      callback(0);
    } catch (error) {
      console.error(error);
      callback(1);
    }
  };