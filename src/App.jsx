import { JsonRpcProvider } from '@ethersproject/providers';
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from "react";

const App = () => {

  // Consts
  const editionDropAddress = "0xef447f7d9f2a71fd35C6e91752f481723253fC9b";
  const tokenAddress = "0xfDD014e7FC81FeFCe729C0e058872f91675a4644"

  const address = useAddress();
  console.log("Address :", address);

  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract(tokenAddress, 'token');
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");

  const hasClaimedNFT = useMemo(() => nftBalance && nftBalance.gt(0),
                                [nftBalance])


  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => (str.substring(0,6) + '...' + str.substring(str.length-4));

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if(!hasClaimedNFT){ return; }

    const getAllAddresses = async () => {
      try{
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses("0");
        setMemberAddresses(memberAddresses);
        console.log('🚀 Members addresses', memberAddresses);
      }
      catch (error){
        console.error('Failed to get member list', error);
      }
    }

    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
  
    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 Amounts', amounts);
      } catch (error) {
        console.error('failed to get member balances', error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map(address => {
      const member = memberTokenAmounts?.find(({holder}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0'
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

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

// If the user has already claimed their NFT we want to display the internal DAO page to them
// only DAO members will see this. Render all the members + token amounts.
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
