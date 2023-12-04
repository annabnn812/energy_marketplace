import style from "../styles/Card.module.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef, 
} from 'material-react-table';
import React, { useState,  useMemo, useEffect } from 'react';
import { ethers , BigNumber } from 'ethers';
import PeerContract from '../../fronted/artifacts/contracts/PeerContract.sol/PeerContract.json';


const contractAddress = '0xECA11c309f9D5e3b4bDA79F86E34a20E0Fad6ecB'; // Avalanche address

declare global {
  interface Window {
    ethereum?: any;
  }
}
interface Person {
  name: string;
  price: number;
  reserve:number;
  review: number;
  rating: number;
  buyKW?: number;
  amount?: number;
}


const data: Person[] = [
  {
    name: 'Solar Top',
    review: 1534,
    rating: 4.75,
    price: 0.46,
    reserve: 11146,
  },
  {
    name: 'Mini Farm',
    review: 789,
    rating: 4.71,
    price: 0.42,
    reserve: 447,
  },
  {
    name: 'John',
    review: 369,
    rating: 4.75,
    price: 0.46,
    reserve: 156,
  },
  {
    name: 'Sara',
    review: 1302,
    rating: 4.24,
    price: 0.44,
    reserve: 789,
  },
];

export default function ATable() {
  const [modifiedData, setModifiedData] = useState<Person[]>(data);
  const [amount, setAmount] = useState<number | string>('0');
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


  const handleAmountChange = (event: any) => {
    const value = event.target.value;
    setAmount(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!walletConnected) {
      alert('Please connect your wallet to make a transaction.');
      return;
    }
  
    const peerAmount = parseFloat(amount as string);
    if (isNaN(peerAmount) || peerAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
  
    if (walletBalance < peerAmount) {
      alert('Insufficient balance. Please top up your wallet.');
      return;
    }
  
    // Convert donation amount to a BigNumber with the appropriate decimal places
    const decimals = 18; // Adjust this based on the token's decimal places
    const peerAmountWei = ethers.utils.parseUnits(peerAmount.toFixed(decimals), decimals);
  
    peereAmount(peerAmountWei);

 
  };
  

  const peereAmount = async (amountWei: ethers.BigNumber) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const contract = new ethers.Contract(contractAddress, PeerContract.abi, signer);
  
      const transaction = await contract.peere({ value: amountWei });
  
      await transaction.wait();
  
      alert(`Thank you! You transfered ${ethers.utils.formatUnits(amountWei)} USD!`);
    } catch (error) {
      alert('An error occurred while processing your transaction.');
      console.error(error);
    }
  };
  
  
  const handlePeereClick = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet to make a transaction.');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
   
    console.log('Original amount:', amount);
const peerAmount = parseFloat(amount as string);
console.log('Parsed donationAmount:', peerAmount);
    const contractAddress = "0xECA11c309f9D5e3b4bDA79F86E34a20E0Fad6ecB";
    const contract = new ethers.Contract(contractAddress, PeerContract.abi, signer);
  
    try {
      // Get the current ETH/USD price from Chainlink Oracle
      const ethPrice = await contract.getLatestPrice();
    
      // Convert total price in dollars to ETH
      const totalPeerInETH = ethers.utils.parseEther((peerAmount / ethPrice * 100000000 ).toFixed(18));
  
      // Call the contract's 'donate' function to make the payment
      const transaction = await contract.peere({ value: totalPeerInETH });

      await transaction.wait();
      
      setAmount(''); // Clear the donation amount field
     
  
      alert(`Thank you! You transfered ${peerAmount} USD worth of AVAX!`);
    } catch (error) {
      alert('An error occurred while processing your transaction.');
      console.error(error);
    }
};


  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name', 
        header: 'Seller',
        muiTableHeadCellProps: { style: { color: 'green' } }, 
        enableHiding: false, 
      },
      {
        accessorFn: (originalRow) => originalRow.review, 
        id: 'review', 
        header: 'Review',
        Header: <i style={{ color: 'green' }}>Review</i>, 
      },
      {
        accessorFn: (originalRow) => originalRow.rating, 
        id: 'rating', 
        header: 'Rating',
        Header: <i style={{ color: 'green' }}>Rating</i>, 
      },
     
      {
        accessorFn: (originalRow) => originalRow.reserve, 
        id: 'reserve', 
        header: 'Reserve',
        Header: <i style={{ color: 'green' }}>Reserve kW</i>, 
      },
      {
        accessorFn: (originalRow) => originalRow.price, 
        id: 'price', 
        header: 'Price',
        Header: <i style={{ color: 'green' }}>Price per kW</i>, 
      },
      {
        accessorFn: (originalRow) => originalRow.buyKW, 
        id: 'buyKW', 
        header: 'Buy kW',
        Header: <i style={{ color: 'green' }}>Buy kW</i>, 
        Cell: ({ row, column }) => (
          <input
  type="number"
  max={row.original.reserve}
  onChange={(e) => {
    const buyKW = parseInt(e.target.value);
    const totalAmount = buyKW * row.original.price;
    row.original.buyKW = buyKW;
    row.original.amount = totalAmount;
    
    // Update the 'amount' state here
    setAmount(totalAmount);

    // Update the 'modifiedData' state
    setModifiedData([...modifiedData]);
  }}
/>
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.amount, 
        id: 'totalAmount', 
        header: 'Total amount',
        Header: <i style={{ color: 'green' }}>Total amount</i>, 
        Cell: ({ row, column }) => (
          <span>{row.original.amount}</span>
          
        ),
      },
      {
        id: 'pay', 
        header: 'Pay',
        Header: <i style={{ color: 'green' }}>Pay</i>, 
        Cell: ({ row, column }) => (
          <button
    type="button"
    className={style.btn_fill}
    disabled={!walletConnected}
    onClick={handlePeereClick}
  >
    Buy
  </button>
        ),
      },
    ],
    [modifiedData]
  );
 
 const table = useMaterialReactTable({
  columns,
  data, 
  enableRowSelection: true, 
  enableColumnOrdering: true, 
  enableGlobalFilter: false, 
});

return <MaterialReactTable table={table} />;
}
  