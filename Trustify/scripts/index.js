const { ethers } = require('ethers');

module.exports = async function main (callback, wallets) {
    try {

        const Trustify = artifacts.require('Trustify');
        const TCoin = artifacts.require('TCoin');
        const tCoin = await artifacts.deploy(TCoin);
        const trustify = await artifacts.deploy(Trustify, tCoin.address);

        console.log("Trustify wallet" + wallets[0].address);


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