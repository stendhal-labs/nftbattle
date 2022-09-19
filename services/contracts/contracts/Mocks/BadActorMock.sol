//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAuction {
    function bid(uint256, uint256) external payable;
}

// used to test receive revert and onERC721Receiver
contract BadActorMock {
    receive() external payable {
        revert("Nope.");
    }

    function bid(
        address auctionContract,
        uint256 battleId,
        uint256 contender
    ) external payable {
        IAuction(auctionContract).bid{value: msg.value}(battleId, contender);
    }
}
