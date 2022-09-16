import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
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

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const {
    connectWallet,
    currentAccount,
    // formData,
    sendTransaction,
    // handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const photoURL = process.env.REACT_APP_PHOTO_API_URL;
  const apiURL = process.env.REACT_APP_API_URL;
  const { data, isError, refetch } = useQuery('me', me);
  const queryClient = useQueryClient();
  const [allNfts, setAllNfts]: any = useState([]);
  const [listings, setListings]: any = useState([]);
  const [userData, setUserData]: any = useState([]);
  const [collections, setCollections]: any = useState([]);
  const [collectedNFTS, setCollectedNFTS]: any = useState([]);
  const [createdNFTS, setCreatedNFTS]: any = useState([]);
  const [displayNFTS, setDisplayNFTS]: any = useState('collected');
  const [profileImage, setProfileImage] = useState({
    preview: '',
    raw: '',
  });
  const [bannerImage, bannerSetImage] = useState({
    preview: '',
    raw: '',
  });
  const handleProfilePhotoChange = (e: any) => {
    e.preventDefault();
    if (e.target.files.length) {
      setProfileImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  const handleBannerPhotoChange = (e: any) => {
    e.preventDefault();

    if (e.target.files.length) {
      bannerSetImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  const saveChanges = async () => {
    let profileImageFilePath: any;
    let bannerImageFilePath: any;
    let photoData = new FormData();
    console.log(profileImage.raw);
    console.log(bannerImage.raw);
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
        console.log(res.data);
        let imageFilePath = res.data;
        imageFilePath.map((image: any, index: any) => {
          console.log(profileImage);
          if (profileImage.raw && index < 1) {
            profileImageFilePath = image.path
              .split('uploads\\')
              .join('')
              .trim();
          } else {
            bannerImageFilePath = image.path.split('uploads\\').join('').trim();
          }
          console.log(index);
          console.log('profile image', profileImageFilePath);
          console.log('banner image', bannerImageFilePath);
        });
        return res.data;
      });
    (async () => {
      const imageData = await {
        profileImage: profileImageFilePath,
        bannerImage: bannerImageFilePath,
        email: data.email,
      };
      console.log(imageData);
      await addImages(imageData);
      setUserData(await getUserData(data.email));
      // await queryClient.setQueryData('me', updatedUserData);
      // await queryClient.invalidateQueries('me');
      // await me();
    })();
  };
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
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  const rpcUrl =
    'https://eth-goerli.g.alchemy.com/v2/4ht15HX4e4b3kFaopvBKras7Ueaphi4p';
  const wallet: any = new ethers.Wallet(
    WALLET_PRIVATE_KEY,
    ethers.getDefaultProvider(rpcUrl)
  );
  const sdk = new ThirdwebSDK(wallet);
  const { provider } = useWeb3();
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
        '0x487105F54635F1351998d3e7A07dd140ACD67758'
      );
      setListings(await marketplace.getActiveListings());
    })();
    for (let x = 0; x <= collections.length - 1; x++) {
      (async () => {
        console.log(collections[x]);
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
        // console.log(nfts);
        await nfts.map((nft) => {
          let nftObject = {
            nft: nft,
            collectionContractAddress: collections[x].contractAddress,
            createdBy: collections[x].createdBy,
          };
          if (nftObject.createdBy === data.username) {
            createdCollectionsArray.push(nftObject);
          }
          console.log(nftObject);
          collectionsArray.push(nftObject);
        });
        // console.log(contract);
        // const metadata = await contract.metadata.get();
        // await collectionsArray.push(metadata);
      })();
      // setMarketplaceCollections(collectionsArray);
      setCollectedNFTS(collectionsArray);
      setCreatedNFTS(createdCollectionsArray);
    }
    setAllNfts(allNftsArray);
  }, [marketPlaceModule]);
  console.log(collectedNFTS);
  console.log(createdNFTS);
  console.log(listings);
  console.log(collections);
  console.log(allNfts);

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
      console.log(data);
      setUserData(await getUserData(data.email));
    })();
  }, [data]);
  useEffect(() => {
    (async () => {
      console.log(userData);
      console.log(userData.profileImage);
      userData.likes.forEach((like: any) => {
        console.log(like.nftName);
      });
    })();
  }, [userData]);
  console.log(data);
  return (
    <div className="text-white">
      <Navbar />
      <label htmlFor="upload-banner-image">
        <div className="h-[44vh] w-screen overflow-hidden flex justify-center items-center">
          {userData?.bannerImage && !bannerImage.preview ? (
            <>
              {' '}
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
                  // width="300"
                  // height="200"
                  className="object-cover w-full h-[44vh]"
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
                // width="300"
                // height="200"
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
              className="blue-glassmorphism text-white w-2/6 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer mr-2"
              onClick={saveChanges}
            >
              Save
            </button>
            <button
              className="blue-glassmorphism text-white w-2/6 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer mr-2"
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
        <div className="text-white text-2xl	">{data?.username}</div>
        <div className="flex flex-row items-center">
          <div>
            <FaEthereum className="text-white mr-1" />
          </div>
          <div>{shortenAddress(currentAccount)}</div>
          {data?.createdAt && (
            <div className="ml-6">Joined {format(date, 'LLLL yyyy')}</div>
          )}
        </div>
        <div className="flex flex-row w-3/4 justify-evenly mx-auto my-10">
          <div
            onClick={() => {
              setDisplayNFTS('collected');
            }}
          >
            Collected
          </div>
          <div
            onClick={() => {
              setDisplayNFTS('created');
            }}
          >
            Created
          </div>
          <div
            onClick={() => {
              setDisplayNFTS('selling');
            }}
          >
            Selling
          </div>
          <div
            onClick={() => {
              setDisplayNFTS('liked');
            }}
          >
            Liked
          </div>
          <div
            onClick={() => {
              setDisplayNFTS('collections');
            }}
          >
            Collections
          </div>
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
                        {nftItem?.nft.metadata.name === listing.asset.name && (
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
                {/* <>
                  {userData.likes.map((like: any, idx: any) => {
                    return <p key={idx}>{like.nftName}</p>;
                  })}
                </> */}
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
                          nftItem={collection}
                          className=""
                          // title={collectionItem?.title}
                          // listings={listings}
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
    </div>
  );
};
