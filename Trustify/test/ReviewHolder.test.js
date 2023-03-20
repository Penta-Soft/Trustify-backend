const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...
/*
contract('Trustify', function ([ customerAddress, customerAddress2, customerAddress3, ecommerceAddress, ecommerceAddress2, ecommerceAddress3, ecommerceAddress4, ecommerceAddress5, ecommerceAddress6]) {
    let holder;
    let coin;

    beforeEach(async function () {
        coin = await TCoin.new();
        holder = await Trustify.new(coin.address);
    });

    it('Getting a single review with stars', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3);

        const result = await holder.GetSpecificReview(ecommerceAddress);
        const {0: review, 1: stars} = result;
        expect(review).to.equal("HELOOOOOO");
        expect(stars.toString()).to.equal("3");
    });

    it('Write a review with different account and check if GetAllCompanyReview return the array of reviews and stars', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3, {from: customerAddress});

        await coin.drip({from: customerAddress2});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress2});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress2});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOOO", 2, {from: customerAddress2});

        await coin.drip({from: customerAddress3});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress3});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress3});
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOOOO", 1, {from: customerAddress3});

        const result = await holder.GetAllCompanyReview(ecommerceAddress);
        const {0: review, 1: stars} = result;
        expect(review[0]).to.equal("HELOOOOOO");
        expect(review[1]).to.equal("HELOOOOOOO");
        expect(review[2]).to.equal("HELOOOOOOOO");
        expect(stars[0].toString()).to.equal("3");
        expect(stars[1].toString()).to.equal("2");
        expect(stars[2].toString()).to.equal("1");
    }); 

    it('Write multiple review with one account and check if GetAllMyReview return the array of my reviews ans stars', async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "CIAOOOO", 3, {from: customerAddress});

        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress2, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress2, "CIAOOOOO", 2, {from: customerAddress});

        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress3, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress3, "CIAOOOOOO", 1, {from: customerAddress});

        const result = await holder.GetAllMyReview({from: customerAddress});
        const {0: review, 1: stars, 2: addresses} = result;
        expect(review[0]).to.equal("CIAOOOO");
        expect(review[1]).to.equal("CIAOOOOO");
        expect(review[2]).to.equal("CIAOOOOOO");
        expect(stars[0].toString()).to.equal("3");
        expect(stars[1].toString()).to.equal("2");
        expect(stars[2].toString()).to.equal("1");
        expect(addresses[0]).to.equal(ecommerceAddress);
        expect(addresses[1]).to.equal(ecommerceAddress2);
        expect(addresses[2]).to.equal(ecommerceAddress3);   
    });

    it("Modify a existing reivew", async function () {
        await coin.drip({from: customerAddress});
        await coin.approve(holder.address, ethers.parseEther("100"), {from: customerAddress});
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"), {from: customerAddress});
        await holder.WriteAReview(ecommerceAddress, "", 3, {from: customerAddress});

        await holder.WriteAReview(ecommerceAddress, "CIAOOOOOO", 2, {from: customerAddress});

        const result = await holder.GetSpecificReview(ecommerceAddress);
        const {0: review, 1: stars} = result;
        expect(review).to.equal("CIAOOOOOO");
        expect(stars.toString()).to.equal("2");
    });
    
    */
    /*
    it('Getting ERC20 TCoin', async function () {
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

*/