import React from 'react';
import { AiFillTag } from 'react-icons/ai';
import { TiShoppingCart } from 'react-icons/ti';

interface EventLogoProps {}

export const EventLogo: React.FC<any> = ({ event }) => {
  console.log(event);
  return (
    <>
      {event === 'ListingAdded' && <AiFillTag />}
      {event === 'NewSale' && <TiShoppingCart />}
    </>
  );
};
