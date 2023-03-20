const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- TEST DI UNITA' ---------------------------------------------------------//

contract('TCoin-unit-test', function ([ customerAddress, customerAddress2, customerAddress3, ecommerceAddress, ecommerceAddress2, ecommerceAddress3, ecommerceAddress4, ecommerceAddress5, ecommerceAddress6]) {
    let coin;

    beforeEach(async function () {
        coin = await TCoin.new();
        holder = await Trustify.new(coin.address);
    });

    it('Getting ERC20 TCoin token', async function () {
        await coin.drip();

        expect(ethers.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("100000.0");
    });

});

