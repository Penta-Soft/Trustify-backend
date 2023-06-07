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

    it("TS2RFO2 - Verifica che l'utente possa rilasciare una recensione a una attività per cui abbia precedentemente effettuato un pagamento", async function () {
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

    it("TS2RFO2.4.2 - Verifica che l'utente possa visualizzare un messaggio di errore nel caso il valore del parametro di valutazione della recensione non sia valido", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));

      try {
        await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 0);
      } catch (error) {
        expect(error.reason).to.equal(
          "Error, stars must be a value between 0 and 5"
        );
      }
    });

    it("TS5RF05 - Verifica che l’utente possa effettuare la modifica di una propria recensione rilasciata in precedenza.", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 5);

      const result = await interface.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOO");
      expect(stars.toString()).to.equal("5");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS5RF05.2 - Verifica che l’utente possa effettuare la modifica del parametro di valutazione di una propria recensione rilasciata in precedenza.", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 5);

      const result = await interface.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOO");
      expect(stars.toString()).to.equal("5");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS5RF05.2.2 - Verifica che l'utente possa visualizzare un messaggio di errore nel caso in cui il valore modificato del parametro di valutazione non sia valido", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 5);

      try {
        await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 0);
      } catch (error) {
        expect(error.reason).to.equal(
          "Error, stars must be a value between 0 and 5"
        );
      }
    });

    it("TS5RF05.3 - Verifica che l'utente possa modificare la descrizione di una propria recensione rilasciata in precedenza", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOOOOOOOO", 3);

      const result = await interface.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOOOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("MODIFIED");
    });

    it("TS6RF06 - Verifica che l’utente possa eliminare una propria recensione precedentemente rilasciata", async function () {
      await coin.drip();
      await coin.approve(tLogic.address, ethers.parseEther("100"));
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(ecommerceAddress, ethers.parseEther("100"));
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOOO", 3);
      await interface.deleteReview(ecommerceAddress);

      const result = await interface.getSpecificReview(ecommerceAddress);
      const { 0: review, 1: stars, 2: state } = result;
      expect(review).to.equal("HELOOOOOOOOOO");
      expect(stars.toString()).to.equal("3");
      expect(state.toString()).to.equal("DELETED");
    });

    it("TS6RF08 - Verifica che l’utente possa effettuare una ricerca sulle recensioni presenti nel sistema", async function () {
      await coin.drip({ from: customerAddress });
      await coin.approve(tLogic.address, ethers.parseEther("100"), {
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
      await interface.writeAReview(ecommerceAddress, "HELOOOOOO", 3, {
        from: customerAddress,
      });

      await coin.drip({ from: customerAddress2 });
      await coin.approve(tLogic.address, ethers.parseEther("100"), {
        from: customerAddress2,
      });
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(
        ecommerceAddress,
        ethers.parseEther("100"),
        {
          from: customerAddress2,
        }
      );
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOO", 2, {
        from: customerAddress2,
      });

      await coin.drip({ from: customerAddress3 });
      await coin.approve(tLogic.address, ethers.parseEther("100"), {
        from: customerAddress3,
      });
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(
        ecommerceAddress,
        ethers.parseEther("100"),
        {
          from: customerAddress3,
        }
      );
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOO", 1, {
        from: customerAddress3,
      });

      await coin.drip({ from: customerAddress4 });
      await coin.approve(tLogic.address, ethers.parseEther("100"), {
        from: customerAddress4,
      });
      await tDatabase.setContractLogicAddress(tLogic.address);
      await interface.depositTokens(
        ecommerceAddress,
        ethers.parseEther("100"),
        {
          from: customerAddress4,
        }
      );
      await interface.writeAReview(ecommerceAddress, "HELOOOOOOOOO", 5, {
        from: customerAddress4,
      });

      const result = await interface.getCompanyReview(1, 2, ecommerceAddress);
      const { 0: review, 1: stars } = result;
      expect(review[1]).to.equal("HELOOOOOOO");
      expect(review[0]).to.equal("HELOOOOOOOO");
      expect(stars[1].toString()).to.equal("2");
      expect(stars[0].toString()).to.equal("1");
    });
  }
);
