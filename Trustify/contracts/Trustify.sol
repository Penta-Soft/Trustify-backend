// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
Piccole note: se l'address non esiste in blockchain non si può fare il mapping e il contratto resistuisce un errore.
le map sono automaticamente inizializzate a valori di default, quindi non si può fare il check se esiste un mapping o no, ma bisogna fare come è stato fatto sotto.
*/

contract Trustify {
    using SafeERC20 for IERC20;

    IERC20 private token;

    struct Review {
        string review;
        uint8 stars;
        bool havePayed;
    }

    // MAPPING STUFF
    struct Company {
        address[] allCustomerAddress; //tiene tutti gli address degli utenti che hanno fatto una review a questa azienda (serve per la funzione che restituisce tutte le review di un'azienda)
        mapping(address => Review) reviewMap; //map con address di ogni utente e la review che ha fatto a questa azienda
    }

    struct Customer {
        address[] allCompanyAddress; //tiene tutti gli address delle aziende che hanno ricevuto una review da questo utente (serve per la funzione che restituisce tutte le review di un utente)
        mapping(address => Review) reviewMap; //map con address di ogni azienda/e-shop e la review che ha fatto l'utente
    }

    mapping(address => Company) companyMap; //map con address di ogni azienda/e-shop
    mapping(address => Customer) customerMap; //map con address di ogni utente

    constructor(address coinAddress) {
        token = IERC20(coinAddress);
    }

    //TRANSACTION STUFF
    function CheckTransaction(
        address companyWalletAddress
    ) private view returns (bool) {
        if (companyMap[companyWalletAddress].reviewMap[msg.sender].havePayed) {
            return true;
        } else {
            return false;
        }
    }

    modifier CheckAllowance(uint amount) {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Error with token allowance"
        );
        _;
    }

    function DepositTokens(
        address addressToDeposit,
        uint _amount
    ) public CheckAllowance(_amount) {
        companyMap[addressToDeposit].reviewMap[msg.sender] = Review(
            "",
            0,
            true
        );
        token.safeTransferFrom(msg.sender, addressToDeposit, _amount);
    }

    //REVIEW STUFF
    /*
        La funzione che scrive la review si accorge se l'utente ha già scritto una review per quella 
        azienda (guarda se le stelle sono a 0, valore impossibile da mettere al di fuori dal contratto),
        in tal caso sovrascrive la vecchia review con la nuova, altrimenti crea una nuova review.
    */
    function WriteAReview(
        address addressToReview,
        string memory review,
        uint8 stars
    ) public {
        require(
            CheckTransaction(addressToReview),
            "You dont have a translaction from your address to this address"
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
            companyMap[addressToReview].allCustomerAddress.push(msg.sender);
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
            customerMap[msg.sender].allCompanyAddress.push(addressToReview);
        } else {
            Review memory _review = Review(review, stars, true);
            companyMap[addressToReview].reviewMap[msg.sender] = _review;
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
        }
    }

    function GetNCompanyReview(
        uint start,
        uint end,
        address companyAddress
    ) public view returns (string[] memory, uint8[] memory) {
        uint totalLenght = companyMap[companyAddress].allCustomerAddress.length;
        require(totalLenght > 0, "This company have not received any reviews");
        totalLenght--;
        require(
            start <= totalLenght,
            "Start must be less than the length of the array"
        );
        require(start <= end, "Start number must be less than end");
        require(end - start <= 25, "You can get max 25 reviews per call");

        if (end > totalLenght) {
            end = totalLenght;
        }

        uint length = end - start + 1;
        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);

        for (uint i = start; i <= end; i++) {
            Company storage company = companyMap[companyAddress];
            uint index = i - start;
            reviews[index] = company
                .reviewMap[company.allCustomerAddress[i]]
                .review;
            stars[index] = company
                .reviewMap[company.allCustomerAddress[i]]
                .stars;
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
        return (review, stars);
    }

    //This return N review of the user with [start, end] included, start start from 0
    function GetNMyReview(
        uint start,
        uint end
    ) public view returns (string[] memory, uint8[] memory, address[] memory) {
        uint totalLenght = customerMap[msg.sender].allCompanyAddress.length;
        require(totalLenght > 0, "You have not released any reviews");
        totalLenght--;
        require(
            start <= totalLenght,
            "Start must be less than the length of the array"
        );

        require(start <= end, "Start number must be less than end");
        require(end - start <= 25, "You can get max 25 reviews per call");

        if (end > totalLenght) {
            end = totalLenght;
        }

        uint length = end - start + 1;
        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);
        address[] memory addresses = new address[](length);

        for (uint i = start; i <= end; i++) {
            Customer storage customer = customerMap[msg.sender];
            uint index = i - start;
            reviews[index] = customer
                .reviewMap[customer.allCompanyAddress[i]]
                .review;
            stars[index] = customer
                .reviewMap[customer.allCompanyAddress[i]]
                .stars;
            addresses[index] = customer.allCompanyAddress[i];
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
        uint length = companyMap[addressReviewed].allCustomerAddress.length;
        require(
            length != 0,
            "This company has not received any reviews, cannot calculate average stars"
        );

        uint[] memory stars = new uint[](length);
        for (uint i = 0; i < length; i++) {
            stars[i] = companyMap[addressReviewed]
                .reviewMap[companyMap[addressReviewed].allCustomerAddress[i]]
                .stars;
        }

        return stars;
    }
}
