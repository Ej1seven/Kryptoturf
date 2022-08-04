import React, { useContext, useEffect, useState } from 'react';
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
import { collection } from '../adapters/marketItems';
interface CollectionsProps {}
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

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

const style = {
  wrapper: `flex-auto  w-[20rem] h-[15rem] rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism`,
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

export const Collections: React.FC<CollectionsProps> = ({}) => {
  const {
    connectWallet,
    currentAccount,
    // formData,
    sendTransaction,
    // handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const [screenShot, setScreenshot] = useState(undefined);
  const [image, setImage] = useState({
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
    external_link: '',
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
      setImage({
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
    console.log(e.target.value);
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleAttributeChange = (e: any, name: any) => {
    console.log(e.target.value);
    setAttributes((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  const REACT_APP_MODULE_ADDRESS: any = process.env.REACT_APP_MODULE_ADDRESS;

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
    const { name, description, fee_recipient, external_link } = formData;
    let profileImageFilePath;
    let bannerImageFilePath;
    // const imageData = new FormData(formData);
    // imageData.append('File', image.raw);
    const collectionData = {
      name: name,
      description: description,
      image: image.raw,
      fee_recipient: fee_recipient,
      external_link: external_link,
    };
    let photoData = new FormData();
    console.log(image.raw);
    console.log(bannerImage.raw);
    await photoData.append('image', image.raw);
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
          let editedFilePath;
          if (index < 1) {
            editedFilePath = image.path.split('uploads\\').join('').trim();
          }
          console.log(index);
          console.log(editedFilePath);
        });
        return res.data;
      });

    // let collectionId = 100;
    // console.log(image.raw);
    // collection(image.raw);

    // axios
    //   .post('http://localhost:3001/uploads', photoData, {
    //     // receive two parameter endpoint url ,form data
    //   })
    //   .then((res) => {
    //     // then print response status
    //     console.log(res.statusText);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
    // await sdk.deployer
    //   .deployNFTCollection({
    //     name: 'name',
    //     // description: description,
    //     primary_sale_recipient: currentAccount,
    //     // image: image,
    //     // external_link: external_link,
    //     // fee_recipient: fee_recipient,
    //     platform_fee_recipient: process.env.REACT_APP_PRIMARY_FEE_RECIPIENT,
    //     platform_fee_basis_points: 300,
    //   })
    //   .then((res) => {
    //     // let collectionId = res;
    //     // console.log(collectionId);
    //     // collection(collectionId);
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });
  };

  const mintNFT = async () => {
    // const nftData = {
    //   name: name,
    //   description: description,
    //   attributes: rows,
    //   externalLink,
    //   collection,
    //   supply,
    // };
    // rows.shift();
    // console.log(rows);
    // console.log(image.raw);
    // console.log(image.properties.name);
    // console.log(image.properties.lastModified);
    // console.log(image.properties.size);
    // console.log(image.properties.walletAddress);
    // // console.log(image.raw);
    // console.log(name);
    // console.log(description);
    // console.log(externalLink);
    // console.log(collection);
    // console.log(supply);
    // const mint = await getModule.mintTo(currentAccount, {
    //   name: name,
    //   description: description,
    //   attributes: rows,
    //   image: image.raw,
    //   external_url: externalLink,
    // });
    // const receipt = mint.receipt;
    // const tokenId = mint.id; // the id of the NFT minted
    // await mint.data();
    // console.log(receipt);
    // console.log(tokenId);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(image.raw);
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
        <label htmlFor="upload-button">
          {image.preview ? (
            <img
              src={image.preview}
              alt="dummy"
              width="300"
              height="300"
              className="my-10 mx-5"
            />
          ) : (
            <>
              <p className="text-white text-1xl text-left w-full text-left">
                Profile Image
              </p>
              <div className={style.wrapper} />
            </>
          )}
        </label>
        <label htmlFor="upload-banner-button">
          {bannerImage.preview ? (
            <img
              src={bannerImage.preview}
              alt="dummy"
              width="300"
              height="300"
              className="my-10 mx-5"
            />
          ) : (
            <>
              <p className="text-white text-1xl text-left w-full text-left">
                Profile Image
              </p>
              <div className={style.wrapper} />
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
        <Input
          placeholder="External link"
          name="external_Link"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Description"
          name="description"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Fee Recipient"
          name="fee_recipient"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Volume Traded"
          name="volume_traded"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Floor Price"
          name="floor_price"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <img src="http://localhost:3001/uploads/1659375700669.jpg" />
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
