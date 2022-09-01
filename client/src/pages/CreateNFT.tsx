import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import fs from 'fs';
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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    onKeyUp={(e) => searchCollections(e)}
    onClick={(e) => toggleCollectionsDropdown(e)}
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

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
  const {
    connectWallet,
    currentAccount,
    // formData,
    sendTransaction,
    // handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const { provider } = useWeb3();
  const [collections, setCollections]: any = useState([]);
  const [marketplaceCollections, setMarketplaceCollections] = useState([]);
  const [collectionsOwnedByUser, setCollectionsOwnedByUser]: any = useState([
    { name: '', contractAddress: '' },
  ]);
  const [collectionInput, setCollectionInput] = useState();
  const [collectionsInputActive, setCollectionsInputActive] = useState(false);
  const [displayCollections, setDisplayCollections] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');
  const { data, isError, refetch } = useQuery('me', me);
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
        console.log(contract);
        const metadata = await contract.metadata.get();
        await collectionsArray.push(metadata);
      })();
      setMarketplaceCollections(collectionsArray);
    }
  }, [marketPlaceModule]);
  useEffect(() => {
    if (!marketplaceCollections) return;
    let ownedCollections: any = [];
    (async () => {
      const username = await data.username;
      console.log(username);
      for (let x = 0; x <= collections.length - 1; x++) {
        console.log(collections[x].createdBy);
        if (collections[x].createdBy === username) {
          ownedCollections.push({
            name: collections[x].title,
            contractAddress: collections[x].contractAddress,
          });
          console.log('match!');
        }
      }
      setCollectionsOwnedByUser(ownedCollections);
    })();
  }, [collections]);
  console.log(marketplaceCollections);
  console.log(collections);
  console.log(collectionsOwnedByUser);
  console.log(collectionsOwnedByUser.length);

  useEffect(() => {
    (async () => {
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
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
  const [formData, setFormData] = useState({
    name: '',
    externalLink: '',
    description: '',
    collection: '',
    supply: '',
  });
  const [attributes, setAttributes] = useState({
    trait_type: '',
    value: '',
  });
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

  const createNFTCollection = async () => {
    await sdk.deployer
      .deployNFTCollection({
        name: 'My Collection One',
        primary_sale_recipient: currentAccount,
      })
      .then(async (res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const mintNFT = async () => {
    const { name, externalLink, description, collection, supply } = formData;
    rows.shift();
    let val = Math.floor(1000 + Math.random() * 9000000);
    let untitledCollection = `Untitled Collection #${val}`;
    console.log(untitledCollection);
    let collectionName;
    let collectionInput: any = document.getElementById('collection');
    console.log(collectionInput.value);
    for (let x = 0; x <= collectionsOwnedByUser.length - 1; x++) {
      if (
        collectionInput.value.toLowerCase() ===
        collectionsOwnedByUser[x].name.toLowerCase()
      ) {
        console.log('match', collectionInput.value);
        collectionName = collectionsOwnedByUser[x].name;
        // setCollectionAddress(collectionsOwnedByUser[x].contractAddress);
        const getModule = await sdk.getNFTCollection(
          // REACT_APP_MODULE_ADDRESS
          //The address of you the module you created in ThirdWeb
          // '0x0b75d3533Eb2ef516e5237FD20d59d2BAc8549B5'
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
        await mint.data();
        console.log(receipt);
        console.log(tokenId);
      }
    }
    console.log(collectionName);
    if (!collectionName) {
      console.log('new collection');
      console.log(currentAccount);
      for (let x = 0; x <= collectionsOwnedByUser.length - 1; x++) {
        if (
          collectionsOwnedByUser[x].name
            .toLowerCase()
            .includes('untitled collection')
        ) {
          console.log('match', collectionsOwnedByUser[x].name);
          const getModule = await sdk.getNFTCollection(
            // REACT_APP_MODULE_ADDRESS
            //The address of you the module you created in ThirdWeb
            // '0x0b75d3533Eb2ef516e5237FD20d59d2BAc8549B5'
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
          await mint.data();
          console.log(receipt);
          return console.log(tokenId);
        }
      }
      (async () => {
        await sdk.deployer
          .deployNFTCollection({
            name: untitledCollection,
            primary_sale_recipient: currentAccount,
          })
          .then(async (res) => {
            let contractAddress = await res;
            const collectionData = await {
              title: untitledCollection,
              contractAddress: contractAddress,
              createdBy: data.username,
              owners: data.username,
            };
            const getModule = await sdk.getNFTCollection(
              // REACT_APP_MODULE_ADDRESS
              //The address of you the module you created in ThirdWeb
              // '0x0b75d3533Eb2ef516e5237FD20d59d2BAc8549B5'
              contractAddress
            );

            console.log(collectionData);
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
            console.log(receipt);
            console.log(tokenId);
            // await setCollectionAddress(contractAddress);
            // await console.log(getModule);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })();
    }
    // const nftData = {
    //   name: name,
    //   description: description,
    //   attributes: rows,
    //   externalLink,
    //   collection,
    //   supply,
    // };
    // console.log(rows);
    // console.log(collectionAddress);
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

  const [rows, setRows] = useState([{}]);
  const columnsArray = ['Type', 'Name']; // pass columns here dynamically
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleAddRow = () => {
    const { trait_type, value } = attributes;
    setRows([...rows, attributes]);
  };
  const saveAttributes = () => {
    const { trait_type, value } = attributes;
    setAttributes(attributes);
    setRows([...rows, attributes]);
    setToggleMenu(false);
  };

  const postResults = () => {
    console.log(rows); // there you go, do as you please
  };
  const handleRemoveSpecificRow = (idx: any) => {
    const tempRows = [...rows]; // to avoid  direct state mutation
    tempRows.splice(idx, 1);
    setRows(tempRows);
  };

  const updateState = (e: any) => {
    let prope = e.target.attributes.column.value; // the custom column attribute
    let index = e.target.attributes.index.value; // index of state array -rows
    let fieldValue = e.target.value; // value

    const tempRows = [...rows]; // avoid direct state mutation
    const tempObj: any = rows[index]; // copy state object at index to a temporary object
    tempObj[prope] = fieldValue; // modify temporary object

    // return object to rows` clone
    tempRows[index] = tempObj;
    setRows(tempRows); // update state
  };

  const searchCollections = (e: any) => {
    let input = e.target.value;
    input = input.toLowerCase();
    console.log(input);
    // if (input.length === 0) {
    //   setDisplayCollections(true);
    // }
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

  const toggleCollectionsDropdown = (e: any) => {
    // let collectionInput: any = document.getElementById('collection');
    // if(e.target !== )
    let val = Math.floor(1000 + Math.random() * 9000000);
    console.log(val);
    console.log(e.target);
    console.log(document.activeElement);
    setDisplayCollections(!displayCollections);
  };
  const changeCollectionInput = (e: any) => {
    console.log(e.target.outerText);
    let collectionInput: any = document.getElementById('collection');
    console.log(collectionInput.value);
    collectionInput.value = e.target.outerText;
  };
  let collectionInputElement: any = document.getElementById('collection');
  document.addEventListener('click', (event) => {
    const isClickInside = collectionInputElement.contains(event.target);

    if (!isClickInside) {
      setDisplayCollections(false);
    }
  });
  return (
    <div className="flex justify-center outer-container">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
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
              <HiOutlinePhotograph
                // className="w-full object-cover"
                color="white"
                size={'14rem'}
              />
            </div>
          )}
          <h5
            onClick={handlePhotoChange}
            className="text-white w-full mt-10 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer text-center"
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
                {collectionsOwnedByUser.map((collection: any, index: any) => {
                  console.log(index);
                  console.log(collectionsOwnedByUser.length - 1);
                  if (index !== collectionsOwnedByUser.length - 1) {
                    return (
                      <div
                        className="w-full  p-2 outline-none bg-transparent text-white text-sm border-b border-[#3d4f7c] collection"
                        onClick={(e) => changeCollectionInput(e)}
                      >
                        {collection.name}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="w-full  p-2 outline-none bg-transparent text-white text-sm border-none collection"
                        onClick={(e) => changeCollectionInput(e)}
                      >
                        {collection.name}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </>
        )}

        <Input
          placeholder="Supply"
          name="supply"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <div
          onClick={() => setToggleMenu(true)}
          className=" w-full content-center text-white flex flex-row border-[#3d4f7c]"
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
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer "
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
                                // onClick={() => setToggleMenu(false)}
                              />
                            </td>
                          </tr>
                        ))}

                        {/* <tr>
                        <td>
                          <Input
                            placeholder="External link"
                            name="externalLink"
                            type="text"
                            handleChange={handleChange}
                            value={null}
                          />
                        </td>
                        <td>
                          <Input
                            placeholder="External link"
                            name="externalLink"
                            type="text"
                            handleChange={handleChange}
                            value={null}
                          />
                        </td>
                      </tr> */}
                        {/* <tr>
                        <td>Witchy Woman</td>
                        <td>The Eagles</td>
                      </tr>
                      <tr>
                        <td>Shining Star</td>
                        <td>Earth, Wind, and Fire</td>
                      </tr> */}
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
  );
};
