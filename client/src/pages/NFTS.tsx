import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useWeb3 } from '@3rdweb/hooks';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { NFTImage } from '../components/NFTImage';
import { GeneralDetails } from '../components/GeneralDetails';
import { ItemActivity } from '../components/ItemActivity';
import { Purchase } from '../components/Purchase';
import { useSearchParams } from 'react-router-dom';

interface NFTSProps {}

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

export const NFTS: React.FC<NFTSProps> = ({}) => {
  let { id }: any = useParams();
  console.log(id);
  const [searchParams] = useSearchParams();
  const { provider } = useWeb3();
  const [selectedNft, setSelectedNft]: any = useState();
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  console.log(searchParams.get('isListed'));

  const nftModule = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getNFTDrop('0xFB1C5578629F802Ee2393a05ADffc4c665DC3ea8');
  }, [provider]);

  useEffect(() => {
    if (!nftModule) return;
    (async () => {
      const nfts = await nftModule.getAll();
      console.log(nfts);
      nfts.map((nft) => {
        console.log(nft.metadata.id.toNumber());
      });
      const selectedNftItem: any = nfts.find(
        (nft) => nft.metadata.id.toNumber() == id
      );
      console.log(selectedNftItem);
      setSelectedNft(selectedNftItem);
    })();
  }, [nftModule]);

  const marketPlaceModule: any = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());

    return sdk.getMarketplace('0x06f2DcAc14A483d2854Ee36D163B2d32bE2d8543');
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;
    (async () => {
      setListings(await marketPlaceModule.getAllListings());
      console.log(listings);
    })();
  }, [marketPlaceModule]);

  return (
    <div>
      <Navbar />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                isListed={searchParams.get('isListed')}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketPlaceModule}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
};
