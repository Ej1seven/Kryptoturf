import React from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

interface PaginationProps {}
/*Pagination component is used to toggle between pages */
export const Pagination: React.FC<any> = ({
  totalPosts,
  postPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pages.push(i);
  }
  return (
    <div className="flex flex-row justify-center">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        className="disabled:opacity-0 text-2xl"
        disabled={currentPage <= 1}
      >
        <BiLeftArrow />
      </button>
      <p className="text-2xl">{currentPage}</p>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= pages.length}
        className="disabled:opacity-0 text-2xl"
      >
        <BiRightArrow />
      </button>
    </div>
  );
};
