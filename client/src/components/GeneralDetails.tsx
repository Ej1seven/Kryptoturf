import React, { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { MdRefresh } from 'react-icons/md';
import { RiShareBoxLine } from 'react-icons/ri';
import { FiMoreVertical } from 'react-icons/fi';
import { GiShare } from 'react-icons/gi';
import { getCollection, getCollections } from '../adapters/marketItems';
import { getUserData, me } from '../adapters/user';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface GeneralDetailsProps {}

const style = {
  wrapper: `flex`,
  infoContainer: `h-36 flex flex-col flex-1 justify-between mb-6`,
  accent: `text-[#2081e2] text-xl md:text-base font-bold`,
  nftTitle: `text-3xl font-extrabold`,
  otherInfo: `flex`,
  ownedBy: `text-[#8a939b] mr-4 font-bold`,
  likes: `flex items-center text-[#8a939b]`,
  likeIcon: `mr-1`,
  actionButtonsContainer: `w-24`,
  actionButtons: `flex sm:container justify-between text-[1.4rem] border-2 rounded-lg `,
  actionButton: `my-2 mx-auto `,
  divider: `border-r-2 `,
};

export const GeneralDetails: React.FC<any> = ({
  selectedNft,
  collectionContractAddress,
}) => {
  const [collectionData, setCollectionData]: any = useState();
  const [owner, setOwner]: any = useState();
  const [likes, setLikes]: any = useState([]);
  useEffect(() => {
    (async () => {
      await me();
    })();
  }, []);
  useEffect(() => {
    console.log('selectedNFT', selectedNft?.owner.toLowerCase());
    (async () => {
      setOwner(await getUserData(selectedNft?.owner.toLowerCase()));
      setCollectionData(await getCollection(collectionContractAddress));
    })();
  }, [selectedNft]);
  useEffect(() => {
    let likesArray: any = [];
    (async () => {
      await collectionData.likes.forEach((likeData: any) => {
        if (selectedNft.metadata.name === likeData.nftName) {
          likesArray.push(likeData);
        }
      });
    })();
    setLikes(likesArray);
  }, [collectionData]);
  return (
    <div className={style.wrapper}>
      <div className={style.infoContainer}>
        <div className={style.accent}>{collectionData?.title}</div>
        <div className={style.nftTitle}>{selectedNft?.metadata.name}</div>
        <div className={style.otherInfo}>
          <div className={style.ownedBy}>
            Owned by <span className={style.accent}>{owner?.username}</span>
          </div>
          <div className={style.likes}>
            {' '}
            <AiFillHeart className={style.likeIcon} />
            {likes?.length}
            {likes?.length === 1 ? <> like</> : <> likes </>}
          </div>
        </div>
      </div>
      <div className={style.actionButtonsContainer}>
        <div className={style.actionButtons}>
          <div className={`${style.actionButton} ml-2`}>
            <MdRefresh onClick={() => window.location.reload()} />
          </div>
          <div className={style.divider} />
          <div className={style.actionButton}>
            <RiShareBoxLine
              onClick={() =>
                selectedNft.metadata.external_url !== '' &&
                window.open(`${selectedNft.metadata.external_url}`, '_blank')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
