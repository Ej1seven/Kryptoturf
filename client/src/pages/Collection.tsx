import { useWeb3 } from '@3rdweb/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { getCollection } from '../adapters/marketItems';
import NFTCard from '../components/NFTCard';
import { Navbar } from '../components/Navbar';
import { FaEthereum } from 'react-icons/fa';
import { roundUpToHundreths } from '../utils/roundUpToHundreths';
import { Loader } from '../components';
import useMarkeplaceData from '../hooks/useMarketplaceData';
import defaultBannerImage from '../../src/images/default-banner.jpg';
import defaultLogoImage from '../../src/images/default-profile.jpg';
import { MdPhotoSizeSelectLarge } from 'react-icons/md';

interface CollectionsProps {}

const style = {
  bannerImageContainer: `h-[300px] w-11/12 overflow-hidden flex justify-center items-center rounded-md mx-auto mt-4`,
  bannerImage: `w-full h-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `exSMMAX:text-3xl text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-4/5 flex justify-between py-4 border-4 border-white rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `smMAX:text-2xl text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-white text-xl md:w-4/5 flex-wrap mt-4`,
};

export const Collection: React.FC<CollectionsProps> = ({}) => {
  /*URL path to pull collection photos from the database */
  const URL = process.env.REACT_APP_PHOTO_API_URL;
  /*id = (collection contract address) found in URL parameter */
  let { id }: any = useParams();
  const { listings, marketPlaceModule, nftModule } = useMarkeplaceData(id);
  /*Pulls all the NFTs for this collection */
  const [nfts, setNfts] = useState([]);
  /*Sets the floor price by finding the NFT listed for the lowest amount of ETH on the market */
  const [floorPrice, setFloorPrice]: any = useState();
  /*Retrieves all the owners of NFTS under the selected collection */
  const [owners, setOwners]: any = useState(0);
  /*Retrieves the selected collection from the database */
  const [collectionItem, setCollectionItem]: any = useState();
  /*Display a spinning loading icon when data is loaded*/
  const [isLoading, setIsLoading] = useState(true);
  /*Retrieves all the NFTs from the selected collection and maps through them only returning the NFTs that have a owner.
    This is meant to filter out the NFTs that have been deleted */
  useEffect(() => {
    if (!nftModule) return;
    (async () => {
      const nfts: any = await nftModule.getAll();
      const activeNfts: any = [];
      nfts.map((nft: any) => {
        if (nft.owner !== '0x0000000000000000000000000000000000000000') {
          activeNfts.push(nft);
        }
      });
      setNfts(activeNfts);
    })();
  }, [nftModule]);
  /*Maps through all the NFTs from the selected collection and adds up the total 
    number of different owners*/
  useEffect(() => {
    if (!nfts) return;
    let numberOfNftOwners: any = [];
    let ownersCount: any;
    nfts.map((nft: any) => {
      numberOfNftOwners.push(nft.owner);
    });
    ownersCount = new Set(numberOfNftOwners).size;
    setOwners(ownersCount);
  }, [nfts]);
  /** Retrieves the listing prices for all the NFT listed under the selected collection */
  useEffect(() => {
    if (!listings) return;
    let listingPrices: any = [];
    listings.map((listing: any) => {
      if (listing.assetContractAddress === id) {
        listingPrices.push(
          Number(listing.buyoutCurrencyValuePerToken.displayValue)
        );
      }
    });
    setFloorPrice(Math.min(...listingPrices));
    setIsLoading(false);
  }, [listings]);
  /*Retrieves the collection data from the database */
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const collection = await getCollection(id);
      await setCollectionItem(collection);
    })();
  }, [id]);
  return (
    <div className="overflow-hidden">
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className={style.bannerImageContainer}>
            {collectionItem?.bannerImage ? (
              <>
                <img
                  className={style.bannerImage}
                  alt="banner"
                  src={
                    collectionItem?.bannerImage
                      ? `${collectionItem.bannerImage}`
                      : `${defaultBannerImage}`
                  }
                />
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center bg-black border-2 border white">
                <MdPhotoSizeSelectLarge className="h-20 w-20 m-auto text-white" />
              </div>
            )}
          </div>
          <div className={style.infoContainer}>
            <div className={style.midRow}>
              {collectionItem?.profileImage ? (
                <>
                  <img
                    className={style.profileImg}
                    src={
                      collectionItem?.profileImage
                        ? `${collectionItem.logoImage}`
                        : `${defaultLogoImage}`
                    }
                    alt="profile image"
                  />
                </>
              ) : (
                <div className="w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem] flex justify-center items-center bg-white">
                  <p className="text-black text-4xl">
                    {collectionItem?.title.charAt(0).toUpperCase()}
                  </p>
                </div>
              )}
            </div>
            <div className={style.endRow}></div>
            <div className={style.midRow}>
              <div className={style.title}>{collectionItem?.title}</div>
            </div>
            <div className={style.midRow}>
              <div className={style.createdBy}>
                Created by{' '}
                <span className="text-[#2081e2]">
                  {collectionItem?.createdBy}
                </span>
              </div>
            </div>
            <div className={style.midRow}>
              <div className={style.statsContainer}>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>{nfts.length}</div>
                  <div className={style.statName}>items</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>{owners}</div>
                  <div className={style.statName}>owners</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    <FaEthereum className={style.ethLogo} />
                    {floorPrice === (Infinity || NaN)
                      ? 0
                      : roundUpToHundreths(floorPrice)}
                  </div>
                  <div className={style.statName}>floor price</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    <FaEthereum className={style.ethLogo} />
                    {collectionItem?.volumeTraded}
                  </div>
                  <div className={style.statName}>volume traded</div>
                </div>
              </div>
            </div>
            <div className={style.midRow}>
              <div className={style.description}>
                {collectionItem?.description}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
              {nfts.map((nftItem, id) => (
                <NFTCard
                  key={id}
                  nftItem={nftItem}
                  title={collectionItem?.title}
                  listings={listings}
                  collectionContractAddress={collectionItem.contractAddress}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
