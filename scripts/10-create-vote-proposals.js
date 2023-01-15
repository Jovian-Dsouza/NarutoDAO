import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config("");

(async () => {

    // Create proposal to mint 420,000 new token to the treasury.
    try {
        const vote = await sdk.getContract(process.env.VOTE_CONTRACT_ADDRESS, "vote");
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");
        const amount = 420_000;
        const desc = "Should the DAO mint an additional " + amount + " tokens into the treasury?";

        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0, //we are sending 0 ETH
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(), 
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                )
            }
        ]

        await vote.propose(desc, executions);
        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        // This is our governance contract.
        const vote = await sdk.getContract(process.env.VOTE_CONTRACT_ADDRESS, "vote");
        // This is our ERC-20 contract.
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");
        // Create proposal to transfer ourselves 6,900 tokens for being awesome.
        const amount = 6_900;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
          process.env.WALLET_ADDRESS + " for being awesome?";
        const executions = [
          {
            // Again, we're sending ourselves 0 ETH. Just sending our own token.
            nativeTokenValue: 0,
            transactionData: token.encoder.encode(
              // We're doing a transfer from the treasury to our wallet.
              "transfer",
              [
                process.env.WALLET_ADDRESS,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),
            toAddress: token.getAddress(),
          },
        ];
    
        await vote.propose(description, executions);
    
        console.log(
          "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
    console.error("failed to create second proposal", error);
    }
      
})();