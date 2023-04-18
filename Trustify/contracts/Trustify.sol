// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
Piccole note: se l'address non esiste in blockchain non si può fare il mapping e il contratto resistuisce un errore.
le map sono automaticamente inizializzate a valori di default, quindi non si può fare il check se esiste un mapping o no.
*/

contract Trustify {
    using SafeERC20 for IERC20;

    uint8 private constant MAX_REVIEW_PER_CALL = 25;

    IERC20 private token;

    enum ReviewState {
        ACTIVE,
        MODIFIED,
        DELETED
    }

    struct Review {
        string text;
        uint8 stars;
        bool havePayed;
        ReviewState state;
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

    //------------------ TRANSACTION STUFF -------------------------------------------------------------------------------

    modifier CheckTransaction(address companyWalletAddress) {
        require(
            companyMap[companyWalletAddress].reviewMap[msg.sender].havePayed,
            "You dont have a translaction from your address to this address"
        );
        _;
    }

    function CheckAllowance() public view returns (uint) {
        return token.allowance(msg.sender, address(this));
    }

    function DepositTokens(address addressToDeposit, uint amount) public {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Error with token allowance"
        );

        if (companyMap[addressToDeposit].reviewMap[msg.sender].stars == 0) {
            companyMap[addressToDeposit].reviewMap[msg.sender] = Review(
                "",
                0,
                true,
                ReviewState.ACTIVE
            );
        }
        token.safeTransferFrom(msg.sender, addressToDeposit, amount);
    }

    //------------------ REVIEW STUFF ------------------------------------------------------------------------------------

    /*
        La funzione che scrive la review si accorge se l'utente ha già scritto una review per quella 
        azienda (guarda se le stelle sono a 0, valore impossibile da mettere al di fuori dal contratto),
        in tal caso sovrascrive la vecchia review con la nuova, altrimenti crea una nuova review.
    */
    function WriteAReview(
        address addressToReview,
        string memory text,
        uint8 stars
    ) public CheckTransaction(addressToReview) {
        require(
            stars > 0 && stars <= 5,
            "Error, stars must be a value between 0 and 5"
        );

        Review memory tmpReview = companyMap[addressToReview].reviewMap[
            msg.sender
        ];

        if (tmpReview.stars == 0 && bytes(tmpReview.text).length == 0) {
            Review memory _review = Review(
                text,
                stars,
                true,
                ReviewState.ACTIVE
            );
            companyMap[addressToReview].reviewMap[msg.sender] = _review;
            companyMap[addressToReview].allCustomerAddress.push(msg.sender);
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
            customerMap[msg.sender].allCompanyAddress.push(addressToReview);
        } else {
            Review memory _review = Review(
                text,
                stars,
                true,
                ReviewState.MODIFIED
            );
            companyMap[addressToReview].reviewMap[msg.sender] = _review;
            customerMap[msg.sender].reviewMap[addressToReview] = _review;
        }
    }

    function DeleteReview(address reviewAddress) public {
        companyMap[reviewAddress].reviewMap[msg.sender].state = ReviewState
            .DELETED;
        customerMap[msg.sender].reviewMap[reviewAddress].state = ReviewState
            .DELETED;
    }

    function StateToString(
        ReviewState state
    ) private pure returns (string memory) {
        if (state == ReviewState.ACTIVE) return "ACTIVE";
        if (state == ReviewState.MODIFIED) return "MODIFIED";
        if (state == ReviewState.DELETED) return "DELETED";
        return "UNKNOWN";
    }

    //------------------ GETTER REVIEW STUFF ------------------------------------------------------------------------------------

    function GetCompanyReview(
        uint start,
        uint end,
        address companyAddress
    ) public view returns (string[] memory, uint8[] memory, string[] memory) {
        uint totalLength = companyMap[companyAddress].allCustomerAddress.length;
        require(totalLength > 0, "This company have not received any reviews");
        totalLength--;
        require(
            start <= totalLength,
            "Start must be less than the length of the array"
        );
        require(start <= end, "Start number must be less than end");
        require(
            end - start <= MAX_REVIEW_PER_CALL,
            string.concat(
                "You can get max ",
                Strings.toString(MAX_REVIEW_PER_CALL),
                " reviews per call"
            )
        );

        if (end > totalLength) {
            end = totalLength;
        }

        uint length = end - start + 1;
        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);
        string[] memory state = new string[](length);

        uint index = 0;
        for (
            uint i = totalLength - start + 1;
            i >= totalLength - end + 1;
            i--
        ) {
            Company storage company = companyMap[companyAddress];
            reviews[index] = company
                .reviewMap[company.allCustomerAddress[i - 1]]
                .text;
            stars[index] = company
                .reviewMap[company.allCustomerAddress[i - 1]]
                .stars;
            state[index] = StateToString(
                company.reviewMap[company.allCustomerAddress[i - 1]].state
            );
            index++;
        }

        return (reviews, stars, state);
    }

    function GetSpecificReview(
        address addressReviewed
    ) public view returns (string memory, uint8, string memory) {
        uint8 stars = companyMap[addressReviewed].reviewMap[msg.sender].stars;
        require(
            stars != 0,
            "You have not released any reviews to this address"
        );
        string memory text = companyMap[addressReviewed]
            .reviewMap[msg.sender]
            .text;
        string memory state = StateToString(
            companyMap[addressReviewed].reviewMap[msg.sender].state
        );
        return (text, stars, state);
    }

    //This return N review of the user with [start, end] included, start start from 0
    function GetMyReview(
        uint start,
        uint end
    )
        public
        view
        returns (
            string[] memory,
            uint8[] memory,
            address[] memory,
            string[] memory
        )
    {
        uint totalLength = customerMap[msg.sender].allCompanyAddress.length;
        require(totalLength > 0, "You have not released any reviews");
        totalLength--;
        require(
            start <= totalLength,
            "Start must be less than the length of the array"
        );

        require(start <= end, "Start number must be less than end");
        require(
            end - start <= MAX_REVIEW_PER_CALL,
            string.concat(
                "You can get max ",
                Strings.toString(MAX_REVIEW_PER_CALL),
                " reviews per call"
            )
        );

        if (end > totalLength) {
            end = totalLength;
        }

        uint length = end - start + 1;
        string[] memory reviews = new string[](length);
        uint8[] memory stars = new uint8[](length);
        address[] memory addresses = new address[](length);
        string[] memory state = new string[](length);

        uint index = 0;
        for (
            uint i = totalLength - start + 1;
            i >= totalLength - end + 1;
            i--
        ) {
            Customer storage customer = customerMap[msg.sender];
            reviews[index] = customer
                .reviewMap[customer.allCompanyAddress[i - 1]]
                .text;
            stars[index] = customer
                .reviewMap[customer.allCompanyAddress[i - 1]]
                .stars;
            addresses[index] = customer.allCompanyAddress[i - 1];
            state[index] = StateToString(
                customer.reviewMap[customer.allCompanyAddress[i - 1]].state
            );
            index++;
        }
        return (reviews, stars, addresses, state);
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
