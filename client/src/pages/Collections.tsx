import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { getCollections } from '../adapters/marketItems';
import CollectionCard from '../components/CollectionCard';
import { Navbar } from '../components/Navbar';
import NFTCard from '../components/NFTCard';
import { Loader } from '../components/Loader';
import { useWeb3 } from '@3rdweb/hooks';
import { TransactionContext } from '../context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface CollectionsProps {}

export const Collections: React.FC<CollectionsProps> = ({}) => {
  const { currentAccount } = useContext(TransactionContext);
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*listing - provides all the NFTS that a actively listed on the marketplace for sale */
  const [listings, setListings]: any = useState([]);
  /*Display a spinning loading icon when data is loaded*/
  const [isLoading, setIsLoading] = useState(false);
  /*Toggles between the collections page and NFTs page */
  const [toggleNFTS, setToggleNFTS]: any = useState(false);
  /*Pulls all the collections from the database and puts them in the collections array */
  const [collections, setCollections]: any = useState([]);
  /*Pulls all the NFTs from each collection and puts then into the allNFTS array */
  const [allNfts, setAllNfts]: any = useState([]);
  /*Gets the  Metamask wallet private key from the marketplace owner. 
    The wallet private key is needed by ThirdWeb to provide access marketplace data  */
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  //Use the network you created the initial project on
  const RPC_URL = process.env.REACT_APP_RPC_URL;
  /*Marketplace address used by ThirdWeb SDK */
  const MARKETPLACE_ADDRESS: any = process.env.REACT_APP_MARKETPLACE_ADDRESS;
  /*The Wallet class inherits Signer and can sign transactions and messages using a private key
 as a standard Externally Owned Account (EOA).*/
  const wallet = new ethers.Wallet(
    WALLET_PRIVATE_KEY,
    ethers.getDefaultProvider(RPC_URL)
  );
  /*Connects to ThirdWebSDK using the wallet object */
  const sdk = new ThirdwebSDK(wallet);
  /*A Provider is an abstraction of a connection to the Ethereum network, providing a concise,
   consistent interface to standard Ethereum node functionality.*/
  const { provider } = useWeb3();
  /*Retrieves the marketplace data from ThirdwebSDK */
  const marketPlaceModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk;
  }, [provider]);
  /*Retrieves all the collections from the database during page load*/
  useEffect(() => {
    (async () => {
      // if (!currentAccount) {
      //   return Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: `Sorry, please install metamask and make sure you are connected to the Goerli Test Network before attempting to view collections and NFTs.`,
      //     background: '#19191a',
      //     color: '#fff',
      //     confirmButtonColor: '#2952e3',
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       navigate('/');
      //     }
      //   });
      // }
      setIsLoading(true);
      /*getCollections - GET statement that retrieves all the data from the database. */
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
  /*Once the marketplace data is pulled from Thirdweb, the following useEffect hook retrieves
   all the active listings on the marketplace from ThirdWeb */
  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      const marketplace = await marketPlaceModule.getMarketplace(
        MARKETPLACE_ADDRESS
      );
      setListings(await marketplace.getActiveListings());
    })();
  }, [marketPlaceModule]);
  /*Once the collections are pulled from the database, the following useEffect hook pulls all the NFTs
   from each collection and puts then into the allNFTS array  */
  useEffect(() => {
    let allNftsArray: any = [];
    (async () => {
      for (let x = 0; x <= collections.length - 1; x++) {
        (async () => {
          const contract = await sdk.getNFTCollection(
            collections[x].contractAddress
          );
          const allNfts = await contract.getAll();
          allNfts.map((nft) => {
            let nftObject = {
              nft: nft,
              collectionContractAddress: collections[x].contractAddress,
              createdBy: collections[x].createdBy,
            };
            allNftsArray.push(nftObject);
          });
        })();
      }
      setAllNfts(allNftsArray);
      setIsLoading(false);
    })();
  }, [collections]);
  return (
    <div className="overflow-hidden">
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <div className="w-full h-8 text-white font-bold text-4xl text-center">
              {!toggleNFTS ? 'Collections' : 'NFTS'}
            </div>
            <div className="flex flex-row-reverse smMAX:justify-center">
              <div className="mx-4 smMAX:mt-4">
                <button
                  type="button"
                  onClick={() => setToggleNFTS(!toggleNFTS)}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full white-and-blue-glassmorphism cursor-pointer py-2 px-7"
                >
                  {!toggleNFTS ? 'View NFTS' : 'View Collections'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
              {!toggleNFTS ? (
                <>
                  {collections.map((collectionItem: any, id: any) => (
                    <CollectionCard key={id} collectionItem={collectionItem} />
                  ))}
                </>
              ) : (
                <>
                  {allNfts.map((nftItem: any, id: any) => (
                    <NFTCard
                      key={id}
                      nftItem={nftItem.nft}
                      title={nftItem?.nft.metadata.name}
                      listings={listings}
                      collectionContractAddress={
                        nftItem.collectionContractAddress
                      }
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
