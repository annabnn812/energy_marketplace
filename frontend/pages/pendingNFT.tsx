import styl from "../styles/Card.module.css";
import NFTMarketplace from '../../fronted/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { marketplaceAddress } from '../../backend/config';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import cid from "./SellerForm";
import uris from "./pendingNFT"

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function CreateItem() {
    
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      setWalletConnected(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Use the request method to get the user's address
      const address = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => accounts[0])
        .catch(() => null);

      if (!address) {
        setWalletConnected(false);
        return;
      }

      setWalletAddress(address);

      const balance = await provider.getBalance(address);
      setWalletBalance(parseFloat(ethers.utils.formatEther(balance)));
    } else {
      setWalletConnected(false);
    }
  };

  const listNFT = async () => {
    const name = "EcoMarket Exchange"
    const description = `some description`
    const imageURI = `https://dweb.link/ipfs/${uris}`
    
    if (!name || !description|| !imageURI )  {
      console.error('Metadata or picture CID is missing');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Replace NFTMarketplace with your contract's ABI and address
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);

      // Retrieve the listing price from the contract
      const price = ethers.utils.parseUnits("0.0025", 'ether')
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString()

   

      // Replace with the appropriate function to mint an NFT
      const transaction = await contract.createNFT( description, imageURI, price, { value: listingPrice });

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        console.log('NFT minted successfully!');
        // Redirect to a success page or update UI accordingly
      } else {
        console.error('NFT minting failed.');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
};


  
  return (
    <div className={styl.container_pending}>
      {walletConnected ? (
        <button onClick={listNFT} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      ) : (
        <p>Connect your wallet to mint NFTs.</p>
      )}
    </div>
  );
}
