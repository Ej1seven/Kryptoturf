import React, { useEffect, useState } from 'react';
import { CgArrowsExchangeV } from 'react-icons/cg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { EventItem } from './EventItem';
import { getTransactions } from '../adapters/marketItems';
import { Pagination } from './Pagination';

interface ItemActivityProps {}

const style = {
  wrapper: `w-full mt-8 border border-[#151b22] rounded-xl bg-[#303339] overflow-hidden`,
  title: `bg-[#262b2f] px-6 py-4 flex items-center`,
  titleLeft: `flex-1 flex items-center text-xl font-bold`,
  titleIcon: `text-3xl mr-2`,
  titleRight: `text-xl`,
  filter: `flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]`,
  filterTitle: `flex-1`,
  tableHeader: `flex w-full bg-[#262b2f] border-y border-[#151b22] mt-8 px-4 py-1`,
  tableColumn: `w-1/5`,
  eventItem: `flex px-4`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
};

export const ItemActivity: React.FC<any> = ({
  collectionContractAddress,
  id,
}) => {
  const [toggle, setToggle] = useState(true);
  const [nftTransactions, setNftTransactions]: any = useState();
  const [currentPage, setCurrentPage]: any = useState(1);
  const [postPerPage, setPostPerPage]: any = useState(5);
  const lastPostIndex = currentPage + postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPost = nftTransactions?.slice(firstPostIndex - 1, lastPostIndex);
  useEffect(() => {
    (async () => {
      setNftTransactions(await getTransactions(collectionContractAddress, id));
    })();
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <CgArrowsExchangeV />
          </span>
          Item Activity
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div /*className={style.activityTable}*/>
          <div className={style.filter}>
            <div className={style.filterTitle}>Filter</div>
            <div /*className={style.filterIcon}*/>
              {' '}
              <AiOutlineDown />{' '}
            </div>
          </div>
          <div className={style.tableHeader}>
            <div className={style.tableColumn}>Event</div>
            <div className={style.tableColumn}>Price</div>
            <div className={style.tableColumn}>From</div>
            <div className={style.tableColumn}>To</div>
            <div className={style.tableColumn}>Date</div>
          </div>
          <div>
            {currentPost?.map((transaction: any, id: any) => (
              <EventItem key={id} transaction={transaction} />
            ))}
          </div>
          <Pagination
            totalPosts={nftTransactions?.length}
            postPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};
