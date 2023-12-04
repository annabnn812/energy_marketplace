import styles from '../styles/Card.module.css';
import NFTMarketplace from '../../fronted/artifacts/contracts/SellerCarbon.sol/SellerCarbon.json';
import { ContractAddressforMarket } from '../../backend/configbuy';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import Header from "./header"
import Footer from "../components/instructionsComponent/navigation/footer/index"

interface NFT {
  price: string;
  tokenId: number;
  image: string;
  name: string;
  description: string;
  attributes: { [key: string]: string }[];
  minterAddress: string;
  tokenAddress: string;
}

export default function ProfileNFTId1() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingState, setLoadingState] = useState<string>('not-loaded');
  const [nftNumbers, setNftNumbers] = useState<number[]>(nfts.map(() => 0));

  useEffect(() => {
    loadNFTs();
  }, []);

  const minterAddress = "0x495De456E4DBf47879669BC5bf762aEf72EE5eEA"
  const tokenAddress = "0x2de8FDA6F379966198549D3e5EFe38502249314b"
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider('https://polygonzkevm-testnet.g.alchemy.com/v2/I9l1o5Os_-KJdLvgRWP2BJlJB3JHUA1S/');
    const contract = new ethers.Contract(ContractAddressforMarket, NFTMarketplace.abi, provider);
    const data = await contract.fetchMarketItems();


    const items: NFT[] = await Promise.all(
      data.map(async (i : any) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri, {
            baseURL: 'https://rpc.public.zkevm-test.net',
          });
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

        const item: NFT = {
          price,
          tokenId: i.tokenId.toNumber(),
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          attributes: meta.data.attributes,
          minterAddress: minterAddress,
          tokenAddress: tokenAddress
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState('loaded');
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in the marketplace</h1>;
    const filteredNfts = nfts.filter((nft) => nft.tokenId === 1);
    function tonsAmount(nft: NFT): number {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.amountTons !== undefined) {
            return parseFloat(attribute.amountTons);
          }
        }
      }
      return 0; // Return 0 if "amountTons" is not found in the attributes
    }
    function priceTons(nft: NFT): number {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.priceUSDPerTons !== undefined) {
            return parseFloat(attribute.priceUSDPerTons);
          }
        }
      }
      return 0; // Return 0 if "priceUSDPerTons" is not found in the attributes
    }
    function reservTons(nft: NFT): number {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.reservesTons !== undefined) {
            return parseFloat(attribute.reservesTons);
          }
        }
      }
      return 0; // Return 0 if "priceUSDPerTons" is not found in the attributes
    }

    function locations(nft: NFT): string {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.location !== undefined) {
            return JSON.stringify(attribute.location);
          }
        }
      }
      return '';
    }
    
    function industry(nft: NFT): string {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.industryTechnology !== undefined) {
            return JSON.stringify(attribute.industryTechnology);
          }
        }
      }
      return '';
    }
    
    function removal(nft: NFT): string {
      if (Array.isArray(nft.attributes)) {
        for (const attribute of nft.attributes) {
          if (attribute.removalType !== undefined) {
            return JSON.stringify(attribute.removalType);
          }
        }
      }
      return '';
    }
    
  
  return (
    <>
    <Header />
    &nbsp;
    &nbsp;
    <div className={styles.nft_block}>
      <div className="px-8" style={{ width: '930px', whiteSpace: "nowrap", display: "inline-block", verticalAlign: "top", backgroundColor : "#c3c1fc"}}>
      {filteredNfts.map((nft, i) => (
    <div key={i} style={{ border: '3px solid #F8F6F4', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
      <img
        src={nft.image}
        alt={`NFT ${i}`}
        style={{ maxHeight: '400px', width: '250px', marginRight: '10px' }}
      />
      <div className={styles.container_card_NFT}> 
    
        <h3> {nft.name} </h3>
        <p>Token ID :  {nft.tokenId} </p>
        <p className="text-neutral-950" style={{ wordWrap: 'break-word', maxWidth: '50ch' }}>
  {JSON.stringify(nft.description)}
</p>
        <p className="text-neutral-950"> Owner address : <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{nft.minterAddress} </span></p>
        <p className="text-neutral-950"> Token NFT address account: <span style={{ color: "#116A7B", fontWeight: 'bold' }}> {nft.tokenAddress} </span></p>
        <p> Amount tons : <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{tonsAmount(nft)}</span></p>
        <p>Price USD/tons:  <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{priceTons(nft)}</span></p>
        <p>Reserved tons:  <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{reservTons(nft)}</span></p>
        <p>Location:  <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{locations(nft)}</span></p>
        <p>Industry /technology :  <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{industry(nft)}</span></p>
        <p>Removal type :  <span style={{ color: "#116A7B", fontWeight: 'bold' }}>{removal(nft)}</span></p>
        
    
    
      </div>
    </div>
  ))}
</div>
</div>
&nbsp;
    &nbsp;
<Footer />
    </>
  );
}