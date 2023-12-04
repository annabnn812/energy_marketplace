import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import styl from "../styles/Card.module.css";
import axios from 'axios';
import NFTMarketplace from '../../fronted/artifacts/contracts/SellerCarbon.sol/SellerCarbon.json';
import { marketplaceAddress } from '../../backend/config';
import { ethers } from 'ethers';
import { useRouter } from 'next/router'


declare global {
  interface Window {
    ethereum?: any;
  }
}

const formInput = {
  companyName: '',
  location: '',
  reservesTons: 0,
  industryTechnology: '',
  description: '',
  removalType: 'Direct removal',
  amountTons: 0,
  frequency: 'Monthly',
  priceUSDPerTons: 0,
  
};



export default function CarbonForm() {
  const [formData, setFormData] = useState(formInput);
  const [cid, setCid] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [minterAddress, setMinterAddress]= useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState(null)
  const router = useRouter()
 

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
  
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
  
          const response = await axios.post('https://api.nft.storage/upload', formData, {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxZTY4YUQ4MEUzNzMyQ0JlZjNGZDEzRDZFOTIzMGM4MGFEN0FjNjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5Mzg2NTcwNDEwNywibmFtZSI6IkVjb21hcmtldCJ9.Mq7J0jjea54VNyQBrYyur4hrqx0i2lLzAqDU-kLBM7g`, // Replace with your NFT.Storage API key
            },
          });
  
          if (response.status === 200) {
            const data = response.data;
            if (data && data.value && data.value.cid) {
              const cid = data.value.cid;
              setFormData((prevData) => ({
                ...prevData,
                image: `https://dweb.link/ipfs/${cid}`, // Updated URL format
                imageName: file.name, // Store the file name
              }));
              console.log('Image uploaded to IPFS with CID:', `https://dweb.link/ipfs/${cid}`);
            } else {
              console.error('Failed to extract CID from response:', data);
            }
          } else {
            console.error('Failed to upload image to IPFS');
          }
        } catch (error) {
          console.error('Error uploading image to IPFS:', error);
        }
      }
    }
  };
  
  

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    reservesTons: Yup.number()
      .min(0, 'Must be a positive number')
      .required('Required'),
    industryTechnology: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    removalType: Yup.string().required('Required'),
    amountTons: Yup.number()
      .min(0, 'Must be a positive number')
      .required('Required'),
    frequency: Yup.string().required('Required'),
    priceUSDPerTons: Yup.number()
      .min(0, 'Must be a positive number')
      .required('Required'),
  });

  const handleSubmit = async () => {
    try {
      // Make a POST request to your server to update the data
      const name = formData.companyName
      const description = formData
      const image = "https://dweb.link/ipfs/bafkreid5tux636aifaustg2fvgnj3xdlezjyjltukpvldexzxkbas2yeta"
      const attributes =  [
        
        {
          "location": formData.location, 
        }, 
        {
          "reservesTons": formData.reservesTons, 
        }, 
        {
          "industryTechnology": formData.industryTechnology, 
        }, 
        {
          "removalType": formData.removalType, 
        }, 
        {
          "frequency": formData.frequency, 
        },
        {
          "priceUSDPerTons": formData.priceUSDPerTons, 
        }, 
        {
          "amountTons": formData.amountTons, 
        }
       
      ]
    

      const response = await axios.post('https://api.nft.storage/upload', JSON.stringify({name, description, image, attributes}),{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxZTY4YUQ4MEUzNzMyQ0JlZjNGZDEzRDZFOTIzMGM4MGFEN0FjNjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5Mzg2NTcwNDEwNywibmFtZSI6IkVjb21hcmtldCJ9.Mq7J0jjea54VNyQBrYyur4hrqx0i2lLzAqDU-kLBM7g`,
        }
      });

      if (response.status === 200) {
        const { data } = response;
        if (data && data.value && data.value.cid) {
          const { cid } = data.value;
          setCid(`https://dweb.link/ipfs/${cid}`);
          console.log('Metadata uploaded successfully with CID:', `https://dweb.link/ipfs/${cid}`);

          // After successfully uploading metadata, mint the NFT
          listNFT(cid);
        } else {
          console.error('Failed to extract CID from response:', data);
        }
      } else {
        console.error('Failed to upload metadata');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const listNFT = async (metadataCID: any) => {
   
    if (!metadataCID ||!walletConnected ) {
      console.error('Missing metadata CID or wallet connection');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const minterAddress = await provider.getSigner().getAddress();

      // Replace NFTMarketplace with your contract's ABI and address
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);

      // Retrieve the listing price from the contract
      const price = ethers.utils.parseUnits("0.0025", 'ether')
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString()

      const cid = metadataCID; // Use the metadataCID directly
      const uri = `https://dweb.link/ipfs/${cid}`;
  
      const transaction = await contract.createNFT(
        cid, // Pass the metadataCID as the cid
        uri, // Pass the full URI as the uri
        price,
        { value: listingPrice }
      );
        
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
   
    
      const tokenId = receipt.events[0].args.tokenId.toNumber();


      if (receipt.status === 1) {
        await alert('NFT Profile minted successfully!');
        console.log('NFT minted successfully!');
        console.log('Wallet Address:', minterAddress);
        setMinterAddress(minterAddress);
        console.log('Minted NFT Token ID:', tokenId);
   

       

      } else {
        await alert('NFT Profile minting failed.');
        console.error('NFT minting failed.');
      }
    } catch (error) {
 
      console.error('Error minting NFT:', error);
    }
};

return (
  <>
    <Formik
      initialValues={formInput}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className={styl.formContainer}>
          <div>
            <label htmlFor="companyName">Name Company:</label>
            <div>
              <Field type="text" id="companyName" name="companyName" className={styl.smallFormField} onChange={handleChange} value={formData.companyName} />
            </div>
            <ErrorMessage name="companyName" component="div" />
            <br />
          </div>

          <div>
            <label htmlFor="location">Location:</label>
            <div>
              <Field type="text" id="location" name="location" className={styl.smallFormField} onChange={handleChange} value={formData.location} />
            </div>
            <ErrorMessage name="location" component="div" />
            <br />
          </div>
        </div>
        <div className={styl.formContainer}>
          <div>
            <label htmlFor="reservesTons">Reserves tons/year:</label>
            <div>
              <Field type="number" id="reservesTons" name="reservesTons" className={styl.smallFormField} onChange={handleChange} value={formData.reservesTons} />
            </div>
            <ErrorMessage name="reservesTons" component="div" />
            <br />
          </div>

          <div>
            <label htmlFor="industryTechnology">Industry / Technology:</label>
            <div>
              <Field type="text" id="industryTechnology" name="industryTechnology" className={styl.smallFormField} onChange={handleChange} value={formData.industryTechnology} />
            </div>
            <ErrorMessage name="industryTechnology" component="div" />
            <br />
          </div>
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <div>
            <Field as="textarea" id="description" name="description" className={styl.descriptionField} onChange={handleChange} value={formData.description} />
          </div>
          <ErrorMessage name="description" component="div" />
          <br />
        </div>

        <div className={styl.formContainer}>
          <div>
            <label>Choose Direct removal or BEECS:</label>
            <Field as="select" id="removalType" name="removalType" onChange={handleChange} value={formData.removalType}>
              <option value="Direct removal">Direct removal</option>
              <option value="BEECS">BEECS</option>
            </Field>
            <br />
          </div>

          <div>
            <label>Choose Monthly or One-time:</label>
            <Field as="select" id="frequency" name="frequency" onChange={handleChange} value={formData.frequency}>
              <option value="Monthly">Monthly</option>
              <option value="One-time">One-time</option>
            </Field>
            <br />
          </div>
        </div>
        <br />
        <div className={styl.formContainer}>
          <div>
            <label htmlFor="amountTons">Amount tons:</label>
            <div>
              <Field type="number" id="amountTons" name="amountTons" className={styl.smallFormField} onChange={handleChange} value={formData.amountTons} />
            </div>
            <ErrorMessage name="amountTons" component="div" />
          </div>

          <div>
            <label htmlFor="priceUSDPerTons">Price USD/tons:</label>
            <div>
              <Field type="number" id="priceUSDPerTons" name="priceUSDPerTons" className={styl.smallFormField} onChange={handleChange} value={formData.priceUSDPerTons} />
            </div>
            <ErrorMessage name="priceUSDPerTons" component="div" />
          </div>
        </div>
        <br />
        <br />
        <div>
          <br />
          <br />
          <button onClick={handleSubmit} type="submit" className={styl.btn_fill}>Submit</button>
        </div>
      </Form>
    </Formik>
    
  </>
);
}
