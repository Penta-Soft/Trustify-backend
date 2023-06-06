pragma solidity ^0.8.17;

import "./Structs.sol";

contract TrustifyDataBase is Ownable {
    mapping(address => Company) private companyMap;
    mapping(address => Customer) private customerMap;

    address private trustifyLogicAddress;

    modifier checkPrivilege(address add) {
        require(
            add == trustifyLogicAddress,
            "You dont have the privilege to write in this database"
        );
        _;
    }

    function setContractLogicAddress(address add) public onlyOwner {
        trustifyLogicAddress = add;
    }

    function getCompanyMapReview(
        address addressCaller,
        address addressTo
    ) public view returns (Review memory) {
        return companyMap[addressTo].reviewMap[addressCaller];
    }

    function getCustomerMapReview(
        address addressCaller,
        address addressTo
    ) public view returns (Review memory) {
        return customerMap[addressCaller].reviewMap[addressTo];
    }

    function getAllCustomerAddress(
        address addressTo
    ) public view returns (address[] memory) {
        return companyMap[addressTo].allCustomerAddress;
    }

    function getAllCompanyAddress(
        address addressTo
    ) public view returns (address[] memory) {
        return customerMap[addressTo].allCompanyAddress;
    }

    function writeInCompanyMap(
        Review memory review,
        address addressCaller,
        address addressTo
    ) public checkPrivilege(msg.sender) {
        companyMap[addressTo].reviewMap[addressCaller] = review;
    }

    function pushInCompanyMap(
        address addressCaller,
        address addressFrom
    ) public checkPrivilege(msg.sender) {
        companyMap[addressFrom].allCustomerAddress.push(addressCaller);
    }

    function writeInCustomerMap(
        Review memory review,
        address addressCaller,
        address addressTo
    ) public checkPrivilege(msg.sender) {
        customerMap[addressCaller].reviewMap[addressTo] = review;
    }

    function pushInCustomerMap(
        address addressCaller,
        address addressFrom
    ) public checkPrivilege(msg.sender) {
        customerMap[addressCaller].allCompanyAddress.push(addressFrom);
    }
}
