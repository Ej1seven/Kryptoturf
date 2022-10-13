import React from 'react';
import { GiDrop, GiGroupedDrops } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

interface CreateProps {}

export const Create: React.FC<any> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className=" overflow-hidden">
      <Navbar />
      <div className="mt-36 w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-6 place-items-center">
        <div
          className="flex flex-col rounded-md border-[1px] border-white m-1 items-center justify-center py-2 bg-white/10 h-64 w-3/4 m-auto lg:h-80"
          onClick={() => navigate('/createCollection')}
        >
          <div>
            <p className="font-bold text-xl text-white mb-14">
              Create Collection
            </p>
          </div>
          <div>
            <GiGroupedDrops fontSize="4em" color="#2081e2" />
          </div>
        </div>
        <div
          className="flex flex-col rounded-md border-[1px] border-white m-1 items-center justify-center py-2 bg-white/10 h-64 w-3/4 m-auto lg:h-80"
          onClick={() => navigate('/createNFT')}
        >
          <div>
            <p className="font-bold text-xl text-white mb-14">Create NFT</p>
          </div>
          <div>
            <GiDrop fontSize="4em" color="#2081e2" />
          </div>
        </div>
      </div>
    </div>
  );
};
