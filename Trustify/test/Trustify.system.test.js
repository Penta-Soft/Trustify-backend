const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- TEST DI SISTEMA ---------------------------------------------------------//

contract('Trustify-system-test', function ([ customerAddress, customerAddress2, customerAddress3, customerAddress4, ecommerceAddress, ecommerceAddress2, ecommerceAddress3, ecommerceAddress4, ecommerceAddress5, ecommerceAddress6]) {
    let holder;
    let coin;

    beforeEach(async function () {
        coin = await TCoin.new();
        holder = await Trustify.new(coin.address);
    });

    it('Write 6 valid review and delete it', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 1, {from: customerAddress});
        
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress2, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress2, "HELOOOOOOO", 2, {from: customerAddress});

        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress3, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress3, "HELOOOOOOOO", 3, {from: customerAddress});

        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress4, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress4, "HELOOOOOOOOO", 4, {from: customerAddress});

        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress5, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress5, "HELOOOOOOOOOO", 5, {from: customerAddress});

        await holder.DeleteReview(ecommerceAddress3, {from: customerAddress});


        const result = await holder.GetNMyReview(0, 10,{from: customerAddress});
        const {0: review, 1: stars, 2: addresses} = result;

        
        expect(review[0]).to.equal("HELOOOOOO");
        expect(review[1]).to.equal("HELOOOOOOO");
        expect(review[2]).to.equal("HELOOOOOOOOO");
        expect(review[3]).to.equal("HELOOOOOOOOOO");

        expect(stars[0].toString()).to.equal("1");
        expect(stars[1].toString()).to.equal("2");
        expect(stars[2].toString()).to.equal("4");
        expect(stars[3].toString()).to.equal("5");
        expect(addresses[0]).to.equal(ecommerceAddress);
        expect(addresses[1]).to.equal(ecommerceAddress2);
        expect(addresses[2]).to.equal(ecommerceAddress4);
        expect(addresses[3]).to.equal(ecommerceAddress5);

    });


});
