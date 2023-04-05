const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- DEPLOY SMART CONTRACT PER API REST ---------------------------------------------------------//

contract('RESTAPI', function ([customerAddress, customerAddress2, customerAddress3, customerAddress4, customerAddress5, customerAddress6, customerAddress7, customerAddress8, ecommerceAddress]) {
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


        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress2 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress3 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress4 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress5 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress6 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress7 });
        await coin.approve(holder.address, ethers.parseEther("100"), { from: customerAddress8 });


        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress2 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress3 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress4 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress5 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress6 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress7 });
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), { from: customerAddress8 });


        await holder.WriteAReview(ecommerceAddress, "prova prova SA", 1, { from: customerAddress });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASA", 2, { from: customerAddress2 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASA", 3, { from: customerAddress3 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASASA", 4, { from: customerAddress4 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASASASA", 5, { from: customerAddress5 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASASASASA", 1, { from: customerAddress6 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASASASASASA", 2, { from: customerAddress7 });
        await holder.WriteAReview(ecommerceAddress, "prova prova SASASASASASASASA", 3, { from: customerAddress8 });
    
        console.log("contract address: " + holder.address);
        console.log("company address: " + ecommerceAddress);

        
    });

});

