import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const amount = 1_000_000;
        const token = await sdk.getContract("0xfDD014e7FC81FeFCe729C0e058872f91675a4644", "token");

        //Mint tokens
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation")
    } catch (error) {
        console.error("Failed to print money", error)
    }
})();