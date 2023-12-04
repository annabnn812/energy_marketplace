
import React, { useState, useEffect } from 'react';
import { ethers , BigNumber } from 'ethers';
import WAValidator from "multicoin-address-validator/dist/wallet-address-validator";
import Form from "../components/Form/index";
import Qr from "../components/Qr/index";
import styles from "../styles/style.module.scss"
import BillContract from '../../fronted/artifacts/contracts/BillContract.sol/BillContract.json';
import MyButton from "./btn"

const contractAddress = '0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC'; // Avalanche FUJI C-Chain address


function QCode() {
    const [network, setNetwork] = useState("eth");
    const [address, setAddress] = useState("0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC");
    const [invalidAddress, setInvalidAddress] = useState(false);
    const [amount, setAmount] = useState(0);
    //const [amount, setAmount] = useState<number | string>('');
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);

  
  
    const changeAddress = (e) => {
      let address = e.target.value;
      let isValidAddress = WAValidator.validate(address, network);
  
      setAddress(address);
      setInvalidAddress(!isValidAddress);
    };
  
    const changeNetwork = (e) => {
      let network = e.target.value;
      let isValidAddress = WAValidator.validate(address, network);
  
      setInvalidAddress(!isValidAddress);
      setNetwork(network);
    };
  
    const changeAmount = (e) => {
      let newAmount = parseFloat(e.target.value);
      setAmount(isNaN(newAmount) ? 0 : newAmount);
    };

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
        .then((accounts) => accounts[0])
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
  const handleAmountChange = (event) => {
    const value = event.target.value;
    setAmount(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!walletConnected) {
      alert('Please connect your wallet to make a transaction.');
      return;
    }
  
    const billAmount = parseFloat(amount);
    if (isNaN(billAmount) || billAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
  
    if (walletBalance < billAmount) {
      alert('Insufficient balance. Please top up your wallet.');
      return;
    }
  
    // Convert bill amount to a BigNumber with the appropriate decimal places
    const decimals = 18; // Adjust this based on the token's decimal places
    const billAmountWei = ethers.utils.parseUnits(billAmount.toFixed(decimals), decimals);
  
    billAmount(billAmountWei);

  
  };
  
  

  const billAmount = async (amountWei) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const contract = new ethers.Contract(contractAddress, BillContract.abi, signer);
  
      const transaction = await contract.bill({ value: amountWei });
  
      await transaction.wait();
     
  
      alert(`Thank you for paying your bill ${ethers.utils.formatUnits(amountWei)} USD!`);
    } catch (error) {
      alert('An error occurred while processing your transaction.');
      console.error(error);
    }
  };
  
  const handleDonateClick = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet to make a transaction.');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 

    const billAmount = parseFloat(amount);
    const contractAddress = "0xCEc50932e02dA5D179A1cA0704107CD12b3C7fEC";
    const contract = new ethers.Contract(contractAddress, BillContract.abi, signer);
  
    try {
      // Get the current ETH/USD price from Chainlink Oracle
      const ethPrice = await contract.getLatestPrice();
    
      // Convert total price in dollars to ETH
      const totalBillInETH = ethers.utils.parseEther((billAmount / ethPrice * 100000000 ).toFixed(18));
  
      // Call the contract's 'bill' function to make the payment
      const transaction = await contract.bill({ value: totalBillInETH });

      await transaction.wait();
     
      setAmount(''); // Clear the donation amount field
      setInputText(''); // Clear the message input field
  
      
    } catch (error) {
     
      console.error(error);
    }
};

    return (
      <div className={styles.App}>
        <Form
          address={address}
          changeAddress={changeAddress}
          network={network}
          changeNetwork={changeNetwork}
          invalidAddress={invalidAddress}
          amount={amount} // Pass amount to Form
          changeAmount={changeAmount}
        />
        <div className={styles.qr_btn_container}>
        <Qr address={address} invalidAddress={invalidAddress} amount={amount} />
        <div className={styles.btn_container}>
        <button
            disabled={!walletConnected}
            onClick={handleDonateClick}
            className={styles.btn_fill}>
            Pay bill
          </button>
         <MyButton />
          </div>
          <input
                    type="text"
                    placeholder="input email address"
                    className={styles.eml_fill}
                    
                />
          </div>
      </div>
    );
  }
  
  export default QCode;