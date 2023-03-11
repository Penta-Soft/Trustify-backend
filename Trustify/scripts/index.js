const ethers = require('ethers');

module.exports = async function main (callback) {
    try {

        const mainAccount = "0x37613F7Ad1e1Facae764448749ca794DCFCC1B9d";
        const eShopAccount = "0x8FB439D137B3454e67C33C6Ff748d33Ef39Dc924";

        const reviewHolder = artifacts.require('ReviewHolder');
        const TullioCoin = artifacts.require('TullioCoin');
        const holder = await reviewHolder.deployed();
        const coin = await TullioCoin.deployed();

        //await coin.drip();
        //console.log(await holder.GetMapLenght());

        //console.log(ethers.utils.formatEther((await coin.balanceOf(mainAccount)).toString()));
        //await coin.approve(holder.address, ethers.utils.parseEther("10"));
        //console.log(ethers.utils.formatEther((await holder.CheckAllowanceAddress()).toString()));
        //await holder.DepositTokens(eShopAccount, ethers.utils.parseEther("1"));
        //console.log(ethers.utils.formatEther((await coin.balanceOf(mainAccount)).toString()));
        //console.log(ethers.utils.formatEther((await coin.balanceOf(eShopAccount)).toString()));


        //await holder.WriteAReview(eShopAccount, "HELOOOOOO", 3);
        //console.log(await holder.GetAReview(eShopAccount));
        //console.log((await holder.GetStars(eShopAccount)).toString());

      callback(0);
    } catch (error) {
      console.error(error);
      callback(1);
    }
  };