import { useWeb3 } from '@3rdweb/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { collection, collectionItem } from '../adapters/marketItems';
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
  statsContainer: `w-4/5 flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

export const Collection: React.FC<CollectionsProps> = ({}) => {
  let { id }: any = useParams();
  const { provider } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [listings, setListings]: any = useState([]);
  const navigate = useNavigate();

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
        }
      });
      setNfts(activeNfts);
      console.log(activeNfts);
    })();
  }, [nftModule]);

  const marketPlaceModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    console.log(
      sdk.getMarketplace('0x06f2DcAc14A483d2854Ee36D163B2d32bE2d8543')
    );
    return sdk.getMarketplace('0x06f2DcAc14A483d2854Ee36D163B2d32bE2d8543');
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      setListings(await marketPlaceModule.getActiveListings());
      await console.log(marketPlaceModule);
    })();
  }, [marketPlaceModule]);

  const handleSubmit = async (e: any) => {
    await collection(id);
  };

  useEffect(() => {
    console.log(collectionItem);
    collection(id);
  }, [id]);

  if (collectionItem) {
    console.log(collectionItem);
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
              ? collectionItem.bannerImage
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
                ? collectionItem.profileImage
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
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
          </div>
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
              <div className={style.statValue}>
                {collectionItem?.owners ? collectionItem.owners.length : ''}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <FaEthereum className={style.ethLogo} />
                {collectionItem?.floorPrice}
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
      <div className="flex flex-wrap">
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collectionItem?.title}
            listings={listings}
          />
        ))}
      </div>
    </div>
  );
};

//https://eth-rinkeby.alchemyapi.io/v2/hKF-ScD-E399jeGhRfiT0VkwkUzeoJ8g
