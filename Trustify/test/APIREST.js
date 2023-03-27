const { expect } = require('chai');
const { ethers } = require('ethers');
//import { LoremIpsum } from "lorem-ipsum";
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- DEPLOY SMART CONTRACT PER API REST ---------------------------------------------------------//

contract('RESTAPI', function ([customerAddress, customerAddress2, customerAddress3, customerAddress4, customerAddress5, customerAddress6, customerAddress7, customerAddress8, customerAddress9, customeraddrerss10, customeraddrerss11, customeraddrerss12, customeraddrerss13, customeraddrerss14, customeraddrerss15, customeraddrerss16, customeraddrerss17, customeraddrerss18, customeraddrerss19, ecommerceAddress]) {
    let coin;
    let holder;

    beforeEach(async function () {
        coin = await TCoin.new();
        holder = await Trustify.new(coin.address);
    });

    it('Deploy token and contract', async function () {

        await coin.drip({ from: customerAddress });
        await coin.drip({ from: customerAddress2 });
        await coin.drip({ from: customerAddress3 });
        await coin.drip({ from: customerAddress4 });
        await coin.drip({ from: customerAddress5 });
        await coin.drip({ from: customerAddress6 });
        await coin.drip({ from: customerAddress7 });
        await coin.drip({ from: customerAddress8 });
        await coin.drip({ from: customerAddress9 });
        await coin.drip({ from: customeraddrerss10 });
        await coin.drip({ from: customeraddrerss11 });
        await coin.drip({ from: customeraddrerss12 });
        await coin.drip({ from: customeraddrerss13 });
        await coin.drip({ from: customeraddrerss14 });
        await coin.drip({ from: customeraddrerss15 });
        await coin.drip({ from: customeraddrerss16 });
        await coin.drip({ from: customeraddrerss17 });
        await coin.drip({ from: customeraddrerss18 });
        await coin.drip({ from: customeraddrerss19 });

        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress2 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress3 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress4 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress5 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress6 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress7 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress8 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress9 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss10 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss11 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss12 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss13 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss14 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss15 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss16 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss17 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss18 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customeraddrerss19 });

        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress2 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress3 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress4 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress5 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress6 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress7 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress8 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress9 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss10 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss11 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss12 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss13 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss14 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss15 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss16 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss17 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss18 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customeraddrerss19 });

        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress2 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress3 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress4 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress5 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress6 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress7 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress8 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customerAddress9 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss10 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss11 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss12 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss13 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss14 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss15 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss16 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss17 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss18 });
        await holder.WriteAReview(ecommerceAddress, lorem.generateSentences(4), Math.floor(Math.random() * 5) + 1, { from: customeraddrerss19 });

        
        console.log("contract address: " + holder.address);
        console.log("company address: " + ecommerceAddress);

        
    });

});

