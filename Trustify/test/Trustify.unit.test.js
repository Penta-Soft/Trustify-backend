const { expect } = require('chai');
const { ethers } = require('ethers');

const Trustify = artifacts.require('Trustify');
const TCoin = artifacts.require('TCoin');

//customeraddrerss è il primo address della blockchain (quello con index 0) etc etc...

//--------------------------------------------------------- TEST DI UNITA' ---------------------------------------------------------//

contract('Trustify-unit-test', function ([ customerAddress, customerAddress2, customerAddress3, ecommerceAddress, ecommerceAddress2, ecommerceAddress3, ecommerceAddress4, ecommerceAddress5, ecommerceAddress6, ecommerceAddress7, ecommerceAddress8, ecommerceAddress9, ecommerceAddress10]) {
    let holder;
    let coin;

    beforeEach(async function () {
        coin = await TCoin.new();
        holder = await Trustify.new(coin.address);
    });

    it('Deposit ERC20 token', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));


        expect(ethers.formatEther((await coin.balanceOf(customerAddress)).toString())).to.equal("99900.0");
        expect(ethers.formatEther((await coin.balanceOf(ecommerceAddress)).toString())).to.equal("100.0");
    });

    it('Trying to deposit ERC20 token without having it', async function () {
        await coin.approve(holder.address, ethers.parseEther("100"));
        
        try {
            await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));
        } catch (error) {
            expect(error.reason).to.equal("ERC20: transfer amount exceeds balance");
        }
    });

    it('Trying to deposit ERC20 token without approving', async function () {
        await coin.drip();

        try {
            await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));
        } catch (error) {
            expect(error.reason).to.equal("Error with token allowance");
        }
        
    });

    it('Write a valid review', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));
        await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3);

        const result = await holder.GetSpecificReview(ecommerceAddress);
        const {0: review, 1: stars} = result;
        expect(review).to.equal("HELOOOOOO");
        expect(stars.toString()).to.equal("3");
    });


    it('Try to write a review with no transaction', async function () {  
        try {
            await holder.WriteAReview(ecommerceAddress, "HELOOOOOO", 3);
        } catch (error) {
            expect(error.reason).to.equal("You dont have a translaction from your address to this address");
        }
    });


    it('Try to write a review with only the stars', async function () {
        await coin.drip();
        await coin.approve(holder.address, ethers.parseEther("100"));
        await holder.DepositTokens(ecommerceAddress, ethers.parseEther("100"));

        await holder.WriteAReview(ecommerceAddress, "", 3);

        const result = await holder.GetSpecificReview(ecommerceAddress);
        const {0: review, 1: stars} = result;
        expect(review).to.equal("");
        expect(stars.toString()).to.equal("3");
    });

    /*
    it('Write a review with different account and check if GetAllMyReview return the array of my reviews and stars empty', async function () {
        try {
            await holder.GetAllCompanyReview(ecommerceAddress);
        } catch (error) {
            expect(error.message).to.equal("Returned error: VM Exception while processing transaction: revert This company has not received any reviews");
        }
    });
*/

    it('Check if GetAverageStars return an error when there are no review for that address', async function () {
        try {
            await holder.GetAverageStars(ecommerceAddress);
        } catch (error) {
            expect(error.message).to.equal("Returned error: VM Exception while processing transaction: revert This company has not received any reviews, cannot calculate average stars");
        }
    });


});