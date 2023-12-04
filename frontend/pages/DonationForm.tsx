import React, { useState, useEffect } from 'react';
import { ethers , BigNumber } from 'ethers';
import DonationFormStyles from '../styles/Card.module.css';
//import DonationContract from '../../fronted/artifacts/contracts/DonationContract.sol/DonationContract.json';
import InputForm from './InputForm'
//import { Client } from "@xmtp/xmtp-js";
//import sendMSG from '../pages/api/XMTPclient';




const contractAddress = '0xf5Bef18c6C8DFCD7Df2247b40B39CFcFF6311aAf'; // Celo address

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState<number | string>('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [record, setRecord] = useState('');
  const [inputText, setInputText] = useState('');

  //const navigate = useNavigate();
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

  
  const handleInputChange = (event:any) => {
    const value = event.target.value;
    setInputText(value);
  };

  const handleAmountChange = (event: any) => {
    const value = event.target.value;
    setAmount(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!walletConnected) {
      alert('Please connect your wallet to make a donation.');
      return;
    }
  
    const donationAmount = parseFloat(amount as string);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
  
    if (walletBalance < donationAmount) {
      alert('Insufficient balance. Please top up your wallet.');
      return;
    }
  
    // Convert donation amount to a BigNumber with the appropriate decimal places
    const decimals = 18; // Adjust this based on the token's decimal places
    const donationAmountWei = ethers.utils.parseUnits(donationAmount.toFixed(decimals), decimals);
  
    donateAmount(donationAmountWei);

    setInputText(inputText);
   // navigate('/');
  };
  
  

  const donateAmount = async (amountWei: ethers.BigNumber) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const contract = new ethers.Contract(contractAddress, DonationContract.abi, signer);
  
      const transaction = await contract.donate({ value: amountWei });
  
      await transaction.wait();
      await sendMSG(inputText);
  
      alert(`Thank you for donating ${ethers.utils.formatUnits(amountWei)} USD!`);
    } catch (error) {
      alert('An error occurred while processing your donation.');
      console.error(error);
    }
  };
  
  const handleDonateClick = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet to make a donation.');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 

    const donationAmount = parseFloat(amount as string);
    const contractAddress = "0xf5Bef18c6C8DFCD7Df2247b40B39CFcFF6311aAf";
    const contract = new ethers.Contract(contractAddress, DonationContract.abi, signer);
  
    try {
      // Get the current ETH/USD price from Chainlink Oracle
      const ethPrice = await contract.getLatestPrice();
    
      // Convert total price in dollars to ETH
      const totalDonationInETH = ethers.utils.parseEther((donationAmount / ethPrice * 100000000 ).toFixed(18));
  
      // Call the contract's 'donate' function to make the payment
      const transaction = await contract.donate({ value: totalDonationInETH });

      await transaction.wait();
      await sendMSG(inputText);
      setAmount(''); // Clear the donation amount field
      setInputText(''); // Clear the message input field
  
      alert(`Thank you for donating ${donationAmount} USD worth of CELO! Your message was sent`);
    } catch (error) {
      alert('An error occurred while processing your donation.');
      console.error(error);
    }
};



    return (
   
      <form onSubmit={handleSubmit}>
        <InputForm  onSendMessage ={inputText} /> 

        <label htmlFor="amount">Donation Amount (USD):</label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0"
          placeholder="Enter amount"
          value={amount}
          className={DonationFormStyles.amount_fill}
          onChange={handleAmountChange}
          required
        />
        
        {/* "Donate" Button */}
        <button
          type="button" // Use type "button" to prevent form submission
          className={DonationFormStyles.btn_fill}
          disabled={!walletConnected}
          onClick={handleDonateClick}
        >
          Donate
        </button>
  
        {/* Display connected wallet info */}
        {walletConnected && <p>Connected Wallet: {walletAddress}</p>}
        {walletBalance !== undefined && <p>Wallet Balance: {walletBalance} ETH</p>}
      </form>
    );
  };
       

       


export default DonationForm;
