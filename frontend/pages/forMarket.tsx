
import NFTMarketplace from '../../fronted/artifacts/contracts/SellerCarbon.sol/NFTMarketplaceBuy.json';
import Energy from "../../fronted/artifacts/contracts/EnergyToken.sol/EnergyToken.json"
import { ContractAddressforMarket } from '../../backend/configbuy';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Card.module.css';
import Link from 'next/link';
import TokenSwap from '../../fronted/artifacts/contracts/TokenSwap.sol/TokenSwap.json';
import { swapAddress }from '../../backend/configSwap'; 




interface NFT {
  price: string;
  tokenId: number;
  image: string;
  name: string;
  description: string;
  attributes: { [key: string]: string }[];
}

export default function ListedNFT() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingState, setLoadingState] = useState<string>('not-loaded');
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [nftOwner, setNftOwner] = useState<string>('not-loaded');
  const [minterAddress, setMinterAddress] = useState('');;
  const [number, setNumber] = useState(0);
  const [nftNumbers, setNftNumbers] = useState<number[]>(nfts.map(() => 0));
  const [inputValue, setInputValue] = useState<number>(0);
const [index, setIndex] = useState<number>(0);
const [tons, setTons] = useState<number>(0);
const [totalPriceInUSD, setTotalPriceInUSD] = useState(0);
  const [numberOfTokensToBuy, setNumberOfTokensToBuy] = useState(0);


  useEffect(() => {
    checkWalletConnection();
  }, []);
const tokenAccountAddress = " "
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      setWalletConnected(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        if (!address) {
          setWalletConnected(false);
          return;
        }

        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setWalletBalance(parseFloat(ethers.utils.formatEther(balance)));
      } catch (error) {
        setWalletConnected(false);
      }
    } else {
      setWalletConnected(false);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedNumbers = [...nftNumbers];
    const inputValue = Number(e.target.value);
    const maxAmount = tonsAmount(nfts[index]); // Get the maximum available amount
  
    // Ensure that the input value is not greater than the available amount
    if (inputValue <= maxAmount) {
      updatedNumbers[index] = inputValue;
    } else {
      updatedNumbers[index] = maxAmount; // Set it to the maximum available amount
    }
  
    setNftNumbers(updatedNumbers);
    setTons(inputValue); // Update the tons variable
  
    const totalPrice = calculateTotalPrice(nfts[index], inputValue);
    console.log(totalPrice);
  };
  
  const handleDecrement = (index: number) => {
    const updatedNumbers = [...nftNumbers];
    if (updatedNumbers[index] > 0) {
      updatedNumbers[index] -= 1;
      setNftNumbers(updatedNumbers);
    }
  };
  
  const handleIncrement = (index: number) => {
    const updatedNumbers = [...nftNumbers];
    updatedNumbers[index] += 1;
    setNftNumbers(updatedNumbers);
  };
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider('https://polygonzkevm-testnet.g.alchemy.com/v2/I9l1o5Os_-KJdLvgRWP2BJlJB3JHUA1S');
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
          attributes: meta.data.attributes
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState('loaded');
  }



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
  
  function middlePrice(nfts: NFT[]): number {
    let totalPrice = 0;
    let validNFTCount = 0;
  
    for (const nft of nfts) {
      const price = priceTons(nft);
      if (price > 0) {
        totalPrice += price;
        validNFTCount++;
      }
    }
  
    if (validNFTCount === 0) {
      return 0; // Return 0 if no valid prices were found
    }
  
    const averagePrice = totalPrice / validNFTCount;
    return averagePrice;
  }

  function calculateTotalPrice(nft: NFT, tons: number): number {
    const pricePerTon = priceTons(nft);
    return pricePerTon * tons;
  }


  async function buyTokens(nft: NFT, totalPriceInUSD: number, numberOfTokensToBuy: number) {
    if (!walletConnected) {
      alert('Please connect your wallet.');
      return;
    }
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const gasPrice = await provider.getGasPrice();
      const gasLimit = 7000000; // You can adjust the gas limit as needed
      const signer = provider.getSigner();
      const ecoContractAddress = '0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC';
  
      // Create instances of your contract
      const ecoContract = new ethers.Contract(ecoContractAddress, Energy.abi, signer);
      const tokenSwapContract = new ethers.Contract(swapAddress, TokenSwap.abi, signer);
      
      const totalPriceInUSD = 26;
      const ethPrice = await tokenSwapContract.getLatestPrice();
      const totalPriceInWei = ethers.utils.parseEther((totalPriceInUSD / ethPrice * 100000000 ).toFixed(18));
      //const totalPriceInWei = ethers.utils.parseEther(totalPriceInUSD.toString());
      
  
     const toBuy = 1;
      const numberOfTokensToBuy = ethers.utils.parseUnits(toBuy.toString(), 18);
  
      // Call the buyTokens function on your TokenSwap contract and send ether
      const tx = await tokenSwapContract.buyTokens("1", numberOfTokensToBuy, { value: totalPriceInWei, gasLimit, gasPrice, });

  
      await tx.wait();
  
      // Transfer the ECO tokens to the user
      const senderAddress = await signer.getAddress();
      const ecoTokensToTransfer = numberOfTokensToBuy;
      await ecoContract.transfer(senderAddress, ecoTokensToTransfer, { gasLimit, gasPrice, });
      
      alert(`ENRG tokens purchased successfully.`); 
      
      alert(`ENRG tokens purchased successfully.`);
    } catch (error) {
      console.error('Error buying tokens:', error);
      alert('Error buying tokens. Please try again.');
    }
  }
  
  

  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in the marketplace</h1>;

  return (
<div> 
<div className={styles.container_average_price}> 
        <p> Now average price  <span style={{ color: "#F6FA70", fontWeight: 'bold' }}>{middlePrice(nfts)}</span></p>
      </div>
     <div className="px-8" style={{ display: 'flex', alignItems: 'center' , width: '930px', justifyContent: 'space-evenly', gap: '20px' }}>
      <div className="container_logo">
        <p>  </p>
      </div>
      &nbsp;
      &nbsp;
      <div className="container_name" style={{ display: 'flex', alignItems: 'center' , width: '320px' }}>
          <h3> Name </h3>
          </div>
          <div className="container_amounts_tons" style={{ display: 'flex', alignItems: 'center' , width: '100px' }}>
          <h3> Amount tons</h3>
          </div>
          <div className="container_price_tons" style={{ display: 'flex', alignItems: 'center' , width: '100px' }}>
          <h3> Price USD/tons: </h3>
        </div>
        <div className="container_amounts_tokens" style={{ display: 'flex', alignItems: 'center' , width: '100px' }}>
        <h3> Amount Tokens </h3>
      </div>
      <div className="container_amounts_tokens" style={{ display: 'flex', alignItems: 'center' , width: '100px' }}>
        <h3> Total USD </h3>
      </div>
      <div className="container_buy_tokens" style={{ display: 'flex', alignItems: 'center' , width: '150px' }}>
        <p>  </p>
      </div>
      </div>
     
       &nbsp;
   
       <div className="px-8" style={{ width: '930px', whiteSpace: "nowrap", display: "inline-block", verticalAlign: "top", }}>
  {nfts.map((nft, i) => (
    <div key={i} style={{ border: '3px solid #F8F6F4', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
      <img
        src={nft.image}
        alt={`NFT ${i}`}
        style={{ maxHeight: '100px', width: '70px', marginRight: '10px' }}
      />
      <div className={styles.container_name}> 
      <Link href="/id1">
        <h3> {nft.name} </h3>
        </Link>
      </div>
      <div className={styles.container_amounts_tons}> 
        <p>  <span style={{ color: "#2a2b2d", fontWeight: 'bold' }}>{tonsAmount(nft)}</span></p>
      </div>
      <div className={styles.container_amounts_tokens}>
        <p>  <span style={{ color: "#2a2b2d", fontWeight: 'bold' }}>{priceTons(nft)}</span></p>
      </div>
      <div className={styles.container_amounts_tokens2}>
      <div className={styles.container_input_amounts_tokens}>
        <button onClick={() => handleDecrement(i)}>-</button>
        <input type="number" style={{ display: 'inline-block', alignItems: 'center' , flexDirection: "row", width: '60px', height: "20px" }} value={nftNumbers[i]} onChange={(e) => handleInputChange(e, i)} />
          <button onClick={() =>handleIncrement(i)}>+</button>
        </div>
        </div>
        <div className={styles.container_amounts_tokens}>
        <p>  <span style={{ color: "#2a2b2d", fontWeight: 'bold' }}>{calculateTotalPrice(nft, tons)}</span></p>
      </div>
      &nbsp;
      &nbsp;
      &nbsp;
      <div className="px-8" style={{ maxHeight: '100px',  width: '120px', alignItems: 'center' , display: 'flex', alignSelf: "center"  }}>
      <button className={styles.glow_on_hover} onClick={() => buyTokens(nft, totalPriceInUSD, numberOfTokensToBuy)}>
  Buy ENRG token
        </button>
      </div>
    </div>
  ))}
</div>
</div>

  );
}
