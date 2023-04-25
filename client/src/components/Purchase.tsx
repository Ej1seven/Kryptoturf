/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { addTransaction, updateTradedVolume } from '../adapters/marketItems';
import { buyNFT, getUserData } from '../adapters/user';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';

interface PurchaseProps {}
const style = {
  button: `mx-auto flex items-center py-2 px-8 md:px-12 rounded-lg cursor-pointer`,
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
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /* Gets the data of the selectedNFT by matching the NFT token id to the metadata pulled from Thirdweb*/
  const [selectedMarketNft, setSelectedMarketNft]: any = useState();
  /*Holds the royalty details pulled from Thirdweb */
  const [nftRoyaltyDetails, setNftRoyaltyDetails]: any = useState({
    royaltyOwner: '',
    royaltyPercentage: 0,
  });
  /*Gets the users data from the database */
  const [userData, setUserData]: any = useState([]);
  /*Enables the user to buy the selected NFT */
  const [enableButton, setEnableButton] = useState(false);
  /*Display a spinning loading icon when the collection data is being sent to the blockchain and database*/
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    /*if the NFT is not listed on the marketplace do not allow the user to purchase it */
    if (!listings || isListed == 'false') return;
    const sdk = new ThirdwebSDK('goerli');
    const contract = sdk.getNFTCollection(collection);
    (async () => {
      /*finds the selected NFT listed on the marketplace by comparing token ID and name. */
      setSelectedMarketNft(
        listings.find(
          (marketNft: any) =>
            marketNft.asset?.id.toNumber() ==
              selectedNft.metadata.id.toNumber() &&
            marketNft.asset?.name === selectedNft.metadata.name
        )
      );
      /*Gets the royalty fee for the selected NFT from Thirdweb */
      const royaltyFee: any = await contract.royalties.getTokenRoyaltyInfo(id);
      setNftRoyaltyDetails({
        royaltyOwner: royaltyFee.fee_recipient,
        royaltyPercentage: royaltyFee.seller_fee_basis_points / 100,
      });
      /*Gets the user data from the database */
      setUserData(await getUserData(user.email));
    })();
  }, [selectedNft, listings, isListed]);
  /*If the selected NFT data is not avaiable exit useEffect() */
  /*If the selected NFT data is available allow the user to buy the NFT */
  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;
    setEnableButton(true);
  }, [selectedMarketNft, selectedNft]);
  /*Is the purchase is successful a toast will popup informing the user */
  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });
  /*the buyItem function sends the purchase details to the marketplace and if the transaction is successful the NFT
    ownership is past to the purchaser */
  const buyItem: any = async (
    listingId = selectedMarketNft.id,
    quantityDesired = 1,
    marketModule = marketPlaceModule
  ) => {
    let error: any = null;
    setIsLoading(true);
    /*If the user is not logged in an error message will popup up instructing the user to login before
      attempting to purchase the NFT */
    if (!user?.id) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Sorry, you must be logged in to buy a NFT`,
        background: '#180c1a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*If the user is the owner of the NFT they can not buy their own NFT */
    if (user?.walletAddress === selectedNft.owner.toLowerCase()) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Sorry, you can not purchase your own NFT`,
        background: '#180c1a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*if the user does not have enough turfCoins to purchase the NFT an error message will 
      popup */
    if (
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue) >
      userData.turfCoins
    ) {
      setIsLoading(false);
      return console.error(
        `Sorry you do not have enough TURF coins to buy this item`
      );
    }
    /*the following function is used by ThirdWeb to purchase the NFT */
    const tx = await marketModule.direct
      .buyoutListing(Number(listingId), quantityDesired)
      .catch((err: any) => {
        error = err;
      });
    if (error) {
      setIsLoading(false);
      /*If an error occurs when the user attempts to purchase the NFT an error message will popup */
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.message}`,
        background: '#180c1a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    /*if the transaction is successful a receipt will be returned*/
    const receipt = await tx.receipt; // the transaction receipt
    /*transactionData takes the receipt data and saves it to the database*/
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
    /*Saves transaction data to the database */
    await addTransaction(transactionData);
    /*Updates the purchasers information and sellers information in the database.
      Both the purchaser and sellers TURF coins are updated along wil royalty information */
    buyNFT(
      receipt.from,
      selectedMarketNft?.sellerAddress,
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue),
      nftRoyaltyDetails.royaltyOwner,
      nftRoyaltyDetails.royaltyPercentage
    );
    /*Updates the collections traded volume */
    updateTradedVolume(
      collection,
      Number(selectedMarketNft.buyoutCurrencyValuePerToken.displayValue)
    );
    setIsLoading(false);
    /*If the purchase is successful a success message will popup */
    Swal.fire({
      icon: 'success',
      title: 'Congrats!',
      text: `You've successfully purchased ${selectedNft?.metadata.name} from the Kryptoturf marketplace!`,
      background: '#180c1a',
      color: '#fff',
      confirmButtonColor: '#2952e3',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmPurchase();
        navigate(`/collection/${collection}`);
      }
    });
  };
  return (
    <>
      {' '}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center z-10">
          <Loader />
          <p className="text-white text-1xl text-center">Please wait...</p>
          <p className="text-white text-1xl text-center">
            The task is being executed. May take up to 3 minutes until it is
            completed.
          </p>
        </div>
      ) : (
        <>
          <div className="flex h-16 md:h-20 w-72 mb-4 sm:mb-0 md:w-96 items-center justify-center rounded-lg border white-glassmorphism-nft-attributes mx-auto px-12">
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
              </>
            ) : (
              <div
                className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
                onClick={() => {
                  enableToggleMenu();
                }}
              >
                <IoMdWallet className={style.buttonIcon} />
                <div className={style.buttonText}>List Item</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
