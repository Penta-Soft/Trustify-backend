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

    it("Check if the user have payed a company", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      const result = await interface.havePayed(
        customerAddress,
        ecommerceAddress
      );
      expect(result).to.equal(true);
    });

    it("Write a valid review", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 3);

      const result = await interface.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("ACTIVE");
    });

    it("Try to write a review to yourself", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));

      try {
        await interface.writeAReview(customerAddress, "HELOOOOOO", 3);
      } catch (error) {
        expect(error.reason).to.equal(
          "You can't do this action to yourself Pal!"
        );
      }
    });

    it("Write 6 valid review and delete it one", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(tLogic.address, ethers.parseEther("10000"), {
        from: customerAddress,
      });
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(
        ecommerceAddress,
        ethers.parseEther("100"),
        {
          from: customerAddress,
        }
      );
      await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 1, {
        from: customerAddress,
      });

      await interface.depositTokens(
        ecommerceAddress2,
        ethers.parseEther("100"),
        {
          from: customerAddress,
        }
      );
      await interface.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      await interface.depositTokens(
        ecommerceAddress3,
        ethers.parseEther("100"),
        {
          from: customerAddress,
        }
      );
      await interface.writeAReview(ecommerceAddress3, "HELOOOOOOOO", 3, {
        from: customerAddress,
      });

      await interface.depositTokens(
        ecommerceAddress4,
        ethers.parseEther("100"),
        {
          from: customerAddress,
        }
      );
      await interface.writeAReview(ecommerceAddress4, "HELOOOOOOOOO", 4, {
        from: customerAddress,
      });

      await interface.depositTokens(
        ecommerceAddress5,
        ethers.parseEther("100"),
        {
          from: customerAddress,
        }
      );
      await interface.writeAReview(ecommerceAddress5, "HELOOOOOOOOOO", 5, {
        from: customerAddress,
      });

      await interface.deleteReview(ecommerceAddress5, {
        from: customerAddress,
      });

      const result = await interface.getMyReview(0, 10, {
        from: customerAddress,
      });
      const { 0: review, 1: stars, 2: state, 3: addresses } = result;

      expect(review[0]).to.equal("HELOOOOOOOOOO");
      expect(stars[0].toString()).to.equal("5");
      expect(state[0]).to.equal("DELETED");
      expect(addresses[0]).to.equal(ecommerceAddress5);
    });
  }
);
