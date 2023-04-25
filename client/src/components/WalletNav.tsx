import React, { useEffect, useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { me } from '../adapters/user';
import { shortenAddress } from '../utils/shortenAddress';

interface WalletProps {}

export const WalletNav: React.FC<any> = ({}) => {
  const Web3 = require('web3');
  const convert = require('ether-converter');
  /*me query checks if the user is logged in. If the user is logged in the server responds 
  with the user data. isLoading represents the processing time to pull the user data. isError is triggered
  if the server has issues pulling the data*/
  const { data } = useQuery('me', me);
  const [walletAddress, setWalletAddress]: any = useState();
  const [walletEthereumBalance, setWalletEthereumBalance]: any = useState();
  let web3 = new Web3(window.ethereum);
  useEffect(() => {
    (async () => {
      await me();
      let walletAddress: any = await web3.eth.getAccounts();
      let walletBalance: any = await web3.eth.getBalance(walletAddress[0]);
      await setWalletAddress(shortenAddress(walletAddress[0]));
      let result = await convert(walletBalance, 'wei');
      setWalletEthereumBalance(Number(result.ether));
    })();
  }, []);
  return (
    <div className="flex flex-col w-full text-white">
      <div className="flex flex-row w-full items-center px-4">
        <div className="flex justify-start w-1/2">
          <div className="text-lg">My Wallet</div>
        </div>
        <div className="flex justify-end w-1/2">
          <div className="text-lg">{walletAddress}</div>
        </div>
      </div>
      <div className="border-white border-[1px] h-32 w-full mx-auto mt-8 rounded-md flex flex-col">
        <div className="w-full text-bold h-1/2 border-b border-white flex justify-center items-center text-lg">
          <p>Total Balance</p>
        </div>
        <div className="flex flex-row w-full h-1/2">
          <div className="w-1/2 border-r-[1px] border-white flex flex-row items-center">
            {' '}
            <FaEthereum className="mx-2" />
            <p className="mr-2">ETH</p>
            <p>
              {walletEthereumBalance &&
                Math.round(100 * walletEthereumBalance) / 100}
            </p>
          </div>
          <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center ">
              {' '}
              <HiOutlineCurrencyDollar className="mx-1" />
              <p className="mr-2">TURF Coins</p>
            </div>
            <p>{Math.round(100 * data?.turfCoins) / 100}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
