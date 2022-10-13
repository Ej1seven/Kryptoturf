import React, { useEffect, useState } from 'react';
import { collectionTransactions } from '../adapters/marketItems';

interface CollectionItemProps {}

const style = {
  eventItem: `flex px-4 my-2 font-medium w-full white-glassmorphism`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl text-[#e5e8eb]`,
  eventName: `text-lg font-semibold`,
  // eventPrice: `flex items-center`,
  // eventPriceValue: `text-lg`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2] w-1/5 text-base flex items-center`,
  profileImg: `w-20 h-20 object-cover rounded-md border-2 border-[#202225] `,
};

export const CollectionItem: React.FC<any> = ({ collection }) => {
  const URL = process.env.REACT_APP_PHOTO_API_URL;
  const [transactions, setTransactions]: any = useState([]);
  const sales: any = transactions.filter(
    (transaction: any) => transaction.event === 'NewSale'
  );
  console.log(sales);
  console.log(collection);
  useEffect(() => {
    (async () => {
      setTransactions(await collectionTransactions(collection.contractAddress));
    })();
  }, []);
  console.log(transactions);
  return (
    <div className={style.eventItem}>
      <div className="w-8 text-[#2081e2] text-base flex items-center">
        {collection?.ranking}
      </div>
      <div className="text-[#2081e2] w-1/5 text-base flex items-center">
        <img
          className={style.profileImg}
          src={
            collection?.logoImage
              ? `${URL}/${collection.logoImage}`
              : 'https://via.placeholder.com/200'
          }
          alt="profile image"
        />
      </div>
      <div className={`${style.accent}`}>{collection?.title}</div>
      <div className={`${style.accent}`}>{collection?.volumeTraded}</div>
      <div className={`${style.accent}`}>{collection?.floorPrice}</div>
      <div className={`${style.accent}`}>{sales?.length}</div>
    </div>
  );
};
