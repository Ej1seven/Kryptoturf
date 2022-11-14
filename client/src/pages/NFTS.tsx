import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useWeb3 } from '@3rdweb/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { NFTImage } from '../components/NFTImage';
import { GeneralDetails } from '../components/GeneralDetails';
import { ItemActivity } from '../components/ItemActivity';
import { Purchase } from '../components/Purchase';
import { useSearchParams } from 'react-router-dom';
import { FaDollarSign } from 'react-icons/fa';
import { FaEthereum } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addTransaction, getCollection } from '../adapters/marketItems';
import { Attributes } from '../components/Attributes';
import { me } from '../adapters/user';
import { useQuery } from 'react-query';
import { Loader } from '../components';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
interface NFTSProps {}

const ethPrice = require('eth-price');

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
    className="mt-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer"
  />
);

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `sm:container exSMMAX:p-2 p-6`,
  topContent: `flex flex-col sm:flex-row `,
  nftImgContainer: `w-full sm:w-auto flex-1 mr-4`,
  detailsContainer: `order-first sm:order-none flex-[2] ml-4`,
  attributesContainer: `h-[400px] w-full my-2`,
};

export const NFTS: React.FC<NFTSProps> = ({}) => {
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*Display a spinning loading icon when the collection data is being sent to the blockchain and database*/
  const [isLoading, setIsLoading] = useState(false);
  /*Gets the NFT token id in the URL using useParams() then sets it to the id object */
  let { id }: any = useParams();
  /*Gets the search params in the URL using useSearchParams(). The two search params are isListed and collection contract address*/
  const [searchParams]: any = useSearchParams();
  /*A Provider is an abstraction of a connection to the Ethereum network, providing a concise,
   consistent interface to standard Ethereum node functionality.*/
  const { provider } = useWeb3();
  /* Gets the data of the selectedNFT by matching the NFT token id to the metadata pulled from Thirdweb*/
  const [selectedNft, setSelectedNft]: any = useState();
  /*Retrieves all the listed NFTs on the marketplace */
  const [listings, setListings] = useState([]);
  /*Toggles between the NFT details page and the List Item For Sale page */
  const [toggleMenu, setToggleMenu] = useState(false);
  /*Sets Ethereum value that will be used when listing an NFT for sale */
  const [eth, setEth]: any = useState();
  /*Converts the Ethereum value to US dollars */
  const [ethToUsd, setEthToUsd]: any = useState(0);
  /*Gets the current market price per Ethereum token */
  const [buyoutPricePerToken, setBuyoutPricePerToken] = useState();
  /*Set the calendars dates when deciding the listing duration */
  const [calendar, setCalendar] = useState(format(new Date(), 'MM/dd/yyyy'));
  /*Toggles the calendar used when setting up listing duration */
  const [showCalendar, setShowCalendar] = useState(false);
  /*Sets the range of dates the user desires to list their NFT  */
  const [range, setRange]: any = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);
  /*Sets a custom range of dates the user desires to list their NFT */
  const [customDateRange, setCustomDateRange] = useState(false);
  /*Toggles the duration drop down menu */
  const [toggleDuration, setToggleDuration] = useState(false);
  /*Sets the duration the user wants to list their NFT */
  const [duration, setDuration] = useState('1 month');
  /*Sets custom duration the user desires to list their NFT */
  const [customDuration, setCustomDuration] = useState();
  /*The the amount of day the user desires to list their NFT */
  const [days, setDays]: any = useState(0);
  /*Gets the creator royalty fee from Thirdweb */
  const [nftRoyaltyDetails, setNftRoyaltyDetails]: any = useState();
  const { data } = useQuery('me', me);
  /*Allows the user to view the calendar and custom duration options when listing their NFT */
  const enableToggleMenu = () => {
    if (!data?.id) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must first login to list a NFT`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    if (data?.walletAddress !== selectedNft.owner) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must own the NFT to list it on the marketplace`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    setToggleMenu(true);
  };
  /*Retrieves the marketplace data from ThirdwebSDK */
  const marketPlaceModule: any = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getMarketplace('0x3d121d397dF89B6F293dc360403E9c902bAe4367');
  }, [provider]);
  /*Retrieves all the NFTs on the marketplace from Thirdweb*/
  const nftModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getNFTDrop(searchParams.get('collection'));
  }, [provider]);
  /*Is the purchase is successful a toast will popup informing the user */
  const confirmList = (toastHandler = toast) =>
    toastHandler.success(`List successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });
  /*Retrieves the user data*/
  useEffect(() => {
    (async () => {
      await me();
    })();
  });
  useEffect(() => {
    if (!nftModule) return;
    (async () => {
      /*Retrieves all the collections */
      const nfts = await nftModule.getAll();
      /*Set the Ethereum price to US dollars */
      const eth = await ethPrice('usd');
      /*Edits the converted Ethereum price so it can be displayed on the list item page */
      const editedEth = await Number(eth[0].replace('USD: ', ''));
      /*Gets the selected NFT data by comparing the token Id to the metadata retrieved from ThirdWeb */
      const selectedNftItem: any = nfts.find(
        (nft) => nft.metadata.id.toNumber() == id
      );
      setSelectedNft(selectedNftItem);
      setEth(editedEth);
    })();
  }, [nftModule]);
  /*Once the marketplace data is pulled from Thirdweb, the following useEffect hook retrieves
   all listings on the marketplace from ThirdWeb */
  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      setListings(await marketPlaceModule.getAllListings());
      /*Sets a gas limit on all transaction to 5000000 gwei */
      await marketPlaceModule.interceptor.overrideNextTransaction(() => ({
        gasLimit: 5000000,
      }));
      const contract = marketPlaceModule?.getNFTCollection(
        searchParams.get('collection')
      );
      (async () => {
        const royaltyFee: any = await contract?.royalties.getTokenRoyaltyInfo(
          id
        );
        setNftRoyaltyDetails(royaltyFee.seller_fee_basis_points / 100);
      })();
    })();
  }, [marketPlaceModule]);
  /*Sets the coverted value of Ethereum to USD or sets the remaining values on the List Item form*/
  const handleChange = (e: any, name: any) => {
    e.preventDefault();
    setBuyoutPricePerToken(e.target.value);
    if (name === 'buyout_price_per_token') {
      setEthToUsd(Number((e.target.value * eth).toFixed(3)));
    }
  };
  /*Gets the total amount seconds between date ranges the converts the value to days */
  useEffect(() => {
    let seconds: any = Math.abs(range[0].startDate - range[0].endDate) / 1000;
    setCustomDuration(seconds);
    setDays(seconds / 86400);
  }, [range]);
  /*If the user set custom duration set the duration to the selected value otherwise
    auto set the duration to 1 month */
  useEffect(() => {
    if (customDateRange) {
      setToggleDuration(false);
      setDuration('Custom Duration');
    } else {
      setDuration('1 month');
    }
  }, [customDateRange]);
  /*toggle the duration menu */
  useEffect(() => {
    setToggleDuration(false);
  }, [duration]);

  const listItem: any = async () => {
    let error: any = null;
    setIsLoading(true);
    let listingDurationInSeconds: any;
    /*Sets the listing duration to seconds*/
    if (duration === 'Custom Duration') {
      listingDurationInSeconds = customDuration;
    } else if (duration === '1 month') {
      listingDurationInSeconds = 30 * 86400;
    } else if (duration === '3 months') {
      listingDurationInSeconds = 90 * 86400;
    } else if (duration === '6 months') {
      listingDurationInSeconds = 180 * 86400;
    } else if (duration === '1 year') {
      listingDurationInSeconds = 360 * 86400;
    }
    const listing = {
      // address of the contract the asset you want to list is on
      assetContractAddress: await searchParams.get('collection'),
      // token ID of the asset you want to list
      tokenId: id,
      // when should the listing open up for offers
      startTimestamp: new Date(),
      // how long the listing will be open for
      listingDurationInSeconds: listingDurationInSeconds,
      // how many of the asset you want to list
      quantity: 1,
      // address of the currency contract that will be used to pay for the listing
      currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      // how much the asset will be sold for
      buyoutPricePerToken: buyoutPricePerToken,
    };
    /*Lists the NFT on the the marketplace */
    const tx = await marketPlaceModule.direct
      .createListing(listing)
      .catch((err: any) => {
        error = err;
      });
    /*If an error occurs while listing the NFT on the marketplace return a error message modal. */
    if (error) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.message}`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    const receipt = await tx.receipt; // the transaction receipt
    const listingId = await tx.id; // the id of the newly created listing
    /*Get the transaction data from the reciept returned from the blockchain and saves that data to database. */
    const transactionData: any = await {
      collectionContractAddress: searchParams.get('collection'),
      tokenId: Number(id),
      event: receipt.events[0].event,
      price: Number(buyoutPricePerToken),
      from: receipt.from,
      to: receipt.to,
      blockNumber: Number(receipt.blockNumber),
      txHash: receipt.transactionHash,
    };
    /*Adds the transaction data to the database */
    await addTransaction(transactionData);
    setIsLoading(false);
    Swal.fire({
      icon: 'success',
      title: 'Congrats!',
      text: `${selectedNft?.metadata.name} has successfully been listed on the Kryptoturf Marketplace!`,
      background: '#19191a',
      color: '#fff',
      confirmButtonColor: '#2952e3',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmList();
        navigate(`/collection/${searchParams.get('collection')}`);
      }
    });
  };
  return (
    <div className="overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      {!isLoading && <Navbar />}
      <div className={style.wrapper}>
        {!toggleMenu ? (
          <div className={style.container}>
            <div className={style.topContent}>
              <div className={style.nftImgContainer}>
                <NFTImage
                  selectedNft={selectedNft}
                  collectionContractAddress={searchParams.get('collection')}
                />
              </div>
              <div className={style.detailsContainer}>
                <GeneralDetails
                  collectionContractAddress={searchParams.get('collection')}
                  selectedNft={selectedNft}
                />
                <Purchase
                  isListed={searchParams.get('isListed')}
                  selectedNft={selectedNft}
                  listings={listings}
                  marketPlaceModule={marketPlaceModule}
                  collection={searchParams.get('collection')}
                  enableToggleMenu={enableToggleMenu}
                  id={id}
                  user={data}
                />
              </div>
            </div>
            <div className={style.attributesContainer}>
              <Attributes
                selectedNft={selectedNft}
                collectionContractAddress={searchParams.get('collection')}
                id={id}
                nftRoyaltyDetails={nftRoyaltyDetails}
              />
            </div>
            <ItemActivity
              collectionContractAddress={searchParams.get('collection')}
              id={id}
            />
          </div>
        ) : (
          <div
            className={`${
              !customDateRange ? 'h-screen' : ''
            } w-screen flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="h-screen w-screen flex flex-col items-center justify-center">
                <Loader />
                <p className="text-white text-1xl text-center">
                  Please wait...
                </p>
                <p className="text-white text-1xl text-center">
                  The task is being executed. May take up to 3 minutes until it
                  is completed.
                </p>
              </div>
            ) : (
              <>
                <div className="p-5 sm:w-3/4 max-w-4xl w-full flex flex-col justify-start items-center blue-glassmorphism">
                  <p className="text-white text-3xl text-left w-full pb-8 text-center">
                    List item for sale
                  </p>
                  <div className="flex flex-row items-center justify-center w-full border-4 border-[#3d4f7c] rounded-md text-white h-20 text-center">
                    <div className="flex flex-row mx-auto">
                      <FaDollarSign className="mt-1" />
                      <p>Fixed Price</p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col">
                    <div className="flex flex-row w-full items-center">
                      <div className="w-1/3 max-w-[10rem] flex flex-row mt-2 p-2 items-center border-2 border-[#3d4f7c] rounded-md ">
                        <FaEthereum className="mr-4" />
                        ETH
                      </div>
                      <div className="w-2/3 max-w-[15rem] ml-2">
                        <Input
                          placeholder="Buyout Price Per Token"
                          name="buyout_price_per_token"
                          type="number"
                          handleChange={handleChange}
                          value={null}
                        />
                      </div>
                    </div>
                    <div className="w-full text-right">
                      <p>${ethToUsd.toLocaleString('en-US')} USD</p>
                    </div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="w-1/2 text-left">
                      <p>Duration</p>
                    </div>
                    <div className="w-1/2 flex flex-row justify-end">
                      <div>
                        <p>Custom</p>
                      </div>
                      <div className="flex">
                        <label className="inline-flex relative items-center ml-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={customDateRange}
                            readOnly
                          />
                          <div
                            onClick={() => {
                              setCustomDateRange(!customDateRange);
                            }}
                            className="w-11 h-6 bg-[#3d4f7c] rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3d4f7c]"
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div id="dropdown-wrapper" className="inline-block w-full">
                    <button
                      onClick={() => setToggleDuration(!toggleDuration)}
                      className={` ${
                        customDateRange
                          ? 'cursor-not-allowed bg-[#3d4f7c] '
                          : ''
                      }text-left border-2 border-[#3d4f7c] rounded-md text-white w-full mt-2 p-2 flex flex-row items-center`}
                      disabled={customDateRange}
                    >
                      <BsCalendar3 className="mr-2" />
                      {duration}
                    </button>
                    {toggleDuration && (
                      <div className=" flex flex-col">
                        {duration !== '1 month' && (
                          <>
                            {' '}
                            <p
                              className="px-5 py-3 hover:bg-white/50 border-[#3d4f7c] text-white border-2"
                              onClick={() => {
                                setDuration('1 month');
                              }}
                            >
                              1 month
                            </p>
                          </>
                        )}
                        {duration !== '3 months' && (
                          <>
                            {' '}
                            <p
                              className="px-5 py-3 hover:bg-white/50 border-[#3d4f7c] text-white border-2"
                              onClick={() => {
                                setDuration('3 months');
                              }}
                            >
                              3 months
                            </p>
                          </>
                        )}
                        {duration !== '6 months' && (
                          <>
                            {' '}
                            <p
                              className="px-5 py-3 hover:bg-white/50 border-[#3d4f7c] text-white border-2 "
                              onClick={() => {
                                setDuration('6 months');
                              }}
                            >
                              6 months
                            </p>
                          </>
                        )}
                        {duration !== '1 year' && (
                          <>
                            {' '}
                            <p
                              className="px-5 py-3 hover:bg-white/50 border-[#3d4f7c] text-white border-2 "
                              onClick={() => {
                                setDuration('1 year');
                              }}
                            >
                              1 year
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {customDateRange && (
                    <>
                      {' '}
                      <input
                        value={`${format(
                          range[0].startDate,
                          'MM/dd/yyyy'
                        )} to ${format(range[0].endDate, 'MM/dd/yyyy')}`}
                        readOnly
                        className="text-white my-2 bg-transparent w-full text-center"
                        onClick={() => setShowCalendar(!showCalendar)}
                      />
                      <p className="mb-1">Days: {days}</p>
                      <div className="inline-block relative">
                        <DateRange
                          date={new Date()}
                          className=" 	border-2 border-[#3d4f7c] "
                          onChange={(item) => setRange([item.selection])}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          direction="vertical"
                          months={2}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-row w-full mt-2 items-center">
                    <button
                      className="text-white w-1/2  mr-1 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-white/50"
                      onClick={listItem}
                    >
                      List
                    </button>
                    <button
                      className="text-white w-1/2  ml-1 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-white/50"
                      onClick={() => setToggleMenu(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
