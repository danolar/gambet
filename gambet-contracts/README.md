# Gambet Smart Contracts

Smart contracts for a decentralized betting platform built with Solidity and Foundry.

## Overview

This project contains three main smart contracts:

1. **Gambet.sol** - Main betting contract that manages bets and predictions
2. **PredictionNFT.sol** - NFT contract for representing user predictions
3. **SportsBetting.sol** - Simplified sports betting contract (Chainlink integration removed for now)

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- Node.js and npm (for additional tooling)

## Installation

1. Clone the repository and navigate to the contracts directory:
```bash
cd gambet-contracts
```

2. Install dependencies:
```bash
forge install
```

3. Build the contracts:
```bash
forge build
```

## Configuration

The project uses Foundry for development and testing. Key configuration files:

- `foundry.toml` - Foundry configuration with Solidity 0.8.20
- `remappings.txt` - Import path mappings for OpenZeppelin contracts

## Contract Details

### Gambet.sol
- Manages betting pools and user predictions
- Integrates with PredictionNFT for minting prediction tokens
- Handles bet resolution and winnings distribution

### PredictionNFT.sol
- ERC721 token representing user predictions
- Each NFT contains metadata about the bet (betId, outcome, amount)
- Only the Gambet contract can mint new tokens

### SportsBetting.sol
- Simplified sports betting contract
- Supports three outcomes: Team A, Team B, Draw
- Manual result setting by contract owner
- Automatic payout distribution to winners

## Deployment

Use the deployment script to deploy all contracts:

```bash
forge script script/DeployGambet.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

## Testing

Run tests with:
```bash
forge test
```

## Development

- Solidity version: 0.8.20
- OpenZeppelin contracts: 5.4.0
- Foundry for development tooling

## Notes

- Chainlink integration has been temporarily removed from SportsBetting.sol for simplicity
- The contracts are designed to work on EVM-compatible networks including Chiliz
- All contracts use OpenZeppelin's security patterns and best practices
