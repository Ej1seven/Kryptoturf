import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { addImages, getUserData, me } from '../adapters/user';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';
import { FaEthereum } from 'react-icons/fa';
import { format } from 'date-fns';
import { getCollections } from '../adapters/marketItems';
import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import NFTCard from '../components/NFTCard';
import CollectionCard from '../components/CollectionCard';
import { Navbar } from '../components/Navbar';
import { MdPhotoSizeSelectActual } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import axios from 'axios';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { Loader } from '../components';

interface ProfileProps {}

const ethPrice = require('eth-price');

export const Profile: React.FC<ProfileProps> = ({}) => {
  /*currentAccount - gets the account of the user currently connected to Metamask */
  const { currentAccount } = useContext(TransactionContext);
  /*URL path to save profile photo to the database */
  const photoURL = process.env.REACT_APP_PHOTO_API_URL;
  /*URL path to save collection photos to the database */
  const apiURL = process.env.REACT_APP_API_URL;
  /*me query checks if the user is logged in. If the user is logged in the server responds 
  with the user data. isLoading represents the processing time to pull the user data. isError is triggered
  if the server has issues pulling the data*/
  const { data } = useQuery('me', me);
  /*Display a spinning loading icon when the collection data is being sent to the blockchain and database*/
  const [isLoading, setIsLoading] = useState(false);
  /*Pulls all the NFTs from each collection and puts then into the allNFTS array */
  const [allNfts, setAllNfts]: any = useState([]);
  /*listing - provides all the NFTS that a actively listed on the marketplace for sale */
  const [listings, setListings]: any = useState([]);
  /*Stores the user data retrieved from the server through the getUserData() request. */
  const [userData, setUserData]: any = useState([]);
  /*Pulls all the collections from the database and puts them in the collections array */
  const [collections, setCollections]: any = useState([]);
  /*Pulls all the collections from the database and filters the NFTs owned by current user */
  const [collectedNFTS, setCollectedNFTS]: any = useState([]);
  /*Pulls all the collections from the database and filters the NFTs created by current user */
  const [createdNFTS, setCreatedNFTS]: any = useState([]);
  /*Toggles between the following NFT categories - (Collected, Created, Selling, Liked, Collections) */
  const [displayNFTS, setDisplayNFTS]: any = useState();
  /*Sets the collection featured image. The preview image will be displayed immediately on the front-end. 
  The raw image will be sent to the server and stored in the uploads folder. */
  const [profileImage, setProfileImage] = useState({
    preview: '',
    raw: '',
  });
  /*Sets the collection banner image. The preview image will be displayed immediately on the front-end. 
  The raw image will be sent to the server and stored in the uploads folder. */
  const [bannerImage, bannerSetImage] = useState({
    preview: '',
    raw: '',
  });
  /*Converts the Ethereum value to US dollars */
  const [ethToUsd, setEthToUsd]: any = useState(0);
  /*Sets Ethereum value that will be used when listing an NFT for sale */
  const [eth, setEth]: any = useState();
  /*Sets the profile photo image */
  const handleProfilePhotoChange = (e: any) => {
    e.preventDefault();
    if (e.target.files.length) {
      setProfileImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  /*Sets the banner photo image */
  const handleBannerPhotoChange = (e: any) => {
    e.preventDefault();
    if (e.target.files.length) {
      bannerSetImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  /*Saves the banner and profile images to the database */
  const saveChanges = async () => {
    setIsLoading(true);
    let profileImageFilePath: any;
    let bannerImageFilePath: any;
    let photoData = new FormData();
    await photoData.append('image', profileImage.raw);
    await photoData.append('image', bannerImage.raw);
    await axios
      .post(`${apiURL}/userAuth/upload`, photoData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res): any => {
        let imageFilePath = res.data;
        /*After the images are saved to the uploads folder the server responds with a file path for each photo.
          We map through file paths and save them to their respective variable. Later we will attach the file paths to their collections
          so they can be referenced in the future. */
        imageFilePath.map((image: any, index: any) => {
          if (profileImage.raw && index < 1) {
            profileImageFilePath = image.path
              /*edits the file path so it can be pulled from the front-end */
              .split('uploads\\')
              .join('')
              .trim();
          } else {
            bannerImageFilePath = image.path.split('uploads\\').join('').trim();
          }
        });
        return res.data;
      });
    (async () => {
      /*saves the image data to the database */
      const imageData = await {
        profileImage: profileImageFilePath,
        bannerImage: bannerImageFilePath,
        email: data.email,
      };
      await addImages(imageData);
      setUserData(await getUserData(data.email));
      setIsLoading(false);
      window.location.reload();
    })();
  };
  /*Discards the uploaded image data */
  const discardChanges = () => {
    if (profileImage.preview) {
      setProfileImage({
        preview: '',
        raw: '',
      });
    }
    if (bannerImage.preview) {
      bannerSetImage({
        preview: '',
        raw: '',
      });
    }
  };
  //Use the network you created the initial project on
  const RPC_URL = process.env.REACT_APP_RPC_URL;
  /*Gets the  Metamask wallet private key from the marketplace owner. 
    The wallet private key is needed by ThirdWeb to provide access marketplace data  */
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  /*The Wallet class inherits Signer and can sign transactions and messages using a private key
 as a standard Externally Owned Account (EOA).*/
  const wallet: any = new ethers.Wallet(
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
  useEffect(() => {
    if (!marketPlaceModule) return;
    let collectionsArray: any = [];
    let createdCollectionsArray: any = [];
    let allNftsArray: any = [];
    (async () => {
      const marketplace = await marketPlaceModule.getMarketplace(
        '0xF6CcFB6EE02a4d8BE306Ec34A0E511C9B8c6c1a5'
      );
      setListings(await marketplace.getActiveListings());
    })();
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
        const nfts = await contract.getOwned(currentAccount);
        await nfts.map((nft) => {
          let nftObject = {
            nft: nft,
            collectionContractAddress: collections[x].contractAddress,
            createdBy: collections[x].createdBy,
          };
          if (nftObject.createdBy === data.username) {
            createdCollectionsArray.push(nftObject);
          }
          collectionsArray.push(nftObject);
        });
      })();
      setCollectedNFTS(collectionsArray);
      setCreatedNFTS(createdCollectionsArray);
    }
    setAllNfts(allNftsArray);
  }, [marketPlaceModule]);
  let date: any = new Date(data?.createdAt);
  useEffect(() => {
    (async () => {
      await me();
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const eth = await ethPrice('usd');
      const editedEth = await Number(eth[0].replace('USD: ', ''));
      setEth(editedEth);
      setUserData(await getUserData(data.email));
    })();
  }, [data]);
  useEffect(() => {
    (async () => {
      setEthToUsd(Number((data?.turfCoins * eth).toFixed(3)));
    })();
  }, [userData]);
  return (
    <div className="text-white overflow-hidden">
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <label htmlFor="upload-banner-image">
            <div className="h-[300px] w-screen overflow-hidden flex justify-center items-center">
              {userData?.bannerImage && !bannerImage.preview ? (
                <>
                  <img
                    alt="banner"
                    src={`${photoURL}/${userData?.bannerImage}`}
                    className="w-full object-cover"
                  />
                </>
              ) : (
                <>
                  {bannerImage.preview ? (
                    <img
                      src={bannerImage.preview}
                      alt="dummy"
                      className="object-cover w-full h-[300px]"
                    />
                  ) : (
                    <div className="w-full h-[44vh] bg-black opacity-30	hover:opacity-100 flex justify-center items-center">
                      <MdPhotoSizeSelectActual className="h-20 w-20 m-auto" />
                    </div>
                  )}
                </>
              )}
            </div>
          </label>
          <input
            name="image"
            type="file"
            id="upload-banner-image"
            style={{ display: 'none' }}
            onChange={handleBannerPhotoChange}
          />
          <div className="flex flex-row h-20 justify-between">
            {userData?.profileImage && !profileImage.preview ? (
              <>
                <label htmlFor="upload-profile-image">
                  <img
                    src={`${photoURL}/${userData?.profileImage}`}
                    alt="dummy"
                    className=" rounded-full w-[150px] h-[150px] relative -top-[75px] left-[15px] border-[5px] border-black border-solid"
                  />
                </label>
              </>
            ) : (
              <label htmlFor="upload-profile-image">
                {profileImage.preview ? (
                  <img
                    src={profileImage.preview}
                    alt="dummy"
                    className=" rounded-full w-[150px] h-[150px] overflow-hidden relative -top-[75px] left-[15px] border-[5px] border-black border-solid "
                  />
                ) : (
                  <div className=" profile-image rounded-full w-[150px] h-[150px] relative -top-[75px] left-[15px] border-[5px] border-black border-solid bg-white text-black text-5xl flex justify-center items-center">
                    <div>{data?.username.charAt(0).toUpperCase()}</div>
                    <AiFillEdit className="hidden" />
                  </div>
                )}
              </label>
            )}
            {(profileImage.preview || bannerImage.preview) && (
              <div className="w-1/2 flex flex-row justify-end items-center">
                <button
                  className="btn-gradient-border text-white w-2/6 border-[1px] p-2 rounded-full cursor-pointer mr-2"
                  onClick={saveChanges}
                >
                  Save
                </button>
                <button
                  className="btn-gradient-border text-white w-2/6 border-[1px] p-2 rounded-full cursor-pointer mr-2"
                  onClick={discardChanges}
                >
                  Discard
                </button>
              </div>
            )}
          </div>
          <input
            name="image"
            type="file"
            id="upload-profile-image"
            style={{ display: 'none' }}
            onChange={handleProfilePhotoChange}
          />
          <div className="flex flex-col ml-4">
            <div className="flex flex-row">
              <div className="text-white text-2xl w-1/2">{data?.username}</div>
              <div className="w-1/2 flex flex-col">
                <div className="flex justify-end  flex-row pr-2">
                  <div className="text-white exSMMAX:text-lg text-2xl font-bold text-[#2081e2]">
                    TURF Coins:
                    <span className="text-[#2081e2]">
                      {' '}
                      {`${userData?.turfCoins}`}
                    </span>
                  </div>
                  <HiOutlineCurrencyDollar className="text-[#2081e2]" />
                </div>
                <div className="flex justify-end pr-4">
                  {' '}
                  <p>${ethToUsd.toLocaleString('en-US')} USD</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <div>
                <FaEthereum className="text-white mr-1" />
              </div>
              <div>{shortenAddress(currentAccount)}</div>
              {data?.createdAt && (
                <div className="ml-6">Joined {format(date, 'LLLL yyyy')}</div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row lg:w-3/4 sm:w-full justify-evenly mx-auto my-10">
              <button
                onClick={() => {
                  setDisplayNFTS('collected');
                }}
                className={`${
                  displayNFTS === 'collected' && 'font-bold'
                } cursor-pointer btn-gradient-border py-2 w-40 rounded-full mb-2 sm:mb-0`}
              >
                Collected
              </button>
              <button
                onClick={() => {
                  setDisplayNFTS('created');
                }}
                className={`${
                  displayNFTS === 'created' && 'font-bold'
                } cursor-pointer btn-gradient-border py-2 w-40 rounded-full mb-2 sm:mb-0`}
              >
                Created
              </button>
              <button
                onClick={() => {
                  setDisplayNFTS('selling');
                }}
                className={`${
                  displayNFTS === 'selling' && 'font-bold'
                } cursor-pointer btn-gradient-border py-2 w-40 rounded-full mb-2 sm:mb-0`}
              >
                Selling
              </button>
              <button
                onClick={() => {
                  setDisplayNFTS('liked');
                }}
                className={`${
                  displayNFTS === 'liked' && 'font-bold'
                } cursor-pointer btn-gradient-border py-2 w-40 rounded-full mb-2 sm:mb-0`}
              >
                Liked
              </button>
              <button
                onClick={() => {
                  setDisplayNFTS('collections');
                }}
                className={`${
                  displayNFTS === 'collections' && 'font-bold'
                } cursor-pointer btn-gradient-border py-2 w-40 rounded-full mb-2 sm:mb-0`}
              >
                Collections
              </button>
            </div>

            <div className="flex justify-center">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {displayNFTS === 'collected' && (
                  <>
                    {collectedNFTS.map((nftItem: any, id: any) => (
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
                {displayNFTS === 'created' && (
                  <>
                    {createdNFTS.map((nftItem: any, id: any) => (
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
                {displayNFTS === 'selling' && (
                  <>
                    {listings.map((listing: any, id: any) => (
                      <>
                        {collectedNFTS.map((nftItem: any, id: any) => (
                          <>
                            {nftItem?.nft.metadata.name ===
                              listing.asset.name && (
                              <>
                                <NFTCard
                                  key={id}
                                  nftItem={nftItem.nft}
                                  title={nftItem?.nft.metadata.name}
                                  listings={listings}
                                  collectionContractAddress={
                                    nftItem.collectionContractAddress
                                  }
                                />
                              </>
                            )}
                          </>
                        ))}
                      </>
                    ))}
                  </>
                )}
                {displayNFTS === 'liked' && (
                  <>
                    {userData.likes.map((like: any, idx: any) => {
                      return (
                        <div key={idx}>
                          {' '}
                          {allNfts.map((nftItem: any, id: any) => (
                            <>
                              {like.nftName === nftItem?.nft.metadata.name && (
                                <>
                                  <NFTCard
                                    key={id}
                                    nftItem={nftItem.nft}
                                    title={nftItem?.nft.metadata.name}
                                    listings={listings}
                                    collectionContractAddress={
                                      nftItem.collectionContractAddress
                                    }
                                  />
                                </>
                              )}
                            </>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}
                {displayNFTS === 'collections' && (
                  <>
                    {collections.map((collection: any, id: any) => (
                      <>
                        {collection.createdBy === data?.username && (
                          <>
                            {' '}
                            <CollectionCard
                              key={id}
                              collectionItem={collection}
                            />
                          </>
                        )}
                      </>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
