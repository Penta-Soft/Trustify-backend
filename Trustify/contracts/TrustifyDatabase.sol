pragma solidity ^0.8.17;

import "./Structs.sol";

contract TrustifyDataBase is Ownable {
    mapping(address => Company) private companyMap;
    mapping(address => Customer) private customerMap;

    address private contractLogicAddress;

    modifier checkPrivilege(address add) {
        require(
            add == contractLogicAddress,
            "You dont have the privilege to write in this database"
        );
        _;
    }

    function setContractLogicAddress(address add) public onlyOwner {
        contractLogicAddress = add;
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
}
