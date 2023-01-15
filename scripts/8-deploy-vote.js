import sdk from './1-initialize-sdk.js';
import dotenv from "dotenv";
dotenv.config("");

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "My amazing DAO",
            voting_token_address: process.env.TOKEN_ADDRESS,

            // These parameters are specified in number of blocks. 
             // Assuming block time of around 13.14 seconds (for Ethereum)
            voting_delay_in_block: 0, //voting start 
            voting_period_in_blocks: 6570, // 1day = 6570 blocks
            voting_quorum_fraction: 0, //The minimum % of the total supply that need to vote for vote to be valid
            proposal_token_threshold: 0,  //What's the minimum # of tokens a user needs to be allowed to create a proposal

        });

        console.log(
            "✅ Successfully deployed vote contract, address:",
            voteContractAddress,
          );

    } catch (error) {
        console.error("Failed to deploy vote contract", err);
    }
})();