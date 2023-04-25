import { useWeb3 } from '@3rdweb/hooks';
import { useEffect, useMemo, useState } from 'react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const useMarkeplaceData = (collectionId?: any) => {
  /*A Provider is an abstraction of a connection to the Ethereum network, providing a concise,
   consistent interface to standard Ethereum node functionality.*/
  const { provider } = useWeb3();
  /*Marketplace address used by ThirdWeb SDK */
  const MARKETPLACE_ADDRESS: any = process.env.REACT_APP_MARKETPLACE_ADDRESS;
  /*Retrieves all the listed NFTs on the marketplace */
  const [listings, setListings]: any = useState([]);
  /*Retrieves the marketplace data from ThirdwebSDK */
  const marketPlaceModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk;
  }, [provider]);
  /*Retrieves all the NFTs on the marketplace from Thirdweb*/
  const nftModule = useMemo(() => {
    if (!provider) return;
    if (!collectionId) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getNFTDrop(collectionId);
  }, [provider]);
  /*Once the marketplace data is pulled from Thirdweb, the following useEffect hook retrieves
   all listings on the marketplace from ThirdWeb */
  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      const marketplace = await marketPlaceModule.getMarketplace(
        MARKETPLACE_ADDRESS
      );
      setListings(await marketplace.getAllListings());
    })();
  }, [marketPlaceModule]);
  return { listings, marketPlaceModule, nftModule, provider };
};
export default useMarkeplaceData;
