import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import { addLike, deleteLike } from '../adapters/marketItems';
import { getUserData, me } from '../adapters/user';
import { useQuery } from 'react-query';

const style = {
  wrapper: `bg-white flex-auto w-[18rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointe btn-glow`,
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
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*Determines if the NFT is listed on the marketplace. If so, the listing price will display on the NFT card. */
  const [isListed, setIsListed] = useState(false);
  /*Display the listing price for the NFT */
  const [price, setPrice] = useState(0);
  /*the collectionContractAddress passed down from the parent variable will be stored in the collection variable. */
  const [collection, setCollection]: any = useState();
  /*Sets the params for the url that will navigate the user to the nft details page. 
    EX: /nfts/0?isListed=true&collection=0xaa399341fb5d9D765F863b1222c5837839820851 */
  const params = { isListed: `${isListed}`, collection: `${collection}` };
  /*me query checks if the user is logged in.*/
  const { data } = useQuery('me', me);
  /*Stores the user data retrieved from the server through the getUserData() request. */
  const [userData, setUserData]: any = useState([]);
  /*Sets the like button to true or false */
  const [toggleLikeButton, setToggleLikeButton]: any = useState(false);
  /*The likeId is used to determine if the current user previously liked the NFT. */
  const [likeId, setLikeId]: any = useState();
  /*This useEffect() is used to determine if the user is logged in. */
  useEffect(() => {
    (async () => {
      await me();
    })();
  }, []);
  /*If the user is logged in, we grab the users data using the getUserData() GET request. */
  useEffect(() => {
    (async () => {
      setUserData(await getUserData(data.email));
    })();
  }, [data]);
  /*After we get the user data we determine if the user has previously liked the NFT card. */
  useEffect(() => {
    (async () => {
      await userData.likes.forEach((like: any) => {
        /*If the user has liked the current NFT then set the like button to true and set likeId.
          The likeId is needed just in case the user decides to remove his like from the NFT card. */
        if (like.nftName === nftItem.metadata.name) {
          setToggleLikeButton(true);
          setLikeId(Number(like.id));
        }
      });
    })();
  }, [userData]);
  useEffect(() => {
    /*Checks if the current NFT is listed on the marketplace */
    const listing = listings.find(
      (listing: any) =>
        listing.asset.id.toNumber() === nftItem.metadata.id.toNumber() &&
        collectionContractAddress === listing.assetContractAddress
    );
    /*If the NFT is listed on the marketplace setIsListed is set to true and 
      the listing price is displayed */
    if (Boolean(listing)) {
      setIsListed(true);
      setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
    }
    /*If the NFT is a part of a collection then add the collection contract address to 
      the collection variable.*/
    collectionContractAddress
      ? setCollection(collectionContractAddress)
      : setCollection(false);
  }, [listings, nftItem, collectionContractAddress]);
  /*If the user clickes the like button then a like will either be added or removed from the NFT. */
  const like = async () => {
    /*me() will determine is the user is logged in after pressing the like button. 
      If the user is not logged in then the like state will not save. */
    await me();
    const likeData = {
      collectionContractAddress: collectionContractAddress,
      tokenId: nftItem.metadata.id.toNumber(),
      nftName: nftItem.metadata.name,
      email: data.email,
    };
    /*If the toggleLikeButton is true remove the like from the users data */
    toggleLikeButton && (await deleteLike(likeId));
    /*If the toggleLikeButton is false add the like to the users data */
    !toggleLikeButton && (await addLike(likeData));
    await setToggleLikeButton(!toggleLikeButton);
    /*Retrieve the users data after the like field is updated */
    setUserData(await getUserData(data.email));
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
