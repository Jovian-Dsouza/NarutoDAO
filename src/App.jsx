import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from "react";

const App = () => {

  // Consts
  const editionDropAddress = "0xCA384f0A630ef90B55601f07D628d07c284772f4";

  const address = useAddress();
  console.log("Address :", address);

  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");

  const hasClaimedNFT = useMemo(() => nftBalance && nftBalance.gt(0),
                                [nftBalance])

  if(!address){
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if(hasClaimedNFT){
    return (
      <div className="landing">
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }
  
  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
};

export default App;
