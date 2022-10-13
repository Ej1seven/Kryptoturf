/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { addTransaction, updateTradedVolume } from '../adapters/marketItems';
import { buyNFT, getUserData } from '../adapters/user';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

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
  collection,
  enableToggleMenu,
  id,
  user,
}) => {
  const [selectedMarketNft, setSelectedMarketNft]: any = useState();
  const [nftRoyaltyDetails, setNftRoyaltyDetails]: any = useState({
    royaltyOwner: '',
    royaltyPercentage: 0,
  });
  const [userData, setUserData]: any = useState([]);
  const [enableButton, setEnableButton] = useState(false);
  const [price, setPrice] = useState(0);
  const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
  console.log(collection);
  console.log(TOKEN_ADDRESS);
  console.log(user);
  useEffect(() => {
    if (!listings || isListed == 'false') return;
    const sdk = new ThirdwebSDK('goerli');
    const contract = sdk.getNFTCollection(collection);
    (async () => {
      setSelectedMarketNft(
        listings.find(
          (marketNft: any) =>
            marketNft.asset?.id.toNumber() ==
              selectedNft.metadata.id.toNumber() &&
            marketNft.asset?.name === selectedNft.metadata.name
        )
      );
      console.log(listings);
      console.log(selectedNft);
      console.log(contract);
      const royaltyFee: any = await contract.royalties.getTokenRoyaltyInfo(id);
      setNftRoyaltyDetails({
        royaltyOwner: royaltyFee.fee_recipient,
        royaltyPercentage: royaltyFee.seller_fee_basis_points / 100,
      });
      setUserData(await getUserData(user.email));
      console.log(royaltyFee);
    })();
  }, [selectedNft, listings, isListed]);
  console.log(selectedMarketNft);
  console.log(selectedMarketNft?.sellerAddress);
  console.log(nftRoyaltyDetails.royaltyOwner);
  console.log(nftRoyaltyDetails.royaltyPercentage);
  console.log(userData.turfCoins);

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
    if (
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue) >
      userData.turfCoins
    ) {
      return console.error(`Sorry you've ran out of coins`);
    }
    console.log(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue);
    console.log(Number(listingId), quantityDesired, marketModule, 'david');
    const tx = await marketModule.direct
      .buyoutListing(Number(listingId), quantityDesired)
      .catch((error: any) => console.error(error));
    const receipt = await tx.receipt; // the transaction receipt
    const transactionData: any = await {
      collectionContractAddress: collection,
      tokenId: Number(id),
      event: receipt.events[2].event,
      price: Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue),
      from: selectedMarketNft?.sellerAddress,
      to: receipt.from,
      blockNumber: Number(receipt.blockNumber),
      txHash: receipt.transactionHash,
    };
    console.log(transactionData);
    await addTransaction(transactionData);
    console.log(receipt);
    buyNFT(
      receipt.from,
      selectedMarketNft?.sellerAddress,
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue),
      nftRoyaltyDetails.royaltyOwner,
      nftRoyaltyDetails.royaltyPercentage
    );
    updateTradedVolume(
      collection,
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue)
    );
    confirmPurchase();
  };
  const listItem: any = async (
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
          <div
            className={style.buttonText}
            onClick={() => {
              enableToggleMenu();
            }}
          >
            List Item
          </div>
        </div>
      )}
    </div>
  );
};
