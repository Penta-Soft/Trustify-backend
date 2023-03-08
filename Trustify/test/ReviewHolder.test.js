const { expect } = require('chai');
const ethers = require('ethers');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const reviewHolder = artifacts.require('ReviewHolder');
const TullioCoin = artifacts.require('TullioCoin');

let customerAddress = "0xbef64b2909B05190C3d636F477F9D3AFFd04be63";  //mettette l'index 0 della lista di account
let ecommerceAddress = "0x1A8EF72e5378131C813793A4bEad3DbFD3515DC9";
let ecommerceAddress2 = "0x501d6b620d34aE94bA969200A5fd484650BA0179";

contract('ReviewHolder', function ([ owner, other ]) {

  beforeEach(async function () {
    this.holder = await reviewHolder.new({ from: owner });
  });

  it('Getting ERC20 TullioCoin from owner', async function () {
    const coin = await TullioCoin.deployed();
    await coin.drip({ from: owner });

    expect(ethers.utils.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("100000.0");
  });

});