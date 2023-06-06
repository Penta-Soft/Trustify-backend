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

    //------------------ TRANSACTION STUFF -------------------------------------------------------------------------------

    function havePayed(
        address myAddress,
        address companyAddress
    ) public view returns (bool) {
        return
            trustifyDataBase
                .getCompanyMapReview(companyAddress, myAddress)
                .havePayed;
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
}
