import sdk from './1-initialize-sdk.js';
import { AddressZero } from "@ethersproject/constants";

(async () => {
    try{
        //DeployToken -> Deploys a ERC-20 token
        const tokenAddress = await sdk.deployer.deployToken({
            name: 'NarutoDAO Governance Token',
            symbol: 'HOKAGE',
            primary_sale_recipient: AddressZero
        });
        console.log(
            "✅ Successfully deployed token contract, address:",
            tokenAddress,
        );
    }
    catch (error){
        console.error("failed to deploy the token contract", error);
    }
})();