// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TullioCoin is ERC20 {
    constructor() ERC20("TullioCoin", "TullioCoin") {}

    function drip() public {
        _mint(msg.sender, 100000 ether); //1 ether corrisponde a moltiplicare per 10^18
    }
}
