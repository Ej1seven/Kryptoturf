import { useWeb3 } from '@3rdweb/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { createCollection, getCollection } from '../adapters/marketItems';
import NFTCard from '../components/NFTCard';
import { Navbar } from '../components/Navbar';
import { CgWebsite } from 'react-icons/cg';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { FaEthereum } from 'react-icons/fa';
import { MarketplaceModule } from '@3rdweb/sdk';
import axios from 'axios';

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
  statsContainer: `w-4/5 flex justify-between py-4 border-4 border-white rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-white text-xl w-max-1/4 flex-wrap mt-4`,
};

export const Collection: React.FC<CollectionsProps> = ({}) => {
  const URL = process.env.REACT_APP_PHOTO_API_URL;
  let { id }: any = useParams();
  const { provider } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [listings, setListings]: any = useState([]);
  const [floorPrice, setFloorPrice]: any = useState();
  const [owners, setOwners]: any = useState(0);
  const navigate = useNavigate();
  const [collectionItem, setCollectionItem]: any = useState();

  const nftModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getNFTDrop(id);
  }, [provider]);

  useEffect(() => {
    if (!nftModule) return;
    (async () => {
      const nfts: any = await nftModule.getAll();
      const activeNfts: any = [];
      nfts.map((nft: any) => {
        if (nft.owner !== '0x0000000000000000000000000000000000000000') {
          activeNfts.push(nft);
          console.log(nft);
        }
      });
      setNfts(activeNfts);
      console.log(activeNfts);
    })();
  }, [nftModule]);

  useEffect(() => {
    if (!nfts) return;
    console.log(nfts.length);
    let numberOfNftOwners: any = [];
    let ownersCount: any;
    nfts.map((nft: any) => {
      numberOfNftOwners.push(nft.owner);
    });
    ownersCount = new Set(numberOfNftOwners).size;
    setOwners(ownersCount);
    console.log(ownersCount);
  }, [nfts]);
  console.log(nfts);
  console.log(owners);

  const marketPlaceModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    const contract = sdk.getNFTCollection(
      '0xFB1C5578629F802Ee2393a05ADffc4c665DC3ea8'
    );
    console.log(
      sdk.getMarketplace('0xf82886b727f5a1eC48f1E683072c28C468f62885')
    );
    console.log(contract);
    return sdk.getMarketplace('0xf82886b727f5a1eC48f1E683072c28C468f62885');
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      setListings(await marketPlaceModule.getAllListings());
      await console.log(marketPlaceModule);
    })();
    console.log(listings);
  }, [marketPlaceModule]);

  useEffect(() => {
    if (!listings) return;
    console.log(listings);
    let listingPrices: any = [];
    listings.map((listing: any) => {
      if (listing.assetContractAddress === id) {
        listingPrices.push(
          Number(listing.buyoutCurrencyValuePerToken.displayValue)
        );
      }
    });
    console.log(Math.min(...listingPrices));
    setFloorPrice(Math.min(...listingPrices));
  }, [listings]);

  const handleSubmit = async (e: any) => {
    // await collection(id);
  };

  useEffect(() => {
    (async () => {
      const collection = await getCollection(id);
      await setCollectionItem(collection);
    })();
  }, [id]);

  if (collectionItem) {
    console.log(collectionItem);
  }
  if (listings) {
    console.log(listings);
    listings.map((listing: any) => {
      console.log(listing);
      console.log(listing.tokenId.toNumber());
    });
  }

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          alt="banner"
          src={
            collectionItem?.bannerImage
              ? `${URL}/${collectionItem.bannerImage}`
              : 'https://via.placeholder.com/200'
          }
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collectionItem?.profileImage
                ? `${URL}/${collectionItem.logoImage}`
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          {/* <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collectionItem?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">{collectionItem?.createdBy}</span>
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
                {floorPrice}
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
          <div className={style.description}>{collectionItem?.description}</div>
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
    </div>
  );
};

//https://eth-rinkeby.alchemyapi.io/v2/hKF-ScD-E399jeGhRfiT0VkwkUzeoJ8g
