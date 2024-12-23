async function main() {
    /**
     * @description Initializes the deployer's account to be used for deploying the contracts and handling initial approvals.
     */
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    /**
     * @description Deploys the MyToken contract (CLY token with 3 billion total supply).
     */
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    const myTokenAddress = await myToken.getAddress();
    console.log("MyToken deployed to:", myTokenAddress);

    /**
     * @description Deploys the TokenVesting contract (handles token locking and vesting features).
     */
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    const tokenVesting = await TokenVesting.deploy();
    await tokenVesting.waitForDeployment();

    const tokenVestingAddress = await tokenVesting.getAddress();
    console.log("TokenVesting deployed to:", tokenVestingAddress);

    /**
     * @description Confirms the total supply of the MyToken contract (should be 3 billion tokens).
     */
    const totalSupply = await myToken.totalSupply();
    console.log("Total supply of MyToken:", ethers.formatUnits(totalSupply, 18));

    /**
     * @description Approves the TokenVesting contract to handle 3 billion tokens on behalf of the deployer.
     */
    const approvalAmount = ethers.parseUnits("3000000000", 18); // 3 billion tokens
    await myToken.connect(deployer).approve(tokenVestingAddress, approvalAmount);
    console.log(`Approved ${ethers.formatUnits(approvalAmount, 18)} tokens for TokenVesting contract.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
