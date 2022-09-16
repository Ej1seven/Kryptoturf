import React, { useEffect, useState } from 'react';
import { IoMdSnow } from 'react-icons/io';
import { AiOutlineHeart } from 'react-icons/ai';
import { getCollection } from '../adapters/marketItems';

interface NFTImageProps {}

const style = {
  topBar: `bg-[#303339] p-2 rounded-t-md border-0 border-transparent `,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`,
};

export const NFTImage: React.FC<any> = ({
  selectedNft,
  collectionContractAddress,
}) => {
  const [collectionData, setCollectionData]: any = useState();
  const [likes, setLikes]: any = useState([]);
  useEffect(() => {
    let likesArray;
    (async () => {
      setCollectionData(await getCollection(collectionContractAddress));
    })();
  }, [selectedNft]);
  useEffect(() => {
    let likesArray: any = [];
    (async () => {
      await collectionData.likes.forEach((likeData: any) => {
        // console.log(selectedNft.metadata.name);
        // console.log(likeData.nftName);
        if (selectedNft.metadata.name === likeData.nftName) {
          console.log(likeData);
          likesArray.push(likeData);
        }
      });
    })();
    setLikes(likesArray);
  }, [collectionData]);
  console.log(collectionData);
  console.log(selectedNft);
  console.log(likes);
  return (
    <div>
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart />
            {likes.length}
          </div>
        </div>
      </div>
      <img
        src={selectedNft?.metadata.image}
        className="rounded-b-md border-0 border-transparent"
      />
    </div>
  );
};
