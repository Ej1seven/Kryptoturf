import React from 'react';
import { BsFillCartFill } from 'react-icons/bs';

interface EventItemProps {}

const style = {
  eventItem: `flex px-4 py-5 font-medium`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl text-[#e5e8eb]`,
  eventName: `text-lg font-semibold`,
  eventPrice: `flex items-center`,
  eventPriceValue: `text-lg`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
};

export const EventItem: React.FC<any> = ({ event }) => {
  return (
    <div className={style.eventItem}>
      <div className={`${style.accent} flex-[2] text-[#e5e8eb]`}>
        <div className={style.eventIcon}>
          <BsFillCartFill />
        </div>
        <div className={style.eventName}>Sale</div>
      </div>
      <div className={`${style.eventPrice} flex-[2]`}>
        <img
          src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
          alt="eth"
          className={style.ethLogo}
        />
        <div className={style.eventPriceValue}>{event.price}</div>
      </div>
      <div className={`${style.accent} flex-[3]`}>{event.from}</div>
      <div className={`${style.accent} flex-[3]`}>{event.to}</div>
      <div className={`${style.accent} flex-[2]`}>{event.date}</div>
    </div>
  );
};
