
import NFTMarketplace from '../../fronted/artifacts/contracts/SellerCarbon.sol/SellerCarbon.json';
import erc6551RegistryABI from "../../fronted/artifacts/contracts/ERC6551Registry.sol/ERC6551Registry.json";
import AccountAddress from "../../fronted/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json"
import EcoABI from "../../fronted/artifacts/contracts/EnergyToken.sol/EnergyToken.json"
import { marketplaceAddress } from '../../backend/config';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Card.module.css';
import Web3 from 'web3';
//import { minterAddress } from "./SellerForm"
//import { BrowserRouter as Router, useLocation } from 'react-router-dom';


interface NFT {
  price: string;
  tokenId: number;
  image: string;
  name: string;
  description: string;
  attributes: { [key: string]: string }[];
  minterAddress: string;
}

export default function PendingNFT() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingState, setLoadingState] = useState<string>('not-loaded');
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [nftOwner, setNftOwner] = useState<string>('not-loaded');
 // const [minterAddress, setMinterAddress]= useState('');
 
  //const location = useLocation();
  //const minterAddress = location.state?.minterAddress;
  useEffect(() => {
    checkWalletConnection();
  }, []);

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

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider('https://polygonzkevm-testnet.g.alchemy.com/v2/I9l1o5Os_-KJdLvgRWP2BJlJB3JHUA1S/');
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider);
    const data = await contract.fetchMarketItems();
    const minterAddress = "0x3bcF60b44ba99e7994b075086c353062c6AE0480"

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
          minterAddress: minterAddress
    
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState('loaded');
  }



  async function createNftAccount(nft: NFT) {
    if (!walletConnected) {
        alert('Please connect your wallet.');
        return;
      }
    const nftCreatorAddress = '0xad96c0b51d5be8c190f2d7cdabbfd4173af2b06c';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = "0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC";
    const chainId = 421613;
    const tokenId = nft.tokenId;
    const salt = 0;
    
    const ERC6551Registry = "0xf5Bef18c6C8DFCD7Df2247b40B39CFcFF6311aAf";
    const implementation = "0x1d7f6a6BEF43D447D8c5282e6EB0d4e7a104cBce";
    const registryContract = new ethers.Contract(ERC6551Registry, erc6551RegistryABI.abi, signer);
   
    // Create an instance of the ERC6551Registry contract
    const erc6551RegistryContract = new ethers.Contract(
    ERC6551Registry,
    ["function createAccount(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes calldata initData) external"],
    signer
    );
    if (walletAddress !== nftCreatorAddress) {
        alert('You are not the creator of the NFTMarketplace.');
        console.log('Wallet Address:', walletAddress);
        console.log('NFT Creator Address:', nftCreatorAddress);
        return;
    }
    
    const gasless = true; // enable or disable gasless transactions
    const factoryInfo = {
    createAccount: async (
    factory: ethers.Contract,
    owner: string
    ) => {
    const account = await factory.prepare("createAccount", [
    implementation,
    chainId,
    tokenContract,
    tokenId,
    0,
    ethers.utils.toUtf8Bytes("")
    ]);
    await account.wait();
    
      // Alert the user that the account has been created
      await alert("Account created successfully with address: " + account.address.toString());
    
      return account;
    }, // the factory method to call to create a new account
    getAccountAddress: async (
      factory: ethers.Contract,
      owner: string
    ) => {
      return factory.call("account", [
        implementation,
        chainId,
        tokenContract,
        tokenId,
        0
      ]);
    }
    };
    
    try {
       
    // Encode the function data for createAccount
    const encodedData = erc6551RegistryContract.interface.encodeFunctionData(
    "createAccount",
    [implementation, chainId, tokenContract, tokenId, salt, ethers.utils.toUtf8Bytes("")]
    );
    
    // Send the transaction
   /* const createAccount = await signer.sendTransaction({
      to: ERC6551Registry,
      data: encodedData,
      gasLimit: 3000000, // Increase the gas limit as needed
      gasPrice: ethers.utils.parseUnits("20000000", "wei"), // Specify an appropriate gas price
    });
    */

    const provider = new ethers.providers.JsonRpcProvider('https://polygonzkevm-testnet.g.alchemy.com/v2/I9l1o5Os_-KJdLvgRWP2BJlJB3JHUA1S/'); 
    const gasPrice = await provider.getGasPrice();
    const gasLimit = 7000000; // You can adjust the gas limit as needed

    const createAccount = await signer.sendTransaction({
    to: ERC6551Registry,
    data: encodedData,
    gasLimit: gasLimit,
    gasPrice: gasPrice, // Use the fetched gas price
});
    
    // Wait for the transaction to be mined
    await createAccount.wait();
    console.log("Account created successfully");

    // Get the signer's address
const owner = await signer.getAddress();
// Get the account address
const accountAddress = await registryContract.account(
    implementation,
    chainId,
    tokenContract,
    tokenId,
    0
  );


  await alert("Account created successfully with address: " + accountAddress);
  console.log("Account address:", accountAddress);
 
  
 
  if (!Array.isArray(nft.attributes) || nft.attributes.length === 0) {
    console.error('NFT attributes are not valid or empty.');
    return; // Exit the function or handle the error as needed.
  }
  
  // Initialize variables to store the accumulated values
  let totalAmountTons = 0;
  
  // Loop through the attributes and accumulate values
  for (const attr of nft.attributes) {
    if (typeof attr.amountTons === 'string') {
      totalAmountTons += parseFloat(attr.amountTons);
    }
  
  }
    const forTransferAmount = (totalAmountTons).toString();

  
    const ecoContractAddress = "0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC"; 
    const ecoContract = new ethers.Contract(ecoContractAddress, EcoABI.abi, signer);
  
  
    const transferAmount = ethers.utils.parseUnits(forTransferAmount, 18); // 1 ECO (assuming 18 decimals)
    const transferTx = await ecoContract.transfer(accountAddress, transferAmount);
  await transferTx.wait();
  await alert(transferAmount + "ECO tokens transferred successfully to : " + accountAddress);
  console.log("ECO tokens transferred successfully to TokenBoundAccount.");

  
  } catch (error) {
    console.error('Error parsing NFT description:', error);
    // Handle the parsing error as needed.
  }
  
  //Transfer NFT to another contract
  const owner = await signer.getAddress();
  const nftContractAddress = marketplaceAddress; 
  const nftContract = new ethers.Contract(nftContractAddress, NFTMarketplace.abi, signer);
  const tokenIdToTransfer = 2; 
  const toAddress = "0xB99Dfe5D936b031ed84EB38543B0648EF5D7963e";
  //const estimatedGas = await nftContract.estimateGas.transferNFT(toAddress, tokenIdToTransfer);
  const gasPrice = await provider.getGasPrice();
  const gasLimit = 7000000; // You can adjust the gas limit as needed

  const transferNftTx = await nftContract.transferNFT(toAddress, tokenIdToTransfer,{ gasLimit, gasPrice });
  await transferNftTx.wait();
  await alert("NFT transferred successfully to: 0xB99Dfe5D936b031ed84EB38543B0648EF5D7963e");
  console.log("NFT transferred successfully to: 0xB99Dfe5D936b031ed84EB38543B0648EF5D7963e");

   
    }

       

  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in the marketplace</h1>;

  return (
    
    <div className="px-8" style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'space-evenly',  gap: '10px' }}>
    {nfts.map((nft, i) => (
      <div key={i} style={{ border: '3px solid #F8F6F4', padding: '10px', borderRadius: '8px' }}>
        <img src={nft.image} alt={`NFT ${i}`} style={{ maxHeight: '100px', width: '70px', justifyContent:"center"}} />
        <div className="p-4">
          <h3> {nft.name} </h3>
          <div style={{ height: '170px', width: '230px', overflow: 'hidden'}}> 
            <p className="text-neutral-950">{JSON.stringify(nft.description)}</p>
            <p className="text-neutral-950">{nft.minterAddress}</p>
          </div>
        </div>
        
          <button className={styles.btn_fill} onClick={() => createNftAccount(nft)}>
            Validation on progress
          </button>
      </div>
    ))}
  </div>
 
  );
}
// overflow: 'hidden'