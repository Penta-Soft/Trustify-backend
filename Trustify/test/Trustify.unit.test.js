const { expect } = require("chai");
const { ethers } = require("ethers");

const Trustify = artifacts.require("Trustify");
const TCoin = artifacts.require("TCoin");

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- TEST DI UNITA' ---------------------------------------------------------//

contract(
  "Trustify-unit-test",
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
    ecommerceAddress7,
    ecommerceAddress8,
    ecommerceAddress9,
  ]) {
    let holder;
    let coin;

    beforeEach(async function () {
      coin = await TCoin.new();
      holder = await Trustify.new(coin.address);
    });

    it("Deposit token ERC20 to an address", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      expect(
        ethers.formatEther((await coin.balanceOf(customerAddress)).toString())
      ).to.equal("99900.0");
      expect(
        ethers.formatEther((await coin.balanceOf(ecommerceAddress)).toString())
      ).to.equal("100.0");
    });

    it("Trying to deposit token ERC20 to you address and get an error", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      try {
        await holder.depositTokens(customerAddress, ethers.parseEther("100"));
      } catch (error) {
        expect(error.reason).to.equal(
          "You can't do this action to yourself Pal!"
        );
      }
    });

    it("Trying to deposit ERC20 token without having it", async function () {
      await coin.approve(holder.address, ethers.parseEther("100"));
    });

    it("Trying to deposit ERC20 token without approving", async function () {
      await coin.drip();

      try {
        await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      } catch (error) {
        expect(error.reason).to.equal("Error with token allowance");
      }
    });

    it("Write a valid review", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("ACTIVE");
    });

    it("Check if the user have payed a company", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      const result = await holder.havePayed(customerAddress, ecommerceAddress);
      expect(result).to.equal(true);
    });

    it("Try to write a review to yourself", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));

      try {
        await holder.writeAReview(customerAddress, "HELOOOOOO", 3);
      } catch (error) {
        expect(error.reason).to.equal(
          "You can't do this action to yourself Pal!"
        );
      }
    });

    it("Try to delete a review in your address", async function () {
      try {
        await holder.deleteReview(customerAddress);
      } catch (error) {
        expect(error.reason).to.equal(
          "You can't do this action to yourself Pal!"
        );
      }
    });

    it("Try to write a review with no transaction", async function () {
      try {
        await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3);
      } catch (error) {
        expect(error.reason).to.equal(
          "You dont have a translaction from your address to this address"
        );
      }
    });

    it("Ask for a non existing review", async function () {
      try {
        await holder.getSpecificReview(ecommerceAddress);
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert You have not released any reviews to this address"
        );
      }
    });

    it("Try to write a review with a wrong n° of stars", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      try {
        await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 0);
      } catch (error) {
        expect(error.reason).to.equal(
          "Error, stars must be a value between 0 and 5"
        );
      }
    });

    it("Try to write a review with only the stars", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      await holder.writeAReview(ecommerceAddress, "", 3);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars } = result;
      expect(review).to.equal("");
      expect(stars.toString()).to.equal("3");
    });

    it("Modify a existing reivew", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "", 3, {
        from: customerAddress,
      });

      await holder.writeAReview(ecommerceAddress, "CIAOOOOOO", 2, {
        from: customerAddress,
      });

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("CIAOOOOOO");
      expect(stars.toString()).to.equal("2");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("Write a review with different account and check if getAverageStars return the correct average of stars for that specific company", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 4, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 5, {
        from: customerAddress3,
      });

      let Average = await holder.getAverageStars(ecommerceAddress);

      let sum = 0;
      for (let i in Average) {
        sum = sum + parseInt(Average[i]);
      }
      let avg = sum / Average.length;

      expect(avg.toString()).to.equal("4");
    });

    it("Check if getAverageStars return an error when there are no review for that address", async function () {
      try {
        await holder.getAverageStars(ecommerceAddress);
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert This company has not received any reviews, cannot calculate average stars"
        );
      }
    });

    it("Write n review and check if getMyReview return the last n review", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress2, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress3, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress3, "HELOOOOOOOO", 1, {
        from: customerAddress,
      });

      const result = await holder.getMyReview(1, 2, { from: customerAddress });
      const { 0: review, 1: stars, 2: satate, 3: addresses } = result;

      expect(review[0]).to.equal("HELOOOOOOO");
      expect(review[1]).to.equal("HELOOOOOO");
      expect(stars[0].toString()).to.equal("2");
      expect(stars[1].toString()).to.equal("3");
      expect(addresses[0]).to.equal(ecommerceAddress2);
      expect(addresses[1]).to.equal(ecommerceAddress);
    });

    it("Get a non existing review from getMyReview", async function () {
      try {
        await holder.getMyReview(0, 1, { from: customerAddress });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert You have not released any reviews"
        );
      }
    });

    it("Set a start value that is > lenght of the review array for getMyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress2, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      try {
        await holder.getMyReview(2, 0, { from: customerAddress });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert Start must be less than the length of the array"
        );
      }
    });

    it("Set a start value > end value for getMyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress2, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      try {
        await holder.getMyReview(1, 0, { from: customerAddress });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert Start number must be less than end"
        );
      }
    });

    it("Write N review and ask for more than N review for getMyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress2, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress3, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress3, "HELOOOOOOOO", 1, {
        from: customerAddress,
      });

      const result = await holder.getMyReview(0, 25, { from: customerAddress });
      const { 0: review, 1: stars, 2: state, 3: addresses } = result;

      expect(review[2]).to.equal("HELOOOOOO");
      expect(review[1]).to.equal("HELOOOOOOO");
      expect(review[0]).to.equal("HELOOOOOOOO");
      expect(stars[2].toString()).to.equal("3");
      expect(stars[1].toString()).to.equal("2");
      expect(stars[0].toString()).to.equal("1");
      expect(addresses[2]).to.equal(ecommerceAddress);
      expect(addresses[1]).to.equal(ecommerceAddress2);
      expect(addresses[0]).to.equal(ecommerceAddress3);
    });

    it("Write N review and ask for more than 25 review for getMyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOO", 1, {
        from: customerAddress3,
      });

      try {
        await holder.getMyReview(0, 26, { from: customerAddress });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert You can get max 25 reviews per call"
        );
      }
    });

    it("Write a review with different account and check if getCompanyReview return the array of reviews and stars", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOO", 1, {
        from: customerAddress3,
      });

      await coin.drip({ from: customerAddress4 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress4,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress4,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOO", 5, {
        from: customerAddress4,
      });

      const result = await holder.getCompanyReview(1, 2, ecommerceAddress);
      const { 0: review, 1: stars } = result;
      expect(review[1]).to.equal("HELOOOOOOO");
      expect(review[0]).to.equal("HELOOOOOOOO");
      expect(stars[1].toString()).to.equal("2");
      expect(stars[0].toString()).to.equal("1");
    });

    it("Get a non existing review from getCompanyReview", async function () {
      try {
        await holder.getCompanyReview(0, 1, ecommerceAddress, {
          from: customerAddress,
        });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert This company have not received any reviews"
        );
      }
    });

    it("Set a start value that is > lenght of the review array for getCompanyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      try {
        await holder.getCompanyReview(2, 0, ecommerceAddress, {
          from: customerAddress,
        });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert Start must be less than the length of the array"
        );
      }
    });

    it("Set a start value > end value for getCompanyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      try {
        await holder.getCompanyReview(1, 0, ecommerceAddress, {
          from: customerAddress,
        });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert Start number must be less than end"
        );
      }
    });

    it("Write N review and ask for more than N review for getCompanyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOO", 1, {
        from: customerAddress3,
      });

      const result = await holder.getCompanyReview(0, 25, ecommerceAddress, {
        from: customerAddress,
      });
      const { 0: review, 1: stars } = result;

      expect(review[2]).to.equal("HELOOOOOO");
      expect(review[1]).to.equal("HELOOOOOOO");
      expect(review[0]).to.equal("HELOOOOOOOO");
      expect(stars[2].toString()).to.equal("3");
      expect(stars[1].toString()).to.equal("2");
      expect(stars[0].toString()).to.equal("1");
    });

    it("Write N review and ask for more than 25 review for getCompanyReview", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOO", 1, {
        from: customerAddress3,
      });

      try {
        await holder.getCompanyReview(0, 26, ecommerceAddress, {
          from: customerAddress,
        });
      } catch (error) {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert You can get max 25 reviews per call"
        );
      }
    });

    it("Write 6 valid review and delete it one", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 1, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress2, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress2, "HELOOOOOOO", 2, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress3, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress3, "HELOOOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress4, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress4, "HELOOOOOOOOO", 4, {
        from: customerAddress,
      });

      await coin.approve(holder.address, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.depositTokens(ecommerceAddress5, ethers.parseEther("100"), {
        from: customerAddress,
      });
      await holder.writeAReview(ecommerceAddress5, "HELOOOOOOOOOO", 5, {
        from: customerAddress,
      });

      await holder.deleteReview(ecommerceAddress5, { from: customerAddress });

      const result = await holder.getMyReview(0, 10, { from: customerAddress });
      const { 0: review, 1: stars, 2: state, 3: addresses } = result;

      expect(review[0]).to.equal("HELOOOOOOOOOO");
      expect(stars[0].toString()).to.equal("5");
      expect(state[0]).to.equal("DELETED");
      expect(addresses[0]).to.equal(ecommerceAddress5);
    });

    it("should be able to create a new customer", async function () {
      await holder.forceAddReview(
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
