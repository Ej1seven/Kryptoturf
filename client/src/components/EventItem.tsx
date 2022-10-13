import React, { useEffect, useState } from 'react';
import { BsFillCartFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { shortenAddress } from '../utils/shortenAddress';
import { formatDistance } from 'date-fns';
import { EventLogo } from './EventLogo';

interface EventItemProps {}

const style = {
  eventItem: `flex px-4 py-5 font-medium w-full`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl text-[#e5e8eb]`,
  eventName: `text-lg font-semibold`,
  // eventPrice: `flex items-center`,
  // eventPriceValue: `text-lg`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2] w-1/5 text-base`,
};

export const EventItem: React.FC<any> = ({ transaction }) => {
  const [date, setDate] = useState();
  const [eventName, setEventName]: any = useState();
  const calculateDate = () => {
    let differenceInTime: any;
    let date1 = new Date(transaction?.createdAt);
    let date2 = new Date();
    console.log(new Date(transaction?.createdAt));
    console.log(new Date());
    differenceInTime = formatDistance(date1, date2);
    console.log(differenceInTime);
    setDate(differenceInTime);
  };
  const getEventName = () => {
    if (transaction?.event === 'ListingAdded') {
      setEventName('List');
    } else if (transaction?.event === 'NewSale') {
      setEventName('Sale');
    }
  };
  const getEventLogo = () => {};
  useEffect(() => {
    calculateDate();
    getEventName();
  }, []);
  return (
    <div className={style.eventItem}>
      <div className=" w-1/5 text-base flex text-[#e5e8eb] flex-row">
        <div className={style.eventIcon}>
          {/* <BsFillCartFill /> */}
          <EventLogo event={transaction?.event} />
        </div>
        <div>{eventName}</div>
      </div>
      <div className="w-1/5 text-base flex text-[#e5e8eb] flex-row">
        <FaEthereum className={style.ethLogo} />
        <div>{transaction?.price}</div>
      </div>
      <div className={`${style.accent}`}>
        {shortenAddress(transaction?.from)}
      </div>
      <div className={`${style.accent}`}>{shortenAddress(transaction?.to)}</div>
      <div className={`${style.accent}`}>{`${date} ago`}</div>
    </div>
  );
};
