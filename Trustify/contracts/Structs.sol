pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
