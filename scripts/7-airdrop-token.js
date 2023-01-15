import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

(async () => {

    try {
        const editionDrop = await sdk.getContract(process.env.EDITION_DROP_ADDRESS, "edition-drop");
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

        // Wallet address who owns the NFT
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses("0");

        if(walletAddresses.length === 0){
            console.log(
                "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
            );
            process.exit(0);
        }

        const airdropBatch = walletAddresses.map(address => {
            // Pick a random # between 1000 and 5000.
            const randomAmount = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

            return {
                toAddress: address,
                amount: randomAmount,
            };
        });

        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropBatch);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (error) {
        console.error("Failed to airdrop tokens", error);
    }
})();