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

    // MAPPING STUFF
    struct Company {
        address[] allReviewedAddress;
        mapping(address => Review) reviewMap;
    }

    struct Customer {
        address[] allReviewedCompany;
        mapping(address => Review) reviewMap;
    }

    mapping(address => Company) companyMap;
    mapping(address => Customer) customerMap;

    constructor(address coinAddress) {
        token = IERC20(coinAddress);
    }

    //TRANSACTION STUFF
    function CheckTransaction(
        address companyWalletAddress
    ) public view returns (bool) {
        if (companyMap[companyWalletAddress].reviewMap[msg.sender].havePayed) {
            return true;
        } else {
            return false;
        }
    }

    modifier CheckAllowance(uint amount) {
        require(token.allowance(msg.sender, address(this)) >= amount, "Error");
        _;
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

    //REVIEW STUFF
    function WriteAReview(
        address addressToReview,
        string memory review,
        uint8 stars
    ) public {
        require(
            CheckTransaction(addressToReview),
            "You don't have a translaction from your address to this address"
        );

        require(
            stars > 0 && stars <= 5,
            "Error, stars must be a value between 0 and 5"
        );

        Review memory _review = Review(review, stars, true);
        companyMap[addressToReview].reviewMap[msg.sender] = _review;
        companyMap[addressToReview].allReviewedAddress.push(msg.sender);
        customerMap[msg.sender].reviewMap[addressToReview] = _review;
        customerMap[msg.sender].allReviewedCompany.push(addressToReview);
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

    function GetSpecificReview(
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

    function GetAllMyReview() public view returns (string[] memory) {
        uint length = customerMap[msg.sender].allReviewedCompany.length;
        string[] memory reviews = new string[](length);

        for (uint i = 0; i < length; i++) {
            reviews[i] = customerMap[msg.sender]
                .reviewMap[customerMap[msg.sender].allReviewedCompany[i]]
                .review;
        }

        return reviews;
    }

    function GetStars(address addressReviewed) public view returns (uint8) {
        return companyMap[addressReviewed].reviewMap[msg.sender].stars;
    }

    //funzione per calcolare la media di stelle ottenute da una certa compagnia
    function GetAverageStars(
        address addressReviewed
    ) public view returns (uint[] memory) {
        uint length = companyMap[addressReviewed].allReviewedAddress.length;

        uint[] memory stars = new uint[](length);
        for (uint i = 0; i < length; i++) {
            stars[i] = companyMap[addressReviewed]
                .reviewMap[companyMap[addressReviewed].allReviewedAddress[i]]
                .stars;
        }

        return stars;
    }
}
