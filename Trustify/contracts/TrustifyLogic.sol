// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./TrustifyDataBase.sol";

contract TrustifyLogic is Ownable {
    using SafeERC20 for IERC20;
    TrustifyDataBase private trustifyDataBase;

    uint8 private constant MAX_REVIEW_PER_CALL = 25;
    IERC20 private token;

    constructor(address coinAddress, address dataBaseAddress) {
        token = IERC20(coinAddress);
        trustifyDataBase = TrustifyDataBase(dataBaseAddress);
    }

    struct ReviewReturn {
        string[] reviews;
        uint8[] stars;
        string[] state;
        address[] addresses;
    }

    //------------------ TRANSACTION STUFF -------------------------------------------------------------------------------

    function havePayed(
        address addressCaller,
        address companyAddress
    ) public view returns (bool) {
        return
            trustifyDataBase
                .getCompanyMapReview(addressCaller, companyAddress)
                .havePayed;
    }

    modifier checkTransaction(
        address addressCaller,
        address companyWalletAddress
    ) {
        require(
            trustifyDataBase
                .getCompanyMapReview(addressCaller, companyWalletAddress)
                .havePayed,
            "You dont have a translaction from your address to this address"
        );
        _;
    }

    modifier checkActionToYourself(address addressCaller, address yourAddress) {
        require(
            yourAddress != addressCaller,
            "You can't do this action to yourself Pal!"
        );
        _;
    }

    function depositTokens(
        address addressCaller,
        address addressToDeposit,
        uint amount
    ) public checkActionToYourself(addressCaller, addressToDeposit) {
        require(
            token.allowance(addressCaller, address(this)) >= amount,
            "Error with token allowance"
        );

        if (
            trustifyDataBase
                .getCompanyMapReview(addressCaller, addressToDeposit)
                .stars == 0
        ) {
            Review memory review = Review("", 0, true, ReviewState.ACTIVE);
            trustifyDataBase.writeInCompanyMap(
                review,
                addressCaller,
                addressToDeposit
            );
        }
        token.safeTransferFrom(addressCaller, addressToDeposit, amount);
    }

    //------------------ REVIEW MODIFIER STUFF ------------------------------------------------------------------------------------

    function writeAReview(
        address addressCaller,
        address addressToReview,
        string memory text,
        uint8 stars
    )
        public
        checkActionToYourself(addressCaller, addressToReview)
        checkTransaction(addressCaller, addressToReview)
    {
        require(
            stars > 0 && stars <= 5,
            "Error, stars must be a value between 0 and 5"
        );

        Review memory tmpReview = trustifyDataBase.getCompanyMapReview(
            addressCaller,
            addressToReview
        );

        if (tmpReview.stars == 0 && bytes(tmpReview.text).length == 0) {
            Review memory _review = Review(
                text,
                stars,
                true,
                ReviewState.ACTIVE
            );
            trustifyDataBase.writeInCompanyMap(
                _review,
                addressCaller,
                addressToReview
            );
            trustifyDataBase.pushInCompanyMap(addressCaller, addressToReview);

            trustifyDataBase.writeInCustomerMap(
                _review,
                addressCaller,
                addressToReview
            );

            trustifyDataBase.pushInCustomerMap(addressCaller, addressToReview);
        } else {
            Review memory _review = Review(
                text,
                stars,
                true,
                ReviewState.MODIFIED
            );
            trustifyDataBase.writeInCompanyMap(
                _review,
                addressCaller,
                addressToReview
            );
            trustifyDataBase.writeInCustomerMap(
                _review,
                addressCaller,
                addressToReview
            );
        }
    }

    function deleteReview(
        address addressCaller,
        address reviewAddress
    ) public checkActionToYourself(addressCaller, reviewAddress) {
        Review memory tmpReview = trustifyDataBase.getCompanyMapReview(
            addressCaller,
            reviewAddress
        );

        tmpReview.state = ReviewState.DELETED;

        trustifyDataBase.writeInCompanyMap(
            tmpReview,
            addressCaller,
            reviewAddress
        );

        trustifyDataBase.writeInCustomerMap(
            tmpReview,
            addressCaller,
            reviewAddress
        );
    }

    function stateToString(
        ReviewState state
    ) private pure returns (string memory) {
        if (state == ReviewState.ACTIVE) return "ACTIVE";
        if (state == ReviewState.MODIFIED) return "MODIFIED";
        if (state == ReviewState.DELETED) return "DELETED";
        return "UNKNOWN";
    }

    //------------------ REVIEW GETTER STUFF ------------------------------------------------------------------------------------

    function getCompanyReview(
        uint start,
        uint end,
        address companyAddress
    ) public view returns (string[] memory, uint8[] memory, string[] memory) {
        address[] memory allCustomerAddress = trustifyDataBase
            .getAllCustomerAddress(companyAddress);

        uint totalLength = allCustomerAddress.length;

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
            Review memory tmpReview = trustifyDataBase.getCompanyMapReview(
                allCustomerAddress[i - 1],
                companyAddress
            );

            reviews[index] = tmpReview.text;
            stars[index] = tmpReview.stars;
            state[index] = stateToString(tmpReview.state);

            index++;
        }

        return (reviews, stars, state);
    }

    function getSpecificReview(
        address addressCaller,
        address addressReviewed
    ) public view returns (string memory, uint8, string memory) {
        uint8 stars = trustifyDataBase
            .getCompanyMapReview(addressCaller, addressReviewed)
            .stars;
        require(
            stars != 0,
            "You have not released any reviews to this address"
        );
        string memory text = trustifyDataBase
            .getCompanyMapReview(addressCaller, addressReviewed)
            .text;
        string memory state = stateToString(
            trustifyDataBase
                .getCompanyMapReview(addressCaller, addressReviewed)
                .state
        );
        return (text, stars, state);
    }

    //This return N review of the user with [start, end] included, start start from 0
    function getMyReview(
        address addressCaller,
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
        address[] memory allCompanyAddress = trustifyDataBase
            .getAllCompanyAddress(addressCaller);

        uint totalLength = allCompanyAddress.length;

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
        ReviewReturn memory tmpReviewReturn = ReviewReturn(
            new string[](length),
            new uint8[](length),
            new string[](length),
            new address[](length)
        );

        uint index = 0;
        for (
            uint i = totalLength - start + 1;
            i >= totalLength - end + 1;
            i--
        ) {
            Review memory tmpReview = trustifyDataBase.getCustomerMapReview(
                addressCaller,
                allCompanyAddress[i - 1]
            );
            tmpReviewReturn.reviews[index] = tmpReview.text;
            tmpReviewReturn.stars[index] = tmpReview.stars;
            tmpReviewReturn.state[index] = stateToString(tmpReview.state);
            tmpReviewReturn.addresses[index] = allCompanyAddress[i - 1];

            index++;
        }
        return (
            tmpReviewReturn.reviews,
            tmpReviewReturn.stars,
            tmpReviewReturn.state,
            tmpReviewReturn.addresses
        );
    }

    function forceAddReview(
        address addressReviewer,
        address addressReviewed,
        string memory text,
        uint8 stars,
        string memory state
    ) public onlyOwner {
        ReviewState _state = ReviewState.ACTIVE;
        if (
            keccak256(abi.encodePacked("ACTIVE")) ==
            keccak256(abi.encodePacked(state))
        ) {
            _state = ReviewState.ACTIVE;
        } else if (
            keccak256(abi.encodePacked("MODIFIED")) ==
            keccak256(abi.encodePacked(state))
        ) {
            _state = ReviewState.MODIFIED;
        } else if (
            keccak256(abi.encodePacked("DELETED")) ==
            keccak256(abi.encodePacked(state))
        ) {
            _state = ReviewState.DELETED;
        } else {
            revert("Invalid state");
        }

        Review memory tmpReview = trustifyDataBase.getCompanyMapReview(
            addressReviewer,
            addressReviewed
        );

        if (tmpReview.stars == 0 && bytes(tmpReview.text).length == 0) {
            Review memory _review = Review(text, stars, true, _state);

            trustifyDataBase.writeInCompanyMap(
                _review,
                addressReviewer,
                addressReviewed
            );

            trustifyDataBase.pushInCompanyMap(addressReviewer, addressReviewed);

            trustifyDataBase.writeInCustomerMap(
                _review,
                addressReviewer,
                addressReviewed
            );

            trustifyDataBase.pushInCustomerMap(
                addressReviewer,
                addressReviewed
            );
        } else {
            Review memory _review = Review(text, stars, true, _state);

            trustifyDataBase.writeInCompanyMap(
                _review,
                addressReviewer,
                addressReviewed
            );

            trustifyDataBase.writeInCustomerMap(
                _review,
                addressReviewer,
                addressReviewed
            );
        }
    }
}
