import React from 'react';

interface UserItemProps {}

const style = {
  eventItem: `flex px-4 my-2 font-medium w-full white-and-blue-glassmorphism`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl text-[#e5e8eb]`,
  eventName: `text-lg font-semibold`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2] w-1/5 text-base flex items-center`,
  profileImg: `w-20 h-20 object-cover rounded-md border-2 border-[#202225] `,
};

export const UserItem: React.FC<any> = ({ user }) => {
  /*URL path to pull collection photos from the database */
  const URL = process.env.REACT_APP_PHOTO_API_URL;
  return (
    <div className={style.eventItem}>
      <div className="w-8 text-[#2081e2] text-base flex items-center">
        {user?.ranking}
      </div>
      <div className="text-[#2081e2] w-1/6 text-base flex items-center">
        <img
          className={style.profileImg}
          src={
            user?.profileImage
              ? `${URL}/${user.profileImage}`
              : 'https://via.placeholder.com/200'
          }
          alt="profile image"
        />
      </div>
      <div className={`${style.accent}`}>{user?.username}</div>
      <div className={`${style.accent}`}>{user?.turfCoins}</div>
    </div>
  );
};
