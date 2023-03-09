const { expect } = require('chai');
const ethers = require('ethers');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const reviewHolder = artifacts.require('ReviewHolder');
const TullioCoin = artifacts.require('TullioCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0), mentre ecommerceAddress è il secondo (quello con index 1) etc etc
contract('ReviewHolder', function ([ customerAddress, ecommerceAddress, ecommerceAddress2 ]) {
    let holder;
    let coin;

    beforeEach(async function () {
        coin = await TullioCoin.new();
        holder = await reviewHolder.new(coin.address);
    });

    it('Getting ERC20 TullioCoin', async function () {
        await coin.drip();

        expect(ethers.utils.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("100000.0");
    });

    it('Checking allowance', async function () {
        console.log(ethers.utils.formatEther((await coin.balanceOf(customerAddress)).toString()));
        await coin.approve(holder.address, ethers.utils.parseEther("100"));


        expect(ethers.utils.formatEther((await holder.CheckAllowanceAddress()).toString())).to.equal("100.0");
    });


});