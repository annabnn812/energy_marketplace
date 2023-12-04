// NFTPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function NFTPage() {
  const { nftId } = useParams(); // Get the nftId from the URL
  const [nft, setNFT] = useState(null);

  // Fetch the NFT data using nftId (You need to implement this)
  useEffect(() => {
    async function fetchNFTData() {
      try {
        const response = await fetch(`/api/nfts/${nftId}`); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setNFT(data);
        } else {
          console.error('Failed to fetch NFT data');
        }
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    }

    fetchNFTData();
  }, [nftId]);

  if (!nft) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Display NFT information here */}
      <h1>{nft.name}</h1>
      <p>{nft.description}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default NFTPage;
