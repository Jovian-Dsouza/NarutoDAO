import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "NarutoDAO Membership",
            description: "A DAO for Naruto Fans",
            image: readFileSync("scripts/assets/naruto.png"),
            // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
            // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
            // you can set this to your own wallet address if you want to charge for the drop.
            primary_sale_recipient: AddressZero,
        })

        const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");
        const metadata = await editionDrop.metadata.get();

        console.log(
            "✅ Successfully deployed editionDrop contract, address:",
            editionDropAddress,
        );
        console.log("✅ editionDrop metadata:", metadata);
    }
    catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();