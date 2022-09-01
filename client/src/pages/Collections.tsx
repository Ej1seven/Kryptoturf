import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { me } from '../adapters/user';
import { useQuery } from 'react-query';
import { ethers } from 'ethers';
import fs from 'fs';
import { TransactionContext } from '../context/TransactionContext';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Loader } from '../components/Loader';
import { HiMenuAlt4, HiOutlinePhotograph } from 'react-icons/hi';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';
import { Description } from '@ethersproject/properties';
import axios from 'axios';
import { createCollection, getCollections } from '../adapters/marketItems';
import { useNFTCollection } from '@thirdweb-dev/react';
import CollectionCard from '../components/CollectionCard';
import { Navbar } from '../components/Navbar';
interface CollectionsProps {}

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-4/5 flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

export const Collections: React.FC<CollectionsProps> = ({}) => {
  const {
    connectWallet,
    currentAccount,
    // formData,
    sendTransaction,
    // handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const { provider } = useWeb3();
  const { data, isError, refetch } = useQuery('me', me);
  // console.log(data.username);
  const [screenShot, setScreenshot] = useState(undefined);
  const [collections, setCollections]: any = useState([]);
  const [marketplaceCollections, setMarketplaceCollections] = useState([]);

  const marketPlaceModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk;
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;
    let collectionsArray: any = [];
    for (let x = 0; x <= collections.length - 1; x++) {
      (async () => {
        const contract = await sdk.getNFTCollection(
          collections[x].contractAddress
        );
        const metadata = await contract.metadata.get();
        await collectionsArray.push(metadata);
      })();
      setMarketplaceCollections(collectionsArray);
    }
  }, [marketPlaceModule]);
  console.log(marketplaceCollections);

  useEffect(() => {
    (async () => {
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
  const [profileImage, setProfileImage] = useState({
    preview: '',
    raw: '',
  });
  const [bannerImage, bannerSetImage] = useState({
    preview: '',
    raw: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee_recipient: '',
    seller_fee_basis_points: '',
  });
  const [attributes, setAttributes] = useState({
    trait_type: '',
    value: '',
  });
  const [toggleMenu, setToggleMenu] = useState(false);

  // useEffect(() => {
  //   const url = `http://localhost:5000/fetchImage/${imageName}`;
  // });
  const handlePhotoChange = (e: any) => {
    if (e.target.files.length) {
      setProfileImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  const handleBannerPhotoChange = (e: any) => {
    if (e.target.files.length) {
      bannerSetImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  const handleChange = (e: any, name: any) => {
    e.preventDefault();
    if (name === 'seller_fee_basis_points' && e.target.value > 10) {
      const numsArr = Array.from(String(e.target.value), Number);
      console.log(numsArr.pop());
      console.log(numsArr[0]);
      e.target.value = numsArr[0];
    }
    console.log(e.target.value);
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const percentageKeyPress = (e: any, name: any) => {
    console.log(e.charCode);
    if (e.charCode == 46 || e.charCode == 45 || e.charCode == 43) {
      e.preventDefault();
    }
    let percentageInputLength = formData.seller_fee_basis_points.length;
    console.log(Number(e.target.value));
    console.log(percentageInputLength);
    if (percentageInputLength === 1) {
      if (Number(e.target.value) !== 1) {
        e.preventDefault();
        console.log('not working');
      }
      // console.log(e.target.value);
      // if (Number(e.target.value) !== 1) {
      //   e.preventDefault();
      //   console.log('not 1');
      // }
    }
    if (percentageInputLength === 2) {
      console.log(e.target.value);
      e.preventDefault();
      // if (Number(e.target.value) !== 10) {
      //   e.preventDefault();
      //   console.log('not 10');
      // }
    }
    // if (percentageInputLength === 3) {
    //   console.log(e.target.value);
    //   e.preventDefault();
    // }
  };
  const handleAttributeChange = (e: any, name: any) => {
    console.log(e.target.value);
    setAttributes((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  const REACT_APP_MODULE_ADDRESS: any = process.env.REACT_APP_MODULE_ADDRESS;
  const REACT_APP_PRIMARY_FEE_RECIPIENT: any =
    process.env.REACT_APP_PRIMARY_FEE_RECIPIENT;
  //Use the network you created the initial project on
  const rpcUrl =
    'https://eth-rinkeby.alchemyapi.io/v2/hKF-ScD-E399jeGhRfiT0VkwkUzeoJ8g';
  const wallet = new ethers.Wallet(
    WALLET_PRIVATE_KEY,
    ethers.getDefaultProvider(rpcUrl)
  );
  const sdk = new ThirdwebSDK(wallet);
  const getModule = sdk.getNFTCollection(
    REACT_APP_MODULE_ADDRESS
    //The address of you the module you created in ThirdWeb
  );

  const createNFTCollection = async () => {
    console.log(REACT_APP_PRIMARY_FEE_RECIPIENT);
    const { name, description, fee_recipient, seller_fee_basis_points } =
      formData;
    const basisPoints = Number(seller_fee_basis_points) * 100;
    console.log(basisPoints);
    let profileImageFilePath: any;
    let bannerImageFilePath: any;
    // const imageData = new FormData(formData);
    // imageData.append('File', image.raw);
    const collectionData = {
      name: name,
      description: description,
      image: profileImage.raw,
      fee_recipient: fee_recipient,
      // external_link: external_link,
    };
    let photoData = new FormData();
    console.log(profileImage.raw);
    console.log(bannerImage.raw);
    await photoData.append('image', profileImage.raw);
    await photoData.append('image', bannerImage.raw);
    await axios
      .post(`http://localhost:3001/marketItems/upload`, photoData, {
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

    // let collectionId = 100;
    // console.log(image.raw);
    // collection(image.raw);
    console.log(currentAccount);
    await sdk.deployer
      .deployNFTCollection({
        name: name,
        description: description,
        primary_sale_recipient: currentAccount,
        image: profileImage.raw,
        fee_recipient: fee_recipient,
        seller_fee_basis_points: basisPoints,
        platform_fee_recipient: process.env.REACT_APP_PRIMARY_FEE_RECIPIENT,
        platform_fee_basis_points: 300,
      })
      .then(async (res) => {
        let contractAddress = await res;
        const collectionData = await {
          title: name,
          contractAddress: contractAddress,
          description: description,
          createdBy: data.username,
          owners: data.username,
          profileImage: profileImageFilePath,
          bannerImage: bannerImageFilePath,
        };
        console.log(collectionData);
        await createCollection(collectionData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(profileImage.raw);
    // const formData = new FormData();
    // formData.append('image', image.raw);

    // await fetch('YOUR_URL', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: formData,
    // });
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div>
        <div className="w-full h-8 text-white font-bold text-4xl text-center">
          Collections
        </div>
        <div className="flex flex-row-reverse">
          <div className="mx-4">
            {' '}
            <button
              type="button"
              onClick={createNFTCollection}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full white-glassmorphism cursor-pointer py-2 px-7"
            >
              Filter
            </button>
          </div>
          <div>
            {' '}
            <button
              type="button"
              onClick={createNFTCollection}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full white-glassmorphism cursor-pointer py-2 px-7"
            >
              Sort
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {collections.map((nftItem: any, id: any) => (
            <CollectionCard
              key={id}
              nftItem={nftItem}
              className=""
              // title={collectionItem?.title}
              // listings={listings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
