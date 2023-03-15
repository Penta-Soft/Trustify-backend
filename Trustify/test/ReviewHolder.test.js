const { expect } = require('chai');
const { ethers } = require('ethers');

const reviewHolder = artifacts.require('ReviewHolder');
const TullioCoin = artifacts.require('TullioCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...
contract('ReviewHolder', function ([ customerAddress, customerAddress2, customerAddress3, ecommerceAddress, ecommerceAddress2, ecommerceAddress3, ecommerceAddress4, ecommerceAddress5, ecommerceAddress6]) {
    let holder;
    let coin;

    beforeEach(async function () {
        coin = await TullioCoin.new();
        holder = await reviewHolder.new(coin.address);
    });

    it('Getting ERC20 TullioCoin', async function () {
        await coin.drip();

        expect(ethers.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("100000.0");
    });

    it('Deposit token ERC20', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));


        expect(ethers.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("99900.0");
        expect(ethers.formatEther((await coin.balanceOf(ecommerceAddress)).toString())).to.equal("100.0");
    });

    it('Write a valid review', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3);
        
        expect(await holder.GetSpecificReview(ecommerceAddress)).to.equal("HELOOOOOO");
        expect((await holder.GetStars(ecommerceAddress)).toString()).to.equal("3");
    });

    it('Ask for a non existing review', async function () {
        expect(await holder.GetSpecificReview(ecommerceAddress)).to.equal("No review");
    });


    it('Try to write a review with no transaction', async function () {
        
        let err = null

        try {
            await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3);
        } catch (error) {
            err = error
        }

        assert.ok(err instanceof Error)
    });

    it('Try to write a review with a wrong n° of star', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));

        let err = null

        try {
            await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 0);
        } catch (error) {
            err = error
        }

        assert.ok(err instanceof Error)
    });

    
    it('Write a review with different account and check if GetAllCompanyReview return an array of reviews', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3, {from: customerAddress});

        await coin.drip({from: customerAddress2});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress2});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress2});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3, {from: customerAddress2});

        await coin.drip({from: customerAddress3});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress3});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress3});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3, {from: customerAddress3});

        let reviews = await holder.GetAllCompanyReview(ecommerceAddress);
        for(let i = 0; i < reviews.length; i++){
            expect(reviews[i]).to.equal("HELOOOOOO");
        }
    }); 

    it('Write multiple review with one account and check if GetAllMyReview return an array of my reviews', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "Test", 3, {from: customerAddress});

        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress2, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress2, "Test", 3, {from: customerAddress});

        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress3, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress3, "Test", 3, {from: customerAddress});

        let reviews = await holder.GetAllMyReview({from: customerAddress});
        for(let i = 0; i < reviews.length; i++){
            expect(reviews[i]).to.equal("Test");
        }
    });

    it('Write a review with different account and check if GetAverageStars return the correct average of stars for that specific company', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3, {from: customerAddress});

        await coin.drip({from: customerAddress2});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress2});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress2});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 4, {from: customerAddress2});

        await coin.drip({from: customerAddress3});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress3});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress3});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 5, {from: customerAddress3});

        let Average = await holder.GetAverageStars(ecommerceAddress);

        let sum = 0;
        for(let i in Average) {
            sum = sum + parseInt(Average[i]);
        }
        let avg = sum/(Average.length);
        
        expect((avg).toString()).to.equal("4");
    }); 

});