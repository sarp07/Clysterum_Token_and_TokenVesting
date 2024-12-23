// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC20 token with a fixed total supply of 300 million.
 *
 * @notice This contract mints the total supply to the deployer (the contract owner).
 */
contract MyToken is ERC20, Ownable {
    // Metadata URI
    string public metadataURI;

    /**
     * @dev Deploys the token contract and mints 300 million tokens to the deployer.
     * Token name: Clysterum
     * Token symbol: CLYS
     * @param initialMetadataURI The initial metadata URI of the token.
     */
    constructor(string memory initialMetadataURI) ERC20("Clysterum", "CLYS") Ownable(msg.sender) {
        _mint(msg.sender, 300000000 * 10**decimals());
        metadataURI = initialMetadataURI;
    }

    /**
     * @dev Updates the metadata URI.
     * @param newMetadataURI The new metadata URI.
     */
    function setMetadataURI(string memory newMetadataURI) external onlyOwner {
        metadataURI = newMetadataURI;
    }
}