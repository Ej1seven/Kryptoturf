import React, { useEffect, useState } from 'react';
import { getCollections } from '../adapters/marketItems';
import { getAllUsers } from '../adapters/user';
import { Loader } from '../components';
import { CollectionItem } from '../components/CollectionItem';
import { Navbar } from '../components/Navbar';
import { Pagination } from '../components/Pagination';
import { UserItem } from '../components/UserItem';
import useMarkeplaceData from '../hooks/useMarketplaceData';

interface StatsProps {}

const style = {
  wrapper: `w-full mt-8 border border-[#151b22] rounded-xl bg-[#303339] overflow-hidden`,
  title: `bg-[#262b2f] px-6 py-4 flex items-center`,
  titleLeft: `flex-1 flex items-center text-xl font-bold`,
  titleIcon: `text-3xl mr-2`,
  titleRight: `text-xl`,
  filter: `flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]`,
  filterTitle: `flex-1`,
  tableHeader: `flex w-11/12 mt-8 px-4 py-1 text-white mx-auto border-b border-white/25`,
  tableColumn: `w-1/5  exSMMAX:ml-4`,
  eventItem: `flex px-4`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
};

export const Stats: React.FC<StatsProps> = ({}) => {
  /*Pulls all the collections from the database and puts them in the collections array */
  const [collections, setCollections]: any = useState([]);
  /*Pulls all the users from the database */
  const [users, setUsers]: any = useState([]);
  /*Toggles between collection rankings and user rankings */
  const [toggleUsers, setToggleUsers]: any = useState(false);
  /*sets the currentPage used for pagination feature */
  const [currentPage, setCurrentPage]: any = useState(1);
  /*sets the amount of items per page */
  const [postPerPage, setPostPerPage]: any = useState(5);
  /*Display a spinning loading icon when data is loaded*/
  const [isLoading, setIsLoading] = useState(false);
  /*listing - provides all the NFTS that a actively listed on the marketplace for sale */
  const { listings } = useMarkeplaceData();
  const lastPostIndex = currentPage + postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  let currentPost: any;
  /*If toggleUsers is false then show collection rankings */
  if (!toggleUsers) {
    currentPost = collections?.slice(firstPostIndex - 1, lastPostIndex - 1);
  }
  /*If toggleUsers is true then show user rankings */
  if (toggleUsers) {
    currentPost = users?.slice(firstPostIndex - 1, lastPostIndex - 1);
  }
  /*When the page first loads pull all the users and collections from the database and sort them according to their ranking */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let sortedCollections: any = [];
      let sortedUsers: any = [];
      let collectionRanking: any = 0;
      let userRanking: any = 0;
      /*Pulls the all the collections from the database */
      const collections = await getCollections();
      /*Pulls all the users from the database */
      const users = await getAllUsers();
      /*Sorts the collections by volume traded in descending order */
      sortedCollections = await collections.sort(function (a: any, b: any) {
        if (a.volumeTraded > b.volumeTraded) return -1;
        if (a.volumeTraded < b.volumeTraded) return 1;
        return 0;
      });
      /*After the collections are sorted according to ranking add the ranking to 
        each individual collection */
      for (let x = 0; x < sortedCollections.length; x++) {
        collectionRanking = collectionRanking + 1;
        sortedCollections[x].ranking = collectionRanking;
      }
      /*Sort the users by turfCoins in descending order */
      sortedUsers = await users.sort(function (a: any, b: any) {
        if (a.turfCoins > b.turfCoins) return -1;
        if (a.turfCoins < b.turfCoins) return 1;
        return 0;
      });
      /*Once the users are sorted add the ranking to each individual user */
      for (let x = 0; x < sortedUsers.length; x++) {
        userRanking = userRanking + 1;
        sortedUsers[x].ranking = userRanking;
      }
      await setCollections(sortedCollections);
      await setUsers(sortedUsers);
    })();
  }, []);
  /*Once we retrieve all the listings on the marketplace we compare the listed NFTs assetContractAddress to the collection
    address and find the listing with the lowest value from each collection. Once this is done we add the floor price variable to each collection.*/
  useEffect(() => {
    if (!listings) return;
    listings.map((listing: any) => {
      collections.map((collection: any) => {
        let listingPrices: any = [];
        if (listing.assetContractAddress === collection.contractAddress) {
          listingPrices.push(listing.buyoutCurrencyValuePerToken.displayValue);
        }
        collection.floorPrice = Math.min(...listingPrices);
      });
    });
    setIsLoading(false);
  }, [listings]);
  return (
    <div className="overflow-hidden">
      <Navbar />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {' '}
          <div className="w-full h-8 text-white font-bold text-4xl text-center mt-4">
            {!toggleUsers ? 'Collection Rankings' : 'User Rankings'}
          </div>
          <div className="mx-4 mt-2 flex justify-center">
            {' '}
            <button
              type="button"
              onClick={() => setToggleUsers(!toggleUsers)}
              className="text-white w-2/6 mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full white-and-blue-glassmorphism cursor-pointer py-2 px-7"
            >
              {!toggleUsers ? 'View User Ranking' : 'View Collection Rankings'}
            </button>
          </div>
          <div className={style.tableHeader}>
            {!toggleUsers ? (
              <>
                <div className={style.tableColumn} />
                <div className={style.tableColumn}>Collection</div>
                <div className={style.tableColumn}>Volume</div>
                <div className={style.tableColumn}>Floor Price</div>
                <div className={style.tableColumn}>Sales</div>
              </>
            ) : (
              <>
                <div className={style.tableColumn} />
                <div className={style.tableColumn}>Username</div>
                <div className={style.tableColumn}>TURF Coins</div>
              </>
            )}
          </div>
          {!toggleUsers ? (
            <>
              {' '}
              <div className="w-11/12 flex flex-col mx-auto">
                {currentPost?.map((collection: any, id: any) => (
                  <CollectionItem collection={collection} key={id} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="w-11/12 flex flex-col mx-auto">
                {currentPost?.map((user: any, id: any) => (
                  <UserItem user={user} key={id} />
                ))}
              </div>
            </>
          )}
          <div className="text-white">
            {' '}
            <Pagination
              totalPosts={!toggleUsers ? collections?.length : users.length}
              postPerPage={postPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
