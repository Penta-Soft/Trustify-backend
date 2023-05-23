const { expect } = require("chai");
const { ethers } = require("ethers");

const Trustify = artifacts.require("Trustify");
const TCoin = artifacts.require("TCoin");

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
    let holder;
    let coin;

    beforeEach(async function () {
      coin = await TCoin.new();
      holder = await Trustify.new(coin.address);
    });

    it("should be able to create a new customer", async function () {
      await holder.addReview(
        customerAddress,
        ecommerceAddress,
        "HELOOOOOO",
        3,
        "ACTIVE",
        {
          from: customerAddress,
        }
      );

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("ACTIVE");
    });
  }
);
