// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./TrustifyLogic.sol";

contract Trustify {
    TrustifyLogic private trustifyLogic;

    constructor(address tLogicAddress) {
        trustifyLogic = TrustifyLogic(tLogicAddress);
    }

    //------------------ TRANSACTION STUFF -------------------------------------------------------------------------------

    function havePayed(
        address myAddress,
        address companyAddress
    ) public view returns (bool) {
        return trustifyLogic.havePayed(myAddress, companyAddress);
    }

    function depositTokens(address addressToDeposit, uint amount) public {
        trustifyLogic.depositTokens(msg.sender, addressToDeposit, amount);
    }

    //------------------ REVIEW MODIFIER STUFF ------------------------------------------------------------------------------------

    function writeAReview(
        address addressToReview,
        string memory text,
        uint8 stars
    ) public {
        trustifyLogic.writeAReview(msg.sender, addressToReview, text, stars);
    }

    function deleteReview(address reviewAddress) public {
        trustifyLogic.deleteReview(msg.sender, reviewAddress);
    }

    //------------------ REVIEW GETTER STUFF ------------------------------------------------------------------------------------

    function getCompanyReview(
        uint start,
        uint end,
        address companyAddress
    ) public view returns (string[] memory, uint8[] memory, string[] memory) {
        return trustifyLogic.getCompanyReview(start, end, companyAddress);
    }

    function getSpecificReview(
        address addressReviewed
    ) public view returns (string memory, uint8, string memory) {
        return trustifyLogic.getSpecificReview(msg.sender, addressReviewed);
    }

    function getMyReview(
        uint start,
        uint end
    )
        public
        view
        returns (
            string[] memory,
            uint8[] memory,
            string[] memory,
            address[] memory
        )
    {
        return trustifyLogic.getMyReview(msg.sender, start, end);
    }
}
