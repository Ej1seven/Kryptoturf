import React, { useContext, useState } from 'react';
import { me } from '../adapters/user';
import { useQuery } from 'react-query';
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Loader } from '../components/Loader';
import axios from 'axios';
import { createCollection } from '../adapters/marketItems';
import { Navbar } from '../components';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer"
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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer"
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
    className=" w-3/4 rounded-sm outline-none bg-transparent text-white border-none text-sm focus:ring-transparent cursor-pointer"
    id={id}
    onKeyPress={(e) => percentageKeyPress(e, name)}
  />
);

const style = {
  wrapper: `flex-auto w-64 h-80 sm:max-w-[500px] rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-collection m-auto`,
  logoWrapper: `flex-auto  w-48 h-48 rounded-full overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-bordernone m-auto`,
  bannerImageContainer: `flex-auto sm:max-w-[900px] h-40 rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism-collection m-auto`,
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
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*URL path to save collection photos to the database */
  const apiURL = process.env.REACT_APP_API_URL;
  /*Display a spinning loading icon when the collection data is being sent to the blockchain and database*/
  const [isLoading, setIsLoading] = useState(false);
  /*currentAccount - gets the account of the user currently connected to Metamask */
  const { currentAccount } = useContext(TransactionContext);
  /*me query checks if the user is logged in. If the user is logged in the server responds 
      with the user data. isLoading represents the processing time to pull the user data. isError is triggered
      if the server has issues pulling the data*/
  const { data } = useQuery('me', me);
  /*Gets the  Metamask wallet private key from the marketplace owner. 
    The wallet private key is needed by ThirdWeb to provide access marketplace data  */
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  /*Primary fee recipient will be the account of the user who created the marketplace */
  const REACT_APP_PRIMARY_FEE_RECIPIENT: any =
    process.env.REACT_APP_PRIMARY_FEE_RECIPIENT;
  //Use the network you created the initial project on
  const RPC_URL = process.env.REACT_APP_RPC_URL;
  /*The Wallet class inherits Signer and can sign transactions and messages using a private key
 as a standard Externally Owned Account (EOA).*/
  const wallet = new ethers.Wallet(
    WALLET_PRIVATE_KEY,
    ethers.getDefaultProvider(RPC_URL)
  );
  /*Connects to ThirdWebSDK using the wallet object */
  const sdk = new ThirdwebSDK(wallet);
  /*Sets the collection logo image. The preview image will be displayed immediately on the front-end. 
  The raw image will be sent to the server and stored in the uploads folder. */
  const [logoImage, setLogoImage] = useState({
    preview: '',
    raw: '',
  });
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
  /*Sets the form data which will be stored in the database. */
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee_recipient: '',
    seller_fee_basis_points: '',
  });
  /*Sets the logo image */
  const handleLogoPhotoChange = (e: any) => {
    if (e.target.files.length) {
      setLogoImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  /*Sets the featured image */
  const handlePhotoChange = (e: any) => {
    if (e.target.files.length) {
      setProfileImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  /*Sets the banner image */
  const handleBannerPhotoChange = (e: any) => {
    if (e.target.files.length) {
      bannerSetImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  /*Sets the form data that is not photos. */
  const handleChange = (e: any, name: any) => {
    e.preventDefault();
    /*The seller fee basis points must be greater than 10 */
    if (name === 'seller_fee_basis_points' && e.target.value > 10) {
      const numsArr = Array.from(String(e.target.value), Number);
      e.target.value = numsArr[0];
    }
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  /*percentageKeyPress makes sure the user can only input numbers 1-10 into the seller fee percentage field. */
  const percentageKeyPress = (e: any, name: any) => {
    if (e.charCode == 46 || e.charCode == 45 || e.charCode == 43) {
      e.preventDefault();
    }
    let percentageInputLength = formData.seller_fee_basis_points.length;
    if (percentageInputLength === 1) {
      if (Number(e.target.value) !== 1) {
        e.preventDefault();
      }
    }
    if (percentageInputLength === 2) {
      e.preventDefault();
    }
  };
  const confirmCollection = (toastHandler = toast) =>
    toastHandler.success(`Collection succesfully created!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });

  const createNFTCollection = async () => {
    let error: any = null;
    /*If the user is not logged into their account an error message will popup when they 
      attempt to create a collection. */
    if (!data?.id) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must first login to create a collection`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    setIsLoading(true);
    const { name, description, fee_recipient, seller_fee_basis_points } =
      formData;
    /*Multiplies the seller fee basis points by 100 to get the accurate percentage of royalty fees. */
    const basisPoints = Number(seller_fee_basis_points) * 100;
    let profileImageFilePath: any;
    let bannerImageFilePath: any;
    let logoImageFilePath: any;
    let contractAddress: any;
    /*Formats the photos so the server can receive them and save them to the uploads folder. */
    let photoData = new FormData();
    await photoData.append('image', profileImage.raw);
    await photoData.append('image', bannerImage.raw);
    await photoData.append('image', logoImage.raw);
    /*Saves the images to the uploads folder. */
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
          } else if (bannerImage.raw && index < 2) {
            bannerImageFilePath = image.path.split('uploads\\').join('').trim();
          } else {
            logoImageFilePath = image.path.split('uploads\\').join('').trim();
          }
        });
        return res.data;
      });
    /*send the collection data to the blockchain */
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
        /*Thirdweb responds with the contract address for the collection just added to the marketplace */
        contractAddress = await res;
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
        /*Saves the collection data to the database. */
        await createCollection(collectionData);
      })
      .catch((err) => {
        error = err;
      });
    setIsLoading(false);
    /*If an error occurred while deploying the collection to the marketplace display a popup 
      error modal */
    if (error) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.message}`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*If the collection is successfully deployed display a popup success modal */
    Swal.fire({
      icon: 'success',
      title: 'Congrats!',
      text: `${name} has successfully been added to the Kryptoturf Marketplace!`,
      background: '#19191a',
      color: '#fff',
      confirmButtonColor: '#2952e3',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCollection();
        navigate(`/collection/${contractAddress}`);
      }
    });
  };

  return (
    <div className=" overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      {isLoading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
          <Loader />
          <p className="text-white text-1xl text-center">Please wait...</p>
          <p className="text-white text-1xl text-center">
            The task is being executed. May take up to 3 minutes until it is
            completed.
          </p>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="flex justify-center">
            <div className="p-5 w-96 sm:w-4/6 max-w-[700px] flex flex-col justify-start items-center blue-glassmorphism mt-8">
              <p className="text-white text-3xl text-left w-full pb-8 text-center">
                Create New Collection
              </p>
              <label htmlFor="upload-logo-button" className="w-full h-64 mb-4">
                <p className="text-white text-1xl text-left w-full text-left pb-1">
                  Logo Image
                </p>
                <p className="text-white text-1xl text-left w-full text-left pb-4">
                  350 x 350 recommended
                </p>
                {logoImage.preview ? (
                  <img
                    src={logoImage.preview}
                    alt="dummy"
                    className=" m-auto rounded-full w-48 h-48"
                  />
                ) : (
                  <>
                    <div className={style.logoWrapper} />
                  </>
                )}
              </label>
              <label htmlFor="upload-button" className="w-full h-96 mb-4">
                <p className="text-white text-1xl text-left w-full text-left pb-1 font-bold">
                  Featured Image
                </p>
                <p className="text-white text-1xl text-left w-full text-left pb-4">
                  400 x 600 recommended
                </p>
                {profileImage.preview ? (
                  <img
                    src={profileImage.preview}
                    alt="dummy"
                    // width="300"
                    // height="200"
                    className="flex-auto w-64 h-80 sm:max-w-[500px] rounded-2xl overflow-hidden cursor-pointer m-auto"
                  />
                ) : (
                  <>
                    <div className={style.wrapper} />
                  </>
                )}
              </label>
              <label htmlFor="upload-banner-button" className="w-full h-64">
                <p className="text-white text-1xl text-left w-full text-left py-1">
                  Banner Image
                </p>
                <p className="text-white text-1xl text-left w-full text-left pb-4">
                  1400 x 350 recommended
                </p>
                {bannerImage.preview ? (
                  <img
                    src={bannerImage.preview}
                    alt="dummy"
                    className="flex-auto sm:max-w-[650px] h-40 rounded-2xl overflow-hidden cursor-pointer m-auto"
                  />
                ) : (
                  <>
                    <div className={style.bannerImageContainer} />
                  </>
                )}
              </label>
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
              <div className="w-full flex flex-row">
                <div className="w-3/4">
                  {' '}
                  <Input
                    placeholder="Name"
                    name="name"
                    type="text"
                    handleChange={handleChange}
                    value={null}
                  />
                </div>
              </div>
              <TextArea
                name="description"
                rows={4}
                placeholder="Description"
                handleChange={handleChange}
                value={null}
              ></TextArea>
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
              <div className="h-[1px] w-full bg-gray-400 my-2" />
              <button
                type="button"
                onClick={createNFTCollection}
                className="text-white w-full mt-2 p-2 rounded-full cursor-pointer btn-gradient-border"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
