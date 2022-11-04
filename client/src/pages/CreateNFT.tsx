import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Loader } from '../components/Loader';
import { HiMenuAlt4, HiOutlinePhotograph } from 'react-icons/hi';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';
import { useWeb3 } from '@3rdweb/hooks';
import { getCollections } from '../adapters/marketItems';
import { me } from '../adapters/user';
import { useQuery } from 'react-query';
import { createCollection } from '../adapters/marketItems';
import { Navbar } from '../components';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useMarkeplaceData from '../hooks/useMarketplaceData';

interface CreateNFTProps {}
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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism md:w-3/4 cursor-pointer"
  />
);
const CollectionInput = ({
  id,
  placeholder,
  name,
  type,
  value,
  handleChange,
  searchCollections,
  toggleCollectionsDropdown,
}: {
  id: any;
  placeholder: any;
  name: String;
  type: any;
  value: any;
  handleChange: any;
  searchCollections: any;
  toggleCollectionsDropdown: any;
}) => (
  <input
    id={id}
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism md:w-3/4 cursor-pointer"
    onKeyUp={(e) => searchCollections(e)}
    onClick={(e) => toggleCollectionsDropdown(e)}
  />
);
const style = {
  wrapper: `flex-auto w-[14rem] h-[15rem]  rounded-2xl overflow-hidden cursor-pointer border-[#3d4f7c] border-[1px] white-glassmorphism`,
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

export const CreateNFT: React.FC<CreateNFTProps> = ({}) => {
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*currentAccount - gets the account of the user currently connected to Metamask */
  const { currentAccount } = useContext(TransactionContext);
  /*Display a spinning loading icon when the collection data is being sent to the blockchain and database*/
  const [isLoading, setIsLoading] = useState(false);
  /*Pulls all the collections from the database and puts them in the collections array */
  const [collections, setCollections]: any = useState([]);
  /*Contains all the  collections on the marketplace*/
  const [marketplaceCollections, setMarketplaceCollections] = useState([]);
  /*Contains all the collections owned by the current user */
  const [collectionsOwnedByUser, setCollectionsOwnedByUser]: any = useState([
    { name: '', contractAddress: '' },
  ]);
  /*toggles the collections dropdown menu */
  const [displayCollections, setDisplayCollections] = useState(false);
  /*Checks if the user is logged in and returns the user data */
  const { data } = useQuery('me', me);
  /*Gets the marketplace data from Thirdweb */
  const { marketPlaceModule } = useMarkeplaceData();
  /*Sets the uploaded image properties */
  const [image, setImage] = useState({
    preview: '',
    raw: '',
    properties: {
      name: '',
      lastModified: 0,
      lastModifiedDate: '',
      size: 0,
      type: '',
      webkitRelativePath: '',
      walletAddress: '',
    },
  });
  /*Sets the formData properties */
  const [formData, setFormData] = useState({
    name: '',
    externalLink: '',
    description: '',
    collection: '',
    supply: '',
  });
  /*Sets the attributes */
  const [attributes, setAttributes] = useState({
    trait_type: '',
    value: '',
  });
  /*Sets the image properties */
  const handlePhotoChange = (e: any) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        properties: {
          name: e.target.files[0].name,
          lastModified: e.target.files[0].lastModified,
          lastModifiedDate: e.target.files[0].lastModifiedDate,
          size: e.target.files[0].size,
          type: e.target.files[0].type,
          webkitRelativePath: e.target.files[0].webkitRelativePath,
          walletAddress: currentAccount,
        },
      });
    }
  };
  const confirmNFT = (toastHandler = toast) =>
    toastHandler.success(`NFT succesfully created!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });
  /*Sets the form data */
  const handleChange = (e: any, name: any) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  /*Sets the attributes data */
  const handleAttributeChange = (e: any, name: any) => {
    setAttributes((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  /*Gets the  Metamask wallet private key from the marketplace owner. 
    The wallet private key is needed by ThirdWeb to provide access marketplace data  */
  let WALLET_PRIVATE_KEY: any = process.env.REACT_APP_WALLET_PRIVATE_KEY;
  //Use the network you created the initial project on
  const RPC_URL = process.env.REACT_APP_RPC_URL;
  //Use the network you created the initial project on
  const wallet = new ethers.Wallet(
    WALLET_PRIVATE_KEY,
    ethers.getDefaultProvider(RPC_URL)
  );
  /*Connects to ThirdWebSDK using the wallet object */
  const sdk = new ThirdwebSDK(wallet);
  /*The following useEffect function maps through all the collections in the database and makes sure they are listed on the marketplace */
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
  /*The following useEffect function maps through all the collections in the database and checks which collections are owned by the current user. */
  useEffect(() => {
    if (!marketplaceCollections) return;
    let ownedCollections: any = [];
    (async () => {
      const username = await data.username;
      for (let x = 0; x <= collections.length - 1; x++) {
        if (collections[x].createdBy === username) {
          ownedCollections.push({
            name: collections[x].title,
            contractAddress: collections[x].contractAddress,
          });
        }
      }
      setCollectionsOwnedByUser(ownedCollections);
    })();
  }, [collections]);
  /*The following useEffect function gets all the collections from the database */
  useEffect(() => {
    (async () => {
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
  /*Mints the NFT to Kryptoturf marketplace */
  const mintNFT = async () => {
    setIsLoading(true);
    let error: any = null;
    const { name, externalLink, description } = formData;
    /*If the user has not entered a name an error message will popup when they click the create button */
    if (!name) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please enter a name for your NFT`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*If the user has not uploaded an image an error message will popup when they click the create button */
    if (!image.raw) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please upload an image for your NFT`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*If the user is not logged into their account an error message will popup when they 
      attempt to create a NFT. */
    if (!data?.id) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must first login to create a NFT`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*Determines if the user entered any attributes for the NFT. If not the array will return undefined */
    rows.shift();
    /*Creates a randon number which will be a part of the Untitled Collection
    if the NFT the user creates is not a part of a already created collection */
    let val = Math.floor(1000 + Math.random() * 9000000);
    /*Sets the name for the untitled collection */
    let untitledCollection = `Untitled Collection #${val}`;
    let untitledCollectionContractAddress: any = null;
    /*If the NFT is a part of a already created collection collectionName will hold the value */
    let collectionName;
    /*collectionInput gets the name of the collection selected by the user from the dropdown list then 
      mints the NFT to the selected collection */
    let collectionInput: any = document.getElementById('collection');
    for (let x = 0; x <= collectionsOwnedByUser.length - 1; x++) {
      if (
        collectionInput.value.toLowerCase() ===
        collectionsOwnedByUser[x].name.toLowerCase()
      ) {
        collectionName = collectionsOwnedByUser[x].name;
        /*Gets the collection contract address from the ThirdWeb */
        const getModule = await sdk.getNFTCollection(
          collectionsOwnedByUser[x].contractAddress
        );
        /*Mints the NFT to the database */
        const mint = await getModule.mintTo(currentAccount, {
          name: name,
          description: description,
          attributes: rows,
          image: image.raw,
          external_url: externalLink,
        });
        const receipt = mint.receipt; //the receipt from the transaction
        const tokenId = mint.id; // the id of the NFT minted
        await mint.data().catch((err) => {
          error = err;
        });
        setIsLoading(false);
        /*If there is an error minting the NFT a error message will popup */
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
        /*If the NFT mint is successful then a success message will popup */
        return Swal.fire({
          icon: 'success',
          title: 'Congrats!',
          text: `${name} has successfully been added to the Kryptoturf Marketplace!`,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        }).then((result) => {
          console.log(untitledCollectionContractAddress);
          if (result.isConfirmed) {
            let collectionInput: any = document.getElementById('collection');
            confirmNFT();
            navigate(
              `/collection/${collectionsOwnedByUser[x].contractAddress}`
            );
          }
        });
      }
    }
    console.log(collectionName);
    /*if the user did not select a collection they created then first check if they already have an Untitled Collection. If so, mint the new NFT to this collection. If the user does not already have an Untitled Collection create a new one and mint the NFT to it */
    if (!collectionName) {
      /*Map through the collections owned by the user and check to see if they already have a Untitled Collection. If so mint the NFT to the collection. */
      for (let x = 0; x <= collectionsOwnedByUser.length - 1; x++) {
        if (
          collectionsOwnedByUser[x].name
            .toLowerCase()
            .includes('untitled collection')
        ) {
          untitledCollectionContractAddress =
            collectionsOwnedByUser[x].contractAddress;
          const getModule = await sdk.getNFTCollection(
            collectionsOwnedByUser[x].contractAddress
          );
          const mint = await getModule.mintTo(currentAccount, {
            name: name,
            description: description,
            attributes: rows,
            image: image.raw,
            external_url: externalLink,
          });
          const receipt = mint.receipt;
          const tokenId = mint.id; // the id of the NFT minted
          await mint.data().catch((err) => {
            error = err;
          });
          setIsLoading(false);
          /*If there is an error minting the NFT a error message will popup */
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
          /*If the NFT mint is successful then a success message will popup */
          return Swal.fire({
            icon: 'success',
            title: 'Congrats!',
            text: `${name} has successfully been added to the Kryptoturf Marketplace!`,
            background: '#19191a',
            color: '#fff',
            confirmButtonColor: '#2952e3',
          }).then((result) => {
            console.log(untitledCollectionContractAddress);
            if (result.isConfirmed) {
              confirmNFT();
              navigate(`/collection/${untitledCollectionContractAddress}`);
            }
          });
        }
      }
      /*If an Untitled Collection has not already been created deploy a new Untitled Collection then mint the NFT to that collection */
      if (!untitledCollectionContractAddress) {
        (async () => {
          await sdk.deployer
            .deployNFTCollection({
              name: untitledCollection,
              primary_sale_recipient: currentAccount,
            })
            .then(async (res) => {
              let contractAddress = await res;
              untitledCollectionContractAddress = await contractAddress;
              const collectionData = await {
                title: untitledCollection,
                contractAddress: contractAddress,
                createdBy: data.username,
                owners: data.username,
              };
              const getModule = await sdk.getNFTCollection(contractAddress);

              await createCollection(collectionData);
              const mint = await getModule.mintTo(currentAccount, {
                name: name,
                description: description,
                attributes: rows,
                image: image.raw,
                external_url: externalLink,
              });
              const receipt = mint.receipt;
              const tokenId = mint.id; // the id of the NFT minted
              await mint.data();
            })
            .catch((err) => {
              error = err;
            });
          setIsLoading(false);
          /*If there is an error minting the NFT a error message will popup */
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
          /*If the NFT mint is successful then a success message will popup */
          return Swal.fire({
            icon: 'success',
            title: 'Congrats!',
            text: `${name} has successfully been added to the Kryptoturf Marketplace!`,
            background: '#19191a',
            color: '#fff',
            confirmButtonColor: '#2952e3',
          }).then((result) => {
            console.log(untitledCollectionContractAddress);
            if (result.isConfirmed) {
              confirmNFT();
              navigate(`/collection/${untitledCollectionContractAddress}`);
            }
          });
        })();
      }
    }
  };
  /*Sets the rows on the attributes dropdown menu */
  const [rows, setRows] = useState([{}]);
  /*The titles for the two columns on the attributes chart are Type and Name */
  const columnsArray = ['Type', 'Name']; // pass columns here dynamically
  /*Toggles the attributes popup menu */
  const [toggleMenu, setToggleMenu] = useState(false);
  /*Adds a new row to the attributes menu */
  const handleAddRow = () => {
    setRows([...rows, attributes]);
  };
  /*Saves the attributes created by the user */
  const saveAttributes = () => {
    setAttributes(attributes);
    setRows([...rows, attributes]);
    setToggleMenu(false);
  };
  /*Deletes the selected row */
  const handleRemoveSpecificRow = (idx: any) => {
    const tempRows = [...rows]; // to avoid  direct state mutation
    tempRows.splice(idx, 1);
    setRows(tempRows);
  };
  /*Filters the collections on the dropdown menu to match the input provided by the user */
  const searchCollections = (e: any) => {
    let input = e.target.value;
    input = input.toLowerCase();
    let collections = document.getElementsByClassName('collection');
    for (let i = 0; i < collections.length; i++) {
      if (
        !collections[i].innerHTML.toLowerCase().startsWith(input.toLowerCase())
      ) {
        collections[i].classList.add('hidden');
      } else {
        collections[i].classList.remove('hidden');
      }
    }
  };
  /*Toggles the collections dropdown menu */
  const toggleCollectionsDropdown = (e: any) => {
    let val = Math.floor(1000 + Math.random() * 9000000);
    setDisplayCollections(!displayCollections);
  };
  /*Changes the collection input to the selected item */
  const changeCollectionInput = (e: any) => {
    let collectionInput: any = document.getElementById('collection');
    collectionInput.value = e.target.outerText;
    console.log(collectionInput.value);
  };
  let collectionInputElement: any = document.getElementById('collection');
  /*Recognizes when the user has selected a different collection and hides the dropdown afterwards */
  document.addEventListener('click', (event) => {
    const isClickInside = collectionInputElement.contains(event.target);
    if (!isClickInside) {
      setDisplayCollections(false);
    }
  });
  return (
    <div className=" overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="p-5 w-96 sm:w-4/6 max-w-[700px] flex flex-col justify-start items-center blue-glassmorphism mt-8">
            <p className="text-white text-3xl text-left w-full pb-8 text-center">
              Create New Item
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
                <div className={style.wrapper}>
                  <HiOutlinePhotograph color="white" size={'14rem'} />
                </div>
              )}
              <h5
                onClick={handlePhotoChange}
                className="text-white w-full mt-10 p-2 rounded-full cursor-pointer text-center btn-gradient-border"
              >
                Upload your photo
              </h5>
            </label>

            <input
              type="file"
              id="upload-button"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
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
              name="externalLink"
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
            <CollectionInput
              id="collection"
              placeholder="Collection"
              name="collection"
              type="text"
              handleChange={handleChange}
              value={null}
              searchCollections={searchCollections}
              toggleCollectionsDropdown={toggleCollectionsDropdown}
            />
            {displayCollections && (
              <>
                {' '}
                {collectionsOwnedByUser.length > 0 && (
                  <div className="w-full white-glassmorphism-options ">
                    {collectionsOwnedByUser.map(
                      (collection: any, index: any) => {
                        if (index !== collectionsOwnedByUser.length - 1) {
                          return (
                            <div
                              className="w-full  p-2 outline-none bg-transparent text-white text-sm border-b border-[#3d4f7c] collection  cursor-pointer"
                              onClick={(e) => changeCollectionInput(e)}
                            >
                              {collection.name}
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className="w-full  p-2 outline-none bg-transparent text-white text-sm border-none collection  cursor-pointer"
                              onClick={(e) => changeCollectionInput(e)}
                            >
                              {collection.name}
                            </div>
                          );
                        }
                      }
                    )}
                  </div>
                )}
              </>
            )}
            <div
              onClick={() => setToggleMenu(true)}
              className=" w-full content-center text-white flex flex-row border-[#3d4f7c] md:w-3/4  cursor-pointer"
            >
              {' '}
              <div className="w-11/12 flex flex-row justify-start">
                <div>
                  <HiMenuAlt4 fontSize={28} className=" mx-2 cursor-pointer" />
                </div>
                <div>
                  {' '}
                  <button> Properties</button>
                </div>
              </div>
              <IoIosAdd size={'2rem'} />
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={mintNFT}
                className="text-white w-full mt-2  p-2 btn-gradient-border rounded-full cursor-pointer "
              >
                Create
              </button>
            )}
          </div>
          {toggleMenu && (
            <>
              {/* <!-- Main modal --> */}
              <div
                id="defaultModal"
                aria-hidden="true"
                className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full "
              >
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto m-auto">
                  {/* <!-- Modal content --> */}
                  <div className="relative bg-white rounded-lg shadow bg-[#19191a] ">
                    {/* <!-- Modal header --> */}
                    <div className="flex flex-col justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                      <div className=" w-full flex flex-row">
                        <h3 className="w-11/12 ml-[8%] text-xl font-semibold text-gray-900 dark:text-white text-center">
                          Add Properties{' '}
                        </h3>
                        <AiOutlineClose
                          fontSize={28}
                          className="text-white cursor-pointer relative"
                          onClick={() => setToggleMenu(false)}
                        />
                      </div>
                      {/* <!-- Modal body --> */}
                      <div className="p-6 space-y-6 w-full text-white">
                        <table className="table-auto w-full">
                          <thead>
                            <tr className="w-full">
                              <th className="w-1/12	"></th>
                              <th className="w-2/5">Type</th>
                              <th className="w-2/5">Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((item, idx) => (
                              <tr className="w-full" key={idx}>
                                <td className="">
                                  <>{idx + 1}</>
                                </td>
                                {columnsArray.map((column, index) =>
                                  index === 0 ? (
                                    <>
                                      <td className="" key={index}>
                                        <Input
                                          placeholder="Character"
                                          name="trait_type"
                                          type="text"
                                          handleChange={handleAttributeChange}
                                          value={null}
                                        />
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {' '}
                                      <td className="" key={index}>
                                        <Input
                                          placeholder="Male"
                                          name="value"
                                          type="text"
                                          handleChange={handleAttributeChange}
                                          value={null}
                                        />
                                      </td>
                                    </>
                                  )
                                )}

                                <td>
                                  <AiOutlineClose
                                    fontSize={25}
                                    className="text-white cursor-pointer ml-4"
                                    onClick={() => handleRemoveSpecificRow(idx)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          onClick={handleAddRow}
                          className="text-white w-1/3 mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer px-5 py-2.5"
                        >
                          Add more
                        </button>
                      </div>
                      {/* <!-- Modal footer --> */}
                      <div className="flex w-full items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 flex-row">
                        <button
                          type="button"
                          onClick={saveAttributes}
                          className="text-white w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 bg-blue-700 w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer px-5 py-2.5"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
