import { useContract, useNFT } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import React, { useEffect, useState } from 'react';
import { getCollection } from '../adapters/marketItems';
import { shortenAddress } from '../utils/shortenAddress';

interface AttributesProps {}

const style = {
  attributesOptions: `h-1/4 flex items-center justify-center hover:bg-white hover:text-[#2081e2]`,
};

export const Attributes: React.FC<any> = ({
  selectedNft,
  collectionContractAddress,
  id,
}) => {
  const [collectionData, setCollectionData]: any = useState();
  const [nftAttributes, setNftAttributes]: any = useState('Details');
  const [nftRoyaltyDetails, setNftRoyaltyDetails]: any = useState();
  useEffect(() => {
    const sdk = new ThirdwebSDK('goerli');
    const contract = sdk.getNFTCollection(collectionContractAddress);
    let likesArray;
    (async () => {
      const royaltyFee: any = await contract.royalties.getTokenRoyaltyInfo(id);
      console.log(royaltyFee);
      setNftRoyaltyDetails(royaltyFee.seller_fee_basis_points / 100);
      setCollectionData(await getCollection(collectionContractAddress));
    })();
  }, []);
  console.log(selectedNft);
  console.log(collectionData);
  console.log(nftRoyaltyDetails);
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
      <div className="h-2/3 w-2/3 my-auto ml-4 flex justify-center">
        <div className="flex flex-col h-full w-2/3 items-center white-glassmorphism-nft-attributes p-2 overflow-hidden">
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
