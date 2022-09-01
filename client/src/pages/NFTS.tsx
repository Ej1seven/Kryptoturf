import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useWeb3 } from '@3rdweb/hooks';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { NFTImage } from '../components/NFTImage';
import { GeneralDetails } from '../components/GeneralDetails';
import { ItemActivity } from '../components/ItemActivity';
import { Purchase } from '../components/Purchase';
import { useSearchParams } from 'react-router-dom';
import { FaDollarSign } from 'react-icons/fa';
import { IoIosTimer } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
    className="mt-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

export const NFTS: React.FC<NFTSProps> = ({}) => {
  let { id }: any = useParams();
  console.log(id);
  const [searchParams]: any = useSearchParams();
  const { provider } = useWeb3();
  const [selectedNft, setSelectedNft]: any = useState();
  const [listings, setListings] = useState([]);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [eth, setEth]: any = useState();
  const [ethToUsd, setEthToUsd]: any = useState(0);
  const [buyoutPricePerToken, setBuyoutPricePerToken] = useState();
  const [calendar, setCalendar] = useState(format(new Date(), 'MM/dd/yyyy'));
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange]: any = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);
  const [customDateRange, setCustomDateRange] = useState(false);
  const [toggleDuration, setToggleDuration] = useState(false);
  const [duration, setDuration] = useState('1 month');
  const [customDuration, setCustomDuration] = useState();
  const [days, setDays]: any = useState(0);
  const navigate = useNavigate();
  console.log(searchParams.get('isListed'));
  console.log(searchParams.get('collection'));

  const enableToggleMenu = () => {
    setToggleMenu(true);
  };
  const nftModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getNFTDrop(searchParams.get('collection'));
  }, [provider]);

  useEffect(() => {
    if (!nftModule) return;
    (async () => {
      const nfts = await nftModule.getAll();
      const eth = await ethPrice('usd');
      const editedEth = await Number(eth[0].replace('USD: ', ''));
      console.log(editedEth);

      console.log(nfts);
      nfts.map((nft) => {
        console.log(nft.metadata.id.toNumber());
      });
      const selectedNftItem: any = nfts.find(
        (nft) => nft.metadata.id.toNumber() == id
      );
      console.log(selectedNftItem);
      setSelectedNft(selectedNftItem);
      setEth(editedEth);
      console.log(id);
    })();
  }, [nftModule]);

  const marketPlaceModule: any = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());

    return sdk.getMarketplace('0x06f2DcAc14A483d2854Ee36D163B2d32bE2d8543');
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      setListings(await marketPlaceModule.getAllListings());
      console.log(listings);
    })();
  }, [marketPlaceModule]);

  const handleChange = (e: any, name: any) => {
    e.preventDefault();
    console.log(e.target.value);
    setBuyoutPricePerToken(e.target.value);
    if (name === 'buyout_price_per_token') {
      console.log(Number((e.target.value * eth).toFixed(3)));
      setEthToUsd(Number((e.target.value * eth).toFixed(3)));
    }
  };
  const handleCalendar = (date: any) => {
    console.log(format(date, 'MM/dd/yyyy'));
    setCalendar(format(date, 'MM/dd/yyyy'));
  };
  useEffect(() => {
    console.log('start date:', range[0].startDate);
    console.log('end date:', range[0].endDate);
    let seconds: any = Math.abs(range[0].startDate - range[0].endDate) / 1000;
    console.log(seconds);
    setCustomDuration(seconds);
    console.log(seconds / 86400);
    setDays(seconds / 86400);
  }, [range]);
  useEffect(() => {
    if (customDateRange) {
      setToggleDuration(false);
      setDuration('Custom Duration');
    } else {
      setDuration('1 month');
    }
  }, [customDateRange]);
  useEffect(() => {
    // if (customDateRange) {
    //   setToggleDuration(false);
    //   setDuration('Custom Duration');
    // } else {
    //   setDuration('1 month');
    // }
  }, [toggleDuration]);
  useEffect(() => {
    setToggleDuration(false);
  }, [duration]);

  const buyItem: any = async () => {
    let listingDurationInSeconds: any;

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
    console.log(listing);
    const tx = await marketPlaceModule.direct.createListing(listing);
    const receipt = await tx.receipt; // the transaction receipt
    const listingId = await tx.id; // the id of the newly created listing
    console.log(receipt);
    console.log(listingId);
  };
  console.log(eth);
  return (
    <div>
      <Navbar />
      <div className={style.wrapper}>
        {!toggleMenu ? (
          <div className={style.container}>
            <div className={style.topContent}>
              <div className={style.nftImgContainer}>
                <NFTImage selectedNft={selectedNft} />
              </div>
              <div className={style.detailsContainer}>
                <GeneralDetails selectedNft={selectedNft} />
                <Purchase
                  isListed={searchParams.get('isListed')}
                  selectedNft={selectedNft}
                  listings={listings}
                  marketPlaceModule={marketPlaceModule}
                  collection={searchParams.get('collection')}
                  enableToggleMenu={enableToggleMenu}
                />
              </div>
            </div>
            <ItemActivity />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
              <p className="text-white text-3xl text-left w-full pb-8 text-center">
                List item for sale
              </p>
              <div className="flex flex-row w-full border-4 border-[#3d4f7c] rounded-md text-white h-20 text-center">
                <div className="w-1/2 flex flex-col border-r-4 border-[#3d4f7c] cursor-pointer justify-center items-center">
                  <div className="w-full">
                    <FaDollarSign className="m-auto" />
                  </div>
                  <div className="w-full ">
                    <p>Fixed Price</p>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col	cursor-pointer justify-center items-center">
                  <div className="w-full ">
                    <IoIosTimer className="m-auto" />
                  </div>
                  <div className="w-full ">
                    <p> Timed Auction</p>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <div className="flex flex-row w-full items-center">
                  <div className="w-1/3 flex flex-row mt-2 p-2 items-center border-2 border-[#3d4f7c] rounded-md ">
                    <FaEthereum className="mr-4" />
                    ETH
                  </div>
                  <div className="w-2/3 ml-2">
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
                    customDateRange ? 'cursor-not-allowed bg-[#3d4f7c] ' : ''
                  }text-left border-2 border-[#3d4f7c] rounded-md text-white w-full mt-2 p-2 flex flex-row items-center
                  `}
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
                          className="px-5 py-3 hover:bg-amber-300 border-[#3d4f7c] text-white border-2"
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
                          className="px-5 py-3 hover:bg-amber-300 border-[#3d4f7c] text-white border-2"
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
                          className="px-5 py-3 hover:bg-amber-300 border-[#3d4f7c] text-white border-2 "
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
                          className="px-5 py-3 hover:bg-amber-300 border-[#3d4f7c] text-white border-2 "
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
                    name="buyout_price_per_token"
                    type="text"
                    handleChange={handleChange}
                    value={null}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full mt-2 items-center">
                <button
                  className="text-white w-1/2  mr-1 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer "
                  onClick={buyItem}
                >
                  List
                </button>
                <button
                  className="text-white w-1/2  ml-1 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                  onClick={() => setToggleMenu(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
