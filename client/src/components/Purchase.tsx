/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';

interface PurchaseProps {}
const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

export const Purchase: React.FC<any> = ({
  isListed,
  selectedNft,
  listings,
  marketPlaceModule,
}) => {
  const [selectedMarketNft, setSelectedMarketNft]: any = useState();
  const [enableButton, setEnableButton] = useState(false);

  useEffect(() => {
    if (!listings || isListed == 'false') return;
    (async () => {
      setSelectedMarketNft(
        listings.find(
          (marketNft: any) =>
            marketNft.asset?.id.toNumber() == selectedNft.metadata.id.toNumber()
        )
      );
      console.log(listings);
      console.log(selectedNft);
      console.log(selectedMarketNft);
    })();
  }, [selectedNft, listings, isListed]);

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;
    setEnableButton(true);
  }, [selectedMarketNft, selectedNft]);

  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });

  const buyItem: any = async (
    listingId = selectedMarketNft.id,
    quantityDesired = 1,
    marketModule = marketPlaceModule
  ) => {
    console.log(Number(listingId), quantityDesired, marketModule, 'david');
    await marketModule.direct
      .buyoutListing(Number(listingId), quantityDesired)
      .catch((error: any) => console.error(error));

    confirmPurchase();
  };

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="top-center" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft.id, 1) : null;
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      )}
    </div>
  );
};
