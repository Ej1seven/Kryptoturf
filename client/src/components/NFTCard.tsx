import React, { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const style = {
  wrapper: `bg-[#303339] flex-auto w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
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

const NFTCard = ({ nftItem, title, listings }: any) => {
  console.log(nftItem);
  console.log(nftItem.metadata.id.toNumber());
  const navigate = useNavigate();
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const listing = listings.find(
      (listing: any) =>
        listing.asset.id.toNumber() === nftItem.metadata.id.toNumber()
    );
    if (Boolean(listing)) {
      // console.log(listing);
      setIsListed(true);
      setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
    }
  }, [listings, nftItem]);
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        navigate({
          pathname: `/nfts/${nftItem.metadata.id}`,
          search: `?isListed=${isListed}`,
        });
      }}
    >
      <div className={style.imgContainer}>
        <img
          src={nftItem.metadata.image}
          alt={nftItem.metadata.name}
          className={style.nftImg}
        />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{nftItem.metadata.name}</div>
          </div>
          {isListed && (
            <div className={style.infoRight}>
              <div className={style.priceTag}></div>
              <div className={style.priceValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {price}
              </div>
            </div>
          )}
        </div>
        <div className={style.likes}>
          <span className={style.likeIcon}>
            <BiHeart />
          </span>
          {nftItem.likes}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
