import React, { useEffect, useState } from 'react';
import { collectionTransactions } from '../adapters/marketItems';
import { roundUpToHundreths } from '../utils/roundUpToHundreths';
import defaultBannerImage from '../../src/images/default-banner.jpg';

interface CollectionItemProps {}

const style = {
  eventItem: `flex px-1 sm:px-4 my-2 font-medium w-full white-and-blue-glassmorphism`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl text-[#e5e8eb]`,
  eventName: `text-lg font-semibold`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2] w-1/5 text-base flex items-center mr-4`,
  profileImg: `w-20 h-20 object-cover rounded-md border-2 border-[#202225] `,
};

export const CollectionItem: React.FC<any> = ({ collection }) => {
  /*URL path to pull collection photos from the database */
  const URL = process.env.REACT_APP_PHOTO_API_URL;
  /*Retrieves all the transactions under the selected collection */
  const [transactions, setTransactions]: any = useState([]);
  /*Filters through the transactions to only keep the transactions labeled NewSale */
  const sales: any = transactions.filter(
    (transaction: any) => transaction.event === 'NewSale'
  );
  /*when the page first loads pull all the transactions from the database */
  useEffect(() => {
    (async () => {
      setTransactions(await collectionTransactions(collection.contractAddress));
    })();
  }, []);
  return (
    <div className={style.eventItem}>
      <div className="w-2 sm:w-8 text-[#2081e2] text-base flex items-center">
        {collection?.ranking}
      </div>
      <div className="text-[#2081e2] w-1/5 text-base flex items-center">
        <img
          className={style.profileImg}
          src={
            collection?.logoImage
              ? `${collection.logoImage}`
              : `${defaultBannerImage}`
          }
          alt="profile image"
        />
      </div>
      <div className={`${style.accent}`}>{collection?.title}</div>
      <div className={`${style.accent}`}>{collection?.volumeTraded}</div>
      <div className={`${style.accent}`}>
        {collection?.floorPrice === (Infinity || NaN)
          ? 0
          : roundUpToHundreths(collection?.floorPrice)}
      </div>
      <div className={`${style.accent}`}>{sales?.length}</div>
    </div>
  );
};
