// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
Piccole note: se l'address non esiste in blockchain non si può fare il mapping e il contratto resistuisce un errore.
le map sono automaticamente inizializzate a valori di default, quindi non si può fare il check se esiste un mapping o no, ma bisogna fare come è satto fatto sotto.
*/

contract ReviewHolder {
    using SafeERC20 for IERC20;

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
        token.safeTransferFrom(msg.sender, addressToDeposit, _amount);
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

        Review memory tmpReview = companyMap[addressToReview].reviewMap[
            msg.sender
        ];

        if (tmpReview.stars == 0 && bytes(tmpReview.review).length == 0) {
            Review memory _review = Review(review, stars, true);
            companyMap[addressToReview].reviewMap[msg.sender] = _review;
            companyMap[addressToReview].allReviewedAddress.push(msg.sender);
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
            customerMap[msg.sender].allReviewedCompany.push(addressToReview);
        } else {
            Review memory _review = Review(review, stars, true);
            companyMap[addressToReview].reviewMap[msg.sender] = _review;
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
        }
    }

    function GetAllCompanyReview(
        address companyAddress
    ) public view returns (string[] memory, uint8[] memory) {
        uint length = companyMap[companyAddress].allReviewedAddress.length;

        require(length != 0, "This company has not received any reviews");

        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);

        for (uint i = 0; i < length; i++) {
            Company storage company = companyMap[companyAddress];
            reviews[i] = company
                .reviewMap[company.allReviewedAddress[i]]
                .review;
            stars[i] = company.reviewMap[company.allReviewedAddress[i]].stars;
        }

        return (reviews, stars);
    }

    function GetSpecificReview(
        address addressReviewed
    ) public view returns (string memory, uint8) {
        uint8 stars = GetSpecificStars(addressReviewed);
        require(
            stars != 0,
            "You have not released any reviews to this address"
        );
        string memory review = companyMap[addressReviewed]
            .reviewMap[msg.sender]
            .review;

        /*
        if (bytes(review).length == 0) {
            return ("No review", 0);
        }
        */
        return (review, stars);
    }

    function GetAllMyReview()
        public
        view
        returns (string[] memory, uint8[] memory, address[] memory)
    {
        uint length = customerMap[msg.sender].allReviewedCompany.length;
        require(length != 0, "You have not released any reviews: length = ");

        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);
        address[] memory addresses = new address[](length);

        for (uint i = 0; i < length; i++) {
            Customer storage customer = customerMap[msg.sender];
            reviews[i] = customer
                .reviewMap[customer.allReviewedCompany[i]]
                .review;
            stars[i] = customer.reviewMap[customer.allReviewedCompany[i]].stars;
            addresses[i] = customer.allReviewedCompany[i];
        }

        return (reviews, stars, addresses);
    }

    function GetSpecificStars(
        address addressReviewed
    ) private view returns (uint8) {
        return companyMap[addressReviewed].reviewMap[msg.sender].stars;
    }

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
