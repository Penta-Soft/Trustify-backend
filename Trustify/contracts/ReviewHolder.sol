// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
Piccole note: se l'address non esiste in blockchain non si può fare il mapping e il contratto resistuisce un errore.
le map sono automaticamente inizializzate a valori di default, quindi non si può fare il check se esiste un mapping o no, ma bisogna fare come è satto fatto sotto.
*/

contract ReviewHolder {
    IERC20 private token;

    struct Review {
        string review;
        uint8 stars;
        bool havePayed;
    }

    struct Company {
        address[] allReviewedAddress;
        mapping(address => Review) reviewMap;
    }

    mapping(address => Company) companyMap;

    constructor(address coinAddress) {
        token = IERC20(coinAddress);
    }

    function CheckTranslaction(
        address companyWalletAddress
    ) private view returns (bool) {
        if (companyMap[companyWalletAddress].reviewMap[msg.sender].havePayed) {
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

        require(stars > 0 && stars <= 5, "Error, stars must be greater than 0");

        Review memory _review = Review(review, stars, true);
        companyMap[addressToReview].reviewMap[msg.sender] = _review;
        companyMap[addressToReview].allReviewedAddress.push(msg.sender);
    }

    function GetAllCompanyReview(
        address companyAddress
    ) public view returns (string[] memory) {
        uint length = companyMap[companyAddress].allReviewedAddress.length;
        string[] memory reviews = new string[](length);

        for (uint i = 0; i < length; i++) {
            reviews[i] = companyMap[companyAddress]
                .reviewMap[companyMap[companyAddress].allReviewedAddress[i]]
                .review;
        }

        return reviews;
    }

    function GetMyReview(
        address addressReviewed
    ) public view returns (string memory) {
        string memory review = companyMap[addressReviewed]
            .reviewMap[msg.sender]
            .review;
        if (bytes(review).length == 0) {
            return "No review";
        }

        return review;
    }

    /*   
    function GetAllMyReview(
        address addressReviewed
    ) public view returns (string[] memory) {
        string[] memory reviews = new string[]();
        for (uint i = 0; i < 5; i++) {
            reviews[i] = reviewHolder[addressReviewed][msg.sender].review;
        }
        return reviews;
    }

*/

    function GetStars(address addressReviewed) public view returns (uint8) {
        return companyMap[addressReviewed].reviewMap[msg.sender].stars;
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
        companyMap[addressToDeposit].reviewMap[msg.sender] = Review(
            "",
            0,
            true
        );
    }
}
