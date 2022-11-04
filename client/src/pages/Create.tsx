import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import collection from '../../src/images/collection.png';
import nft from '../../src/images/trading-card.png';
import { useQuery } from 'react-query';
import { me } from '../adapters/user';
import Swal from 'sweetalert2';

interface CreateProps {}

export const Create: React.FC<any> = ({}) => {
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*me query checks if the user is logged in. If the user is logged in the server responds 
    with the user data. isLoading represents the processing time to pull the user data. isError is triggered
    if the server has issues pulling the data*/
  const { data } = useQuery('me', me);
  /*When the user clicks the Create Collection or Create NFT button, handleClick is triggered. If the user is not logged in to their account 
    an error message pops up letting the end user know they need to login. If the user is logged in
    the page will redirect to requested page. */
  const handleClick = (option: any) => {
    if (!data?.id) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must first login to create a ${option}`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    option === 'collection' && navigate('/createCollection');
    option === 'NFT' && navigate('/createNFT');
  };
  return (
    <div className=" overflow-hidden">
      <Navbar />
      <div className="w-full md:h-screen grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-6 smMAX:gap-y-12 smMAX:w-3/4 smMAX:m-auto smMAX:mt-20 place-items-center">
        <div
          className="flex flex-col rounded-md border-[1px] border-white m-1 items-center justify-center py-2 white-and-blue-glassmorphism h-64 w-3/4 max-w-sm m-auto lg:h-80 cursor-pointer btn-gradient-border"
          onClick={() => handleClick('collection')}
        >
          <div>
            <p className="font-bold text-xl text-white mb-4">
              Create Collection
            </p>
          </div>
          <div className="flex justify-center">
            <img className="w-3/4" src={collection} alt="" />
          </div>
        </div>
        <div
          className="flex flex-col rounded-md border-[1px] border-white m-1 items-center justify-center py-2 white-and-blue-glassmorphism h-64 w-3/4 max-w-sm m-auto lg:h-80 cursor-pointer btn-gradient-border"
          onClick={() => handleClick('NFT')}
        >
          <div>
            <p className="font-bold text-xl text-white mb-4">Create NFT</p>
          </div>
          <div className="flex justify-center">
            <img className="w-3/4" src={nft} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
