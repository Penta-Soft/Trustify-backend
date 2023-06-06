const { expect } = require("chai");
const { ethers } = require("ethers");

const Trustify = artifacts.require("Trustify");
const TCoin = artifacts.require("TCoin");
const TLogic = artifacts.require("TrustifyLogic");
const TDatabases = artifacts.require("TrustifyDatabase");

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- TEST DI SISTEMA ---------------------------------------------------------//

contract(
  "Requirements-test",
  function ([
    customerAddress,
    customerAddress2,
    customerAddress3,
    customerAddress4,
    ecommerceAddress,
    ecommerceAddress2,
    ecommerceAddress3,
    ecommerceAddress4,
    ecommerceAddress5,
    ecommerceAddress6,
  ]) {
    let interface;
    let coin;
    let tLogic;
    let tDatabase;

    beforeEach(async function () {
      coin = await TCoin.new();
      tDatabase = await TDatabases.new();
      tLogic = await TLogic.new(coin.address, tDatabase.address);
      interface = await Trustify.new(tLogic.address);
    });

    it("should be able to create a new customer", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      expect(
        ethers.formatEther((await coin.balanceOf(customerAddress)).toString())
      ).to.equal("99900.0");
      expect(
        ethers.formatEther((await coin.balanceOf(ecommerceAddress)).toString())
      ).to.equal("100.0");
    });
  }
);
