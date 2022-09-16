import React, { useContext, useEffect, useState } from 'react';
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
import { createCollection } from '../adapters/marketItems';
interface CreateCollectionProps {}
const Input = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
}: {
  placeholder: any;
  name: String;
  type: any;
  value: any;
  handleChange: any;
}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);
const TextArea = ({
  placeholder,
  name,
  value,
  handleChange,
  rows,
}: {
  placeholder: any;
  name: String;
  rows: any;
  value: any;
  handleChange: any;
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    rows={rows}
  />
);
const PercentageInput = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
  percentageKeyPress,
  id,
}: {
  placeholder: any;
  name: String;
  type: any;
  value: any;
  handleChange: any;
  percentageKeyPress: any;
  id: any;
}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className=" w-3/4 rounded-sm outline-none bg-transparent text-white border-none text-sm focus:ring-transparent"
    id={id}
    onKeyPress={(e) => percentageKeyPress(e, name)}
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

const style = {
  wrapper: `flex-auto  w-[13rem] h-[10rem] rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-collection m-auto`,
  logoWrapper: `flex-auto  w-[10rem] h-[10rem] rounded-full overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-bordernone m-auto`,
  bannerImageContainer: `flex-auto  w-[20rem] h-[10rem] rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-collection`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
};

export const CreateCollection: React.FC<CreateCollectionProps> = ({}) => {
  const apiURL = process.env.REACT_APP_API_URL;

  const {
    connectWallet,
    currentAccount,
    // formData,
    sendTransaction,
    // handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const { data, isError, refetch } = useQuery('me', me);
  // console.log(data.username);
  const [screenShot, setScreenshot] = useState(undefined);
  const [logoImage, setLogoImage] = useState({
    preview: '',
    raw: '',
  });
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
  const handleLogoPhotoChange = (e: any) => {
    if (e.target.files.length) {
      setLogoImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
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
    'https://eth-goerli.g.alchemy.com/v2/4ht15HX4e4b3kFaopvBKras7Ueaphi4p';
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
    let logoImageFilePath: any;
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
    console.log(logoImage.raw);
    await photoData.append('image', profileImage.raw);
    await photoData.append('image', bannerImage.raw);
    await photoData.append('image', logoImage.raw);
    await axios
      .post(`${apiURL}/marketItems/upload`, photoData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': 'https://kryptoturf.com',
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
          } else if (bannerImage.raw && index < 2) {
            bannerImageFilePath = image.path.split('uploads\\').join('').trim();
          } else {
            logoImageFilePath = image.path.split('uploads\\').join('').trim();
          }
          console.log(index);
          console.log('profile image', profileImageFilePath);
          console.log('banner image', bannerImageFilePath);
          console.log('logo image', logoImageFilePath);
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
          logoImage: logoImageFilePath,
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
    <div className="flex justify-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
        <p className="text-white text-3xl text-left w-full pb-8 text-center">
          Create New Collection
        </p>
        <label htmlFor="upload-logo-button" className="w-full">
          <p className="text-white text-1xl text-left w-full text-left pb-1">
            Logo Image
          </p>
          {logoImage.preview ? (
            <img
              src={logoImage.preview}
              alt="dummy"
              className=" m-auto rounded-full w-[150px] h-[150px]"
            />
          ) : (
            <>
              <div className={style.logoWrapper} />
            </>
          )}
        </label>
        <label htmlFor="upload-button" className="w-full">
          <p className="text-white text-1xl text-left w-full text-left pb-1">
            Featured Image
          </p>
          {profileImage.preview ? (
            <img
              src={profileImage.preview}
              alt="dummy"
              // width="300"
              // height="200"
              className="my-10 mx-5 w-[20rem] h-[24rem]"
            />
          ) : (
            <>
              <div className={style.wrapper} />
            </>
          )}
        </label>
        <label htmlFor="upload-banner-button">
          <p className="text-white text-1xl text-left w-full text-left py-1">
            Banner Image
          </p>
          {bannerImage.preview ? (
            <img
              src={bannerImage.preview}
              alt="dummy"
              // width="100"
              // height="200"
              className="my-10 mx-5 max-w-xs  w-[20rem] h-[10rem]"
            />
          ) : (
            <>
              <div className={style.bannerImageContainer} />
            </>
          )}
        </label>
        {/* <div className={style.wrapper}>
          <p className="text-white text-1xl text-left w-full text-center mt-24">
            Profile Image
          </p>
        </div> */}
        <input
          name="image"
          type="file"
          id="upload-logo-button"
          style={{ display: 'none' }}
          onChange={handleLogoPhotoChange}
        />
        <input
          name="image"
          type="file"
          id="upload-button"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <input
          name="image"
          type="file"
          id="upload-banner-button"
          style={{ display: 'none' }}
          onChange={handleBannerPhotoChange}
        />
        <br />
        <Input
          placeholder="Name"
          name="name"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <TextArea
          name="description"
          rows={4}
          placeholder="Description"
          handleChange={handleChange}
          value={null}
        ></TextArea>

        {/* <Input
          placeholder="Description"
          name="description"
          type="text"
          handleChange={handleChange}
          value={null}
        /> */}
        <div className="w-full flex flex-row justify-between">
          <div className="w-3/4	">
            <Input
              placeholder="Fee Recipient"
              name="fee_recipient"
              type="text"
              handleChange={handleChange}
              value={null}
            />
          </div>
          <div className="w-1/5	my-2 flex flex-row align-center white-glassmorphism-percentage">
            <PercentageInput
              placeholder="0"
              name="seller_fee_basis_points"
              type="number"
              handleChange={handleChange}
              value={null}
              id="percentageInput"
              percentageKeyPress={percentageKeyPress}
            />
            <div className="w-1/4 m-auto text-white">%</div>
          </div>
        </div>

        {/* <img src="http://localhost:3001/uploads/1659375700669.jpg" /> */}
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {isLoading ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={createNFTCollection}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer "
          >
            Create
          </button>
        )}
      </div>
    </div>
  );
};
