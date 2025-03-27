# LatticeMint
A platform for minting lattice-based NFTs on the Stacks blockchain.

## Features
- Mint unique lattice-based NFTs with custom dimensions
- Store lattice data on-chain using efficient encoding
- Query lattice NFT metadata and ownership
- Transfer lattice NFTs between addresses

## Setup and Installation
1. Clone the repository
2. Install Clarinet (if not already installed)
3. Run `clarinet check` to verify the contract
4. Run `clarinet test` to run the test suite

## Usage Examples
```clarity
;; Mint a new lattice NFT
(contract-call? .lattice-mint mint-lattice u3 u3 "010101110111010")

;; Get lattice metadata
(contract-call? .lattice-mint get-lattice-data u1)

;; Transfer lattice NFT
(contract-call? .lattice-mint transfer u1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
