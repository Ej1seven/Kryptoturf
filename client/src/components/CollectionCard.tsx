import React, { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import { MdPhotoSizeSelectLarge } from 'react-icons/md';

const style = {
  wrapper: ` flex-auto w-[18rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-full w-full overflow-hidden flex justify-center items-center relative`,
  nftImg: `w-full h-full object-cover`,
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

const CollectionCard = ({ nftItem, title, listings }: any) => {
  console.log(nftItem);
  // console.log(nftItem.metadata.id.toNumber());
  const navigate = useNavigate();
  // const [isListed, setIsListed] = useState(false);
  // const [price, setPrice] = useState(0);

  // useEffect(() => {
  //   const listing = listings.find(
  //     (listing: any) =>
  //       listing.asset.id.toNumber() === nftItem.metadata.id.toNumber()
  //   );
  //   if (Boolean(listing)) {
  //     // console.log(listing);
  //     setIsListed(true);
  //     setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
  //   }
  // }, [listings, nftItem]);
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        navigate(`/collection/${nftItem.contractAddress}`);
      }}
    >
      <div className={style.imgContainer}>
        {nftItem?.profileImage ? (
          <>
            {' '}
            <img
              src={`http://localhost:3001/uploads/${nftItem.profileImage}`}
              alt="image"
              className={style.nftImg}
            />
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-black border-2 border-white">
            <MdPhotoSizeSelectLarge
              className="h-20
             w-20 m-auto text-white"
            />
          </div>
        )}

        <div className="w-[18rem] h-[22rem] object-cover bg-black	collection-card absolute rounded-2xl" />
        {/* <img
          src={`http://localhost:3001/uploads/${nftItem.logoImage}`}
          alt="image"
          className={style.nftImg}
        /> */}
        <div className="w-[18rem] overflow-hidden h-20 absolute bottom-0 flex items-center z-[100]">
          <div className="h-9 w-9 rounded-full overflow-hidden mx-5">
            {nftItem?.logoImage ? (
              <>
                {' '}
                <img
                  src={`http://localhost:3001/uploads/${nftItem.logoImage}`}
                  alt="image"
                  className={style.nftImg}
                />
              </>
            ) : (
              <div className="w-full h-full object-cover text-black text-center bg-white flex justify-center items-center">
                <p>{nftItem?.title.charAt(0).toUpperCase()}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-base text-white font-bold">{nftItem.title}</p>
          </div>
        </div>
      </div>

      {/* <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}> */}
      {/* <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{nftItem.metadata.name}</div> */}
      {/* </div> */}
      {/* {isListed && (
            <div className={style.infoRight}>
              <div className={style.priceTag}></div>
              <div className={style.priceValue}>
                <FaEthereum className={style.ethLogo} />
                {price}
              </div>
            </div>
          )} */}
      {/* </div> */}
      {/* <div className={style.likes}>
          <span className={style.likeIcon}>
            <BiHeart />
          </span>
          {nftItem.likes}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default CollectionCard;
