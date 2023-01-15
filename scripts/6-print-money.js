import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

(async () => {
    try {
        const amount = 1_000_000;
        const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

        //Mint tokens
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation")
    } catch (error) {
        console.error("Failed to print money", error)
    }
})();