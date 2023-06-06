pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Trustify is Ownable {
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

    struct Company {
        address[] allCustomerAddress;
        mapping(address => Review) reviewMap;
    }

    struct Customer {
        address[] allCompanyAddress;
        mapping(address => Review) reviewMap;
    }

    mapping(address => Company) public companyMap;
    mapping(address => Customer) public customerMap;

    address private contractLogicAddress = "";

    modifier checkPrivilege(address add) {
        require(add == contractLogicAddress, "You dont have the privilege");
        _;
    }

    function setContractLogicAddress(address add) public onlyOwner {
        contractLogicAddress = add;
    }

    function 
}
