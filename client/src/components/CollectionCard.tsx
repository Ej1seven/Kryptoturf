import { useNavigate } from 'react-router-dom';
import { MdPhotoSizeSelectLarge } from 'react-icons/md';

const URL = process.env.REACT_APP_PHOTO_API_URL;
const style = {
  wrapper: ` flex-auto w-[18rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer btn-glow`,
  imgContainer: `h-full w-full overflow-hidden flex justify-center items-center relative`,
  nftImg: `w-full h-full object-cover`,
};
const CollectionCard = ({ collectionItem }: any) => {
  const navigate = useNavigate();
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        navigate(`/collection/${collectionItem.contractAddress}`);
      }}
    >
      <div className={style.imgContainer}>
        {collectionItem?.profileImage ? (
          <>
            {' '}
            <img
              src={`${collectionItem.profileImage}`}
              alt="image"
              className={style.nftImg}
            />
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-black border-2 border-white">
            <MdPhotoSizeSelectLarge
              className="h-20
             w-20 m-auto text-white"
            />
          </div>
        )}
        <div className="w-[18rem] h-[22rem] object-cover bg-black	collection-card absolute rounded-2xl" />
        <div className="w-[18rem] overflow-hidden h-20 absolute bottom-0 flex items-center z-[100]">
          <div className="h-9 w-9 rounded-full overflow-hidden mx-5">
            {collectionItem?.logoImage ? (
              <>
                {' '}
                <img
                  src={`${collectionItem.logoImage}`}
                  alt="image"
                  className={style.nftImg}
                />
              </>
            ) : (
              <div className="w-full h-full object-cover text-black text-center bg-white flex justify-center items-center">
                <p>{collectionItem?.title.charAt(0).toUpperCase()}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-base text-white font-bold">
              {collectionItem.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
