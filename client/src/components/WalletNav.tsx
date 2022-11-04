import React, { useEffect, useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { getUserData } from '../adapters/user';
import { Navbar } from '.';
import { shortenAddress } from '../utils/shortenAddress';

interface WalletProps {}

export const WalletNav: React.FC<any> = ({}) => {
  const { ethereum } = window;
  const Web3 = require('web3');
  const convert = require('ether-converter');
  const [walletAddress, setWalletAddress]: any = useState();
  const [walletEthereumBalance, setWalletEthereumBalance]: any = useState();
  const [walletTurfCoinsBalance, setWalletTurfCoinsBalance]: any = useState();
  let web3 = new Web3(window.ethereum);
  useEffect(() => {
    (async () => {
      let walletAddress: any = await web3.eth.getAccounts();
      let walletBalance: any = await web3.eth.getBalance(walletAddress[0]);
      await setWalletAddress(shortenAddress(walletAddress[0]));
      let result = await convert(walletBalance, 'wei');
      let userData = await getUserData(walletAddress[0]);
      setWalletEthereumBalance(Number(result.ether));
      setWalletTurfCoinsBalance(userData.turfCoins);
    })();
  }, []);
  console.log(walletEthereumBalance);
  console.log(walletTurfCoinsBalance);
  console.log(walletAddress);
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
            <p>{Math.round(100 * walletEthereumBalance) / 100}</p>
          </div>
          <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center ">
              {' '}
              <HiOutlineCurrencyDollar className="mx-1" />
              <p className="mr-2">TURF Coins</p>
            </div>
            <p>{Math.round(100 * walletTurfCoinsBalance) / 100}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
