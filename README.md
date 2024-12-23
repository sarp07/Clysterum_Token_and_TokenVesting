# CLYSTERUM Project - Token and Vesting Test Framework on OpBNB

This repository contains a test framework for the **CLYSTERUM** project, built to validate token functionality and vesting mechanisms on the **OpBNB** blockchain. The project is designed purely for testing purposes and does **not mint real tokens**. Instead, it provides a simulated environment for creating and managing ERC20 tokens and testing token locking and vesting capabilities.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Setup and Installation](#setup-and-installation)
4. [Testing Overview](#testing-overview)
5. [Usage](#usage)
6. [Test Results](#test-results)
7. [License](#license)

---

## Introduction

The **CLYSTERUM Project** serves as a lightweight framework to test ERC20 token and vesting functionalities on the **OpBNB testnet**. It allows developers to:

- Deploy a mock token (`MyToken`) with a fixed total supply of **3 billion tokens**.
- Lock tokens using a vesting contract (`TokenVesting`) with customizable release times.
- Test scenarios such as token release after vesting periods, early release by the locker, and preventing unauthorized actions.

This repository is not intended for production use but as a **learning and validation tool**.

---

## Features

### MyToken Contract
- **Fixed Supply:** A total of **3 billion CLYS tokens** is assigned to the deployer upon contract deployment.
- **Standard ERC20 Features:** Fully compliant with the ERC20 standard.

### TokenVesting Contract
- **Token Locking:** Lock any ERC20 token for a specified beneficiary with a customizable release time.
- **Early Release:** Allow the locker to release tokens early if required.
- **Read-Only Information:** Query locked token details, including the amount, release time, and locker address.

---

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clysterum-opbnb-test.git
   cd clysterum-opbnb-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile contracts:
   ```bash
   npx hardhat compile
   ```

4. Run tests:
   ```bash
   npx hardhat test
   ```

---

## Testing Overview

This project includes test suites for both the `MyToken` and `TokenVesting` contracts. The tests are written using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) with [Hardhat](https://hardhat.org/).

### MyToken Tests
1. **Total Supply Validation:**
   - Confirms the total supply of `3 billion CLYS`.
2. **Token Assignment:**
   - Ensures the deployer receives the total supply upon contract creation.

### TokenVesting Tests
1. **Token Locking:**
   - Verifies that tokens can be locked for a beneficiary with a specified release time.
2. **Token Release After Vesting:**
   - Confirms that tokens are correctly released after the release time has passed.
3. **Prevent Early Release:**
   - Ensures tokens cannot be released before the release time.
4. **Allow Early Release by Locker:**
   - Validates that the locker can perform an early release of tokens.
5. **Prevent Unauthorized Early Release:**
   - Ensures only the locker can perform early releases.

---

## Usage

### Deploy Contracts
Deploy the `MyToken` and `TokenVesting` contracts using the Hardhat framework. Adjust the configurations in `hardhat.config.js` if needed.

### Run Tests
Execute the following command to run the full test suite:
```bash
npx hardhat test
```

### Expected Output
The following results should appear upon successful execution:
```
  MyToken
    ✓ Should have total supply of 3 billion
    ✓ Should assign the total supply to the deployer

  TokenVesting
    ✓ Should lock tokens
    ✓ Should release tokens after release time
    ✓ Should not allow release before release time
    ✓ Should allow early release by locker
    ✓ Should not allow early release by non-locker

  7 passing (572ms)
```

---

## Test Results

The current implementation successfully validates all key functionalities of the token and vesting contracts. Below are the key highlights:

- **7 Passing Tests:**
  - `MyToken` contract ensures correct token minting and assignment.
  - `TokenVesting` handles all edge cases for locking, releasing, and security.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

