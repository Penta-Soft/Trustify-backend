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

    it("TS2RFO2 - Verifica che l'utente possa rilasciare una recensione a una attività per cui abbia precedentemente effettuato un pagamento", async function () {
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

    it("TS2RFO2.4.2 - Verifica che l'utente possa visualizzare un messaggio di errore nel caso il valore del parametro di valutazione della recensione non sia valido", async function () {
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

    it("TS5RF05 - Verifica che l’utente possa effettuare la modifica di una propria recensione rilasciata in precedenza.", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 5);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOO");
      expect(stars.toString()).to.equal("5");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS5RF05.2 - Verifica che l’utente possa effettuare la modifica del parametro di valutazione di una propria recensione rilasciata in precedenza.", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 5);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOO");
      expect(stars.toString()).to.equal("5");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS5RF05.2.2 - Verifica che l'utente possa visualizzare un messaggio di errore nel caso in cui il valore modificato del parametro di valutazione non sia valido", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 5);

      try {
        await holder.writeAReview(ecommerceAddress, "HELOOOOOO", 0);
      } catch (error) {
        expect(error.reason).to.equal(
          "Error, stars must be a value between 0 and 5"
        );
      }
    });

    it("TS5RF05.3 - Verifica che l'utente possa modificare la descrizione di una propria recensione rilasciata in precedenza", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOOOOOOOO", 3);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOOOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS6RF06 - Verifica che l’utente possa eliminare una propria recensione precedentemente rilasciata", async function () {
      await coin.drip();
      await coin.approve(holder.address, ethers.parseEther("100"));
      await holder.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await holder.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await holder.deleteReview(ecommerceAddress);

      const result = await holder.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("DELETED");
    });

    it("TS6RF08 - Verifica che l’utente possa effettuare una ricerca sulle recensioni presenti nel sistema", async function () {
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
  }
);
