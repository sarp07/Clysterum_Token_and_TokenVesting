const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @description Test suite for MyToken contract. Verifies total supply,
 * assignment of tokens to the deployer, and other ERC20 functionalities.
 */
describe("MyToken", function () {
  let myToken;

  /**
   * @description Deploys the MyToken contract before each test.
   * Ensures a fresh instance is used for every test.
   */
  beforeEach(async function () {
    const [deployer] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(); // Deploy contract
  });

  /**
   * @description Verifies that the total supply of the token is 300 million.
   */
  it("Should have total supply of 300 million", async function () {
    const totalSupply = await myToken.totalSupply();
    expect(totalSupply).to.equal(ethers.parseUnits("300000000", 18));
  });

  /**
   * @description Checks if the total supply is correctly assigned to the deployer's account.
   */
  it("Should assign the total supply to the deployer", async function () {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await myToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.parseUnits("300000000", 18));
  });
});

/**
 * @description Test suite for TokenVesting contract. Verifies locking, releasing,
 * and early release functionalities, ensuring correct behavior based on the locker and release time.
 */
describe("TokenVesting", function () {
  let myToken, vesting, owner, user1;

  /**
   * @description Deploys the MyToken and TokenVesting contracts before each test.
   * Sets up initial approvals for the vesting contract to interact with the token.
   */
  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    // Deploy MyToken contract
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();

    // Deploy TokenVesting contract
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    vesting = await TokenVesting.deploy();

    // Approve vesting contract to spend owner's tokens
    await myToken.connect(owner).approve(vesting.getAddress(), ethers.parseUnits("1000", 18));
  });

  /**
   * @description Verifies that tokens can be locked with a valid release time.
   */
  it("Should lock tokens", async function () {
    const amount = ethers.parseUnits("100", 18);
    const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const releaseTime = currentBlockTime + 3600; // 1 hour later

    await vesting.connect(owner).lockTokens(
      myToken.getAddress(),
      user1.address,
      amount,
      releaseTime
    );

    const lockInfo = await vesting.getLockInfo(myToken.getAddress(), user1.address);
    expect(lockInfo.amount).to.equal(amount);
    expect(lockInfo.releaseTime).to.equal(releaseTime);
  });

  /**
   * @description Ensures that tokens can be released only after the specified release time.
   */
  it("Should release tokens after release time", async function () {
    const amount = ethers.parseUnits("100", 18);
    const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const releaseTime = currentBlockTime + 3600;

    await vesting.connect(owner).lockTokens(
      myToken.getAddress(),
      user1.address,
      amount,
      releaseTime
    );

    // Increase time and mine a new block
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await vesting.connect(user1).releaseTokens(myToken.getAddress(), user1.address);

    const userBalance = await myToken.balanceOf(user1.address);
    expect(userBalance).to.equal(amount);
  });

  /**
   * @description Ensures that tokens cannot be released before the specified release time.
   */
  it("Should not allow release before release time", async function () {
    const amount = ethers.parseUnits("100", 18);
    const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const releaseTime = currentBlockTime + 3600;

    await vesting.connect(owner).lockTokens(
      myToken.getAddress(),
      user1.address,
      amount,
      releaseTime
    );

    await expect(
      vesting.connect(user1).releaseTokens(myToken.getAddress(), user1.address)
    ).to.be.revertedWith("Tokens are still locked");
  });

  /**
   * @description Verifies that the locker can perform an early release of tokens.
   */
  it("Should allow early release by locker", async function () {
    const amount = ethers.parseUnits("100", 18);
    const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const releaseTime = currentBlockTime + 3600;

    await vesting.connect(owner).lockTokens(
      myToken.getAddress(),
      user1.address,
      amount,
      releaseTime
    );

    await vesting.connect(owner).earlyRelease(myToken.getAddress(), user1.address);

    const userBalance = await myToken.balanceOf(user1.address);
    expect(userBalance).to.equal(amount);
  });

  /**
   * @description Ensures that a non-locker cannot perform an early release of tokens.
   */
  it("Should not allow early release by non-locker", async function () {
    const amount = ethers.parseUnits("100", 18);
    const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const releaseTime = currentBlockTime + 3600;

    await vesting.connect(owner).lockTokens(
      myToken.getAddress(),
      user1.address,
      amount,
      releaseTime
    );

    await expect(
      vesting.connect(user1).earlyRelease(myToken.getAddress(), user1.address)
    ).to.be.revertedWith("Only the locker can perform early release");
  });
});