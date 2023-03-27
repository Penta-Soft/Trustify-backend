const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- DEPLOY SMART CONTRACT PER API REST ---------------------------------------------------------//

contract('RESTAPI', function ([ customerAddress, customerAddress2, customerAddress3, customerAddress4, customerAddress5, customerAddress6, customerAddress7, customerAddress8, ecommerceAddress]) {
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

        await holder.WriteAReview(ecommerceAddress, "Molto buono", 1, { from: customerAddress });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox2", 2, { from: customerAddress2 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox3", 3, { from: customerAddress3 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox4", 4, { from: customerAddress4 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox5", 5, { from: customerAddress5 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox6", 1, { from: customerAddress6 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox7", 2, { from: customerAddress7 });
        await holder.WriteAReview(ecommerceAddress, "Molto buonox8", 3, { from: customerAddress8 });


        const result = await holder.GetNCompanyReview(1, 8, ecommerceAddress);
        const {0: review, 1: stars} = result;

        /*
        for(var i = 0; i < review.length; i++){
            expect(review[i]).to.equal("Molto buono");
            expect(stars[i].toString()).to.equal("3");
        }
        */
        console.log("contract address: " + holder.address);
        console.log("company address: " + ecommerceAddress);
        
    });

});

