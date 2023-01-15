import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const vote = await sdk.getContract(process.env.VOTE_CONTRACT_ADDRESS, "vote");
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

        // Treasury can mint additional tokens
        await token.roles.grant("minter", vote.getAddress());
        console.log(
            "Successfully gave vote contract permissions to act on token contract"
          );
    }
    catch (error){
        console.error(
            "failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    // Transfer 90% of tokens from the wallet
    try {
        const vote = await sdk.getContract(process.env.VOTE_CONTRACT_ADDRESS, "vote");
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

        const walletBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        const percent90 = Number(walletBalance.displayValue) / 100 * 90;

        await token.transfer(vote.getAddress(), percent90);
        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
    }
    catch (error){
        console.error("failed to transfer tokens to vote contract", err);
    }
})();