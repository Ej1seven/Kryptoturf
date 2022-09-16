import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import {
  addLike,
  getLikes,
  getCollection,
  deleteLike,
} from '../adapters/marketItems';
import { getUserData, me } from '../adapters/user';
import { useQuery } from 'react-query';

const style = {
  wrapper: `bg-white flex-auto w-[18rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-black drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-black`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-black`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-black font-bold flex items-center w-full justify-end mt-3 relative -top-[80px] right-[30px]`,
  likeIcon: `text-xl mr-2 text-black text-bold`,
};

const NFTCard = ({
  nftItem,
  title,
  listings,
  collectionContractAddress,
}: any) => {
  console.log(title);
  console.log(nftItem);
  console.log(nftItem.metadata.id.toNumber());
  console.log(listings);
  console.log(collectionContractAddress);
  const navigate = useNavigate();
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState(0);
  const [collection, setCollection]: any = useState();
  const params = { isListed: `${isListed}`, collection: `${collection}` };
  const { data, isError, refetch } = useQuery('me', me);
  const [userData, setUserData]: any = useState([]);
  const [toggleLikeButton, setToggleLikeButton]: any = useState(false);
  const [likeId, setLikeId]: any = useState();

  useEffect(() => {
    (async () => {
      await me();
      // listings.map((listing: any) => {
      //   console.log(listing.asset.id.toNumber());
      // });
    })();
  }, []);
  useEffect(() => {
    (async () => {
      console.log(data);
      setUserData(await getUserData(data.email));
    })();
  }, [data]);
  useEffect(() => {
    (async () => {
      console.log(userData);
      console.log(nftItem.metadata.name);
      await userData.likes.forEach((like: any) => {
        console.log(like.nftName);
        if (like.nftName === nftItem.metadata.name) {
          setToggleLikeButton(true);
          console.log('match');
          setLikeId(Number(like.id));
        }
      });
    })();
  }, [userData]);
  console.log(userData);
  useEffect(() => {
    const listing = listings.find(
      (listing: any) =>
        listing.asset.id.toNumber() === nftItem.metadata.id.toNumber() &&
        collectionContractAddress === listing.assetContractAddress
    );
    if (Boolean(listing)) {
      // console.log(listing);
      setIsListed(true);
      setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
    }
    collectionContractAddress
      ? setCollection(collectionContractAddress)
      : setCollection(false);
    listings.map((listing: any) => {
      console.log(listing.asset.name);
      console.log(Number(listing.asset.id.toNumber()));
    });
  }, [listings, nftItem, collectionContractAddress]);
  const like = async () => {
    console.log(likeId);
    await me();
    const likeData = {
      collectionContractAddress: collectionContractAddress,
      tokenId: nftItem.metadata.id.toNumber(),
      nftName: nftItem.metadata.name,
      email: data.email,
    };
    if (toggleLikeButton) {
      await deleteLike(likeId);
    } else {
      await addLike(likeData);
    }
    await setToggleLikeButton(!toggleLikeButton);
    setUserData(await getUserData(data.email));
    // await addLike(likeData);
    // getLikes(collectionContractAddress);
    // getCollection(collectionContractAddress);
    // setUserData(await getUserData(data.email));
    console.log('like button clicked');
  };
  return (
    <div>
      <div
        className={style.wrapper}
        onClick={() => {
          navigate({
            pathname: `/nfts/${nftItem.metadata.id}`,
            search: `?${createSearchParams(params)}`,
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
                  <FaEthereum className={style.ethLogo} />
                  {price}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.likes}>
        <span className={style.likeIcon}>
          {!toggleLikeButton ? (
            <FaRegHeart onClick={like} />
          ) : (
            <FaHeart onClick={like} />
          )}
        </span>
        {nftItem.likes}
      </div>
    </div>
  );
};

export default NFTCard;
