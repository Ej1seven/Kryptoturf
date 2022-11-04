import React, { useEffect, useState } from 'react';
import { getCollection } from '../adapters/marketItems';
import useMarkeplaceData from '../hooks/useMarketplaceData';
import { shortenAddress } from '../utils/shortenAddress';

interface AttributesProps {}

const style = {
  attributesOptions: `h-1/4 flex items-center justify-center hover:bg-white hover:text-[#2081e2] text-center`,
};

export const Attributes: React.FC<any> = ({
  selectedNft,
  collectionContractAddress,
  id,
}) => {
  /*Collection Data pulled from the database */
  const [collectionData, setCollectionData]: any = useState();
  /*Toggles between the following NFT data - Details, About, Description, Properties */
  const [nftAttributes, setNftAttributes]: any = useState('Details');
  /*Gets the creator royalty fee from Thirdweb */
  const [nftRoyaltyDetails, setNftRoyaltyDetails]: any = useState();
  /*Gets the marketplace data from Thirdweb */
  const { marketPlaceModule } = useMarkeplaceData(id);
  /*When the component first loads we get the NFT royalty information by providing the 
    token ID to Thirdweb. Thirdweb then responds with the royalty value in points
    which we divide by 100 to get the percentage value. Lastly we retrieve the collection data from the database and set it to the collection data variable. */
  useEffect(() => {
    (async () => {
      const collectionData: any = await getCollection(
        collectionContractAddress
      );
      setCollectionData(collectionData);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const contract = await marketPlaceModule?.getNFTCollection(
        collectionContractAddress
      );
      const royaltyFee: any = await contract?.royalties.getTokenRoyaltyInfo(id);
      setNftRoyaltyDetails(royaltyFee.seller_fee_basis_points / 100);
    })();
  }, [collectionData, marketPlaceModule]);
  return (
    <div className="h-full p-1 flex flex-row ">
      <div className="h-2/3 w-1/3 my-auto white-glassmorphism-nft-attributes">
        <div
          className={`${style.attributesOptions} ${
            nftAttributes === 'Description' && 'bg-white text-[#2081e2]'
          } rounded-t-[16px] hover:bg-white hover:text-[#2081e2]`}
          onClick={() => {
            setNftAttributes('Description');
          }}
        >
          Description
        </div>
        <div
          className={`${style.attributesOptions} ${
            nftAttributes === 'Properties' && 'bg-white text-[#2081e2]'
          } border-y-[1px] border-white`}
          onClick={() => {
            setNftAttributes('Properties');
          }}
        >
          Properties
        </div>
        <div
          className={`${style.attributesOptions} ${
            nftAttributes === 'About' && 'bg-white text-[#2081e2]'
          } border-b-[1px] border-white`}
          onClick={() => {
            setNftAttributes('About');
          }}
        >
          {`About ${collectionData?.title}`}
        </div>
        <div
          className={`${style.attributesOptions} ${
            nftAttributes === 'Details' && 'bg-white text-[#2081e2]'
          } rounded-b-[16px] hover:bg-white hover:text-[#2081e2]`}
          onClick={() => {
            setNftAttributes('Details');
          }}
        >
          Details
        </div>
      </div>
      <div className="h-2/3 w-2/3 my-auto sm:ml-4 flex justify-center">
        <div className="flex flex-col h-full w-full sm:w-2/3 ml-2 sm:ml-0 items-center white-glassmorphism-nft-attributes p-2 overflow-hidden">
          {nftAttributes === 'Details' && (
            <>
              <p className="text-lg mb-2">Details</p>
              <div className="w-full flex flex-row justify-between">
                <div>Contract Address</div>
                <div>{shortenAddress(collectionContractAddress)}</div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <div>Token ID</div>
                <div>{id}</div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <div>Token Standard</div>
                <div>ERC-721</div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <div>Blockchain</div>
                <div>Ethereum (GoerliETH)</div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <div>Creator Earnings</div>
                <div>{`${nftRoyaltyDetails}%`}</div>
              </div>
            </>
          )}
          {nftAttributes === 'Description' && (
            <>
              <p className="text-lg mb-2">Description</p>
              <div className="w-full overflow-scroll flex flex-row justify-between pb-2">
                <div>
                  <p id="about-section">{selectedNft.metadata.description}</p>
                </div>
              </div>
            </>
          )}
          {nftAttributes === 'Properties' && (
            <>
              <p className="text-lg mb-2">Properties</p>
              <div className="w-full flex flex-row justify-between">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full">
                  {selectedNft.metadata.attributes?.map((attribute: any) => {
                    return (
                      <div className="flex flex-col rounded-md border-[1px] border-white m-1 items-center justify-center py-2 bg-white/10">
                        <p className="font-bold text-[#2081e2]">
                          {attribute?.trait_type}
                        </p>
                        <p>{attribute?.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {nftAttributes === 'About' && (
            <>
              <p className="text-lg mb-2">About</p>
              <div className="w-full overflow-scroll flex flex-row justify-between pb-2">
                <div>
                  <p id="about-section">{collectionData?.description}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
