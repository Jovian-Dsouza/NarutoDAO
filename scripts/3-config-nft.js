import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try{
        const editionDrop = await sdk.getContract("0xCA384f0A630ef90B55601f07D628d07c284772f4", "edition-drop");
        await editionDrop.createBatch([
            {
              name: "Leaf Village Headband",
              description: "This NFT will give you access to NarutoDAO!",
              image: readFileSync("scripts/assets/headband.png"),
            },
          ]);
          console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
        
})();