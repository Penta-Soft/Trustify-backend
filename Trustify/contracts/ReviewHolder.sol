// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
Piccole note: se l'address non esiste in blockchain non si può fare il mapping e il contratto resistuisce un errore.
le map sono automaticamente inizializzate a valori di default, quindi non si può fare il check se esiste un mapping o no, ma bisogna fare come è satto fatto sotto.
*/

contract ReviewHolder {
    IERC20 token;
    struct Review {
        string review;
        uint8 stars;
        bool havePayed;
    }

    //qui tiene nell'address dell'e-shop una recensione con l'address del cliente
    mapping(address => mapping(address => Review)) reviewHolder;

    constructor(address coinAddress) {
        token = IERC20(coinAddress);
    }

    function CheckTranslaction(
        address companyWalletAddress
    ) private view returns (bool) {
        if (reviewHolder[companyWalletAddress][msg.sender].havePayed) {
            return true;
        } else {
            return false;
        }
    }

    function WriteAReview(
        address addressToReview,
        string memory review,
        uint8 stars
    ) public {
        require(
            CheckTranslaction(addressToReview),
            "You don't have a translaction from your address to this address"
        );

        require(stars > 0 || stars <= 5, "Error, stars must be greater than 0");

        Review memory _review = Review(review, stars, true);
        reviewHolder[addressToReview][msg.sender] = _review;
    }

    function GetAReview(
        address addressReviewed
    ) public view returns (string memory) {
        string storage review = reviewHolder[addressReviewed][msg.sender]
            .review;
        if (bytes(review).length == 0) {
            return "No review";
        }

        return reviewHolder[addressReviewed][msg.sender].review;
    }

    function GetStars(address addressReviewed) public view returns (uint8) {
        return reviewHolder[addressReviewed][msg.sender].stars;
    }

    modifier CheckAllowance(uint amount) {
        require(token.allowance(msg.sender, address(this)) >= amount, "Error");
        _;
    }

    function CheckAllowanceAddress() public view returns (uint) {
        return token.allowance(msg.sender, address(this));
    }

    function DepositTokens(
        address addressToDeposit,
        uint _amount
    ) public CheckAllowance(_amount) {
        token.transferFrom(msg.sender, addressToDeposit, _amount);
        reviewHolder[addressToDeposit][msg.sender] = Review("", 0, true);
    }
}
