import React, { useEffect, useState } from 'react';
import { ethers, Transaction } from 'ethers';
import {
  contractABI,
  contractAddress,
  contractAddressTwo,
} from '../utils/constants';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface TransactionContextValue {
  connectWallet: any;
  currentAccount: any;
  formData: any;
  setFormData: any;
  handleChange: any;
  sendTransaction: any;
  transactions: any;
  isLoading: boolean;
}

export const TransactionContext = React.createContext<TransactionContextValue>(
  undefined!
);

const { ethereum } = window;
if (ethereum) {
  ethereum.on('chainChanged', (_chainId: any) => window.location.reload());
}

const getEthereumContract = async () => {
  let transactionContract;
  const chainId = await ethereum.request({
    method: 'eth_chainId',
  });
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  if (chainId === '0x3') {
    transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
  } else {
    transactionContract = new ethers.Contract(
      contractAddressTwo,
      contractABI,
      signer
    );
  }
  return transactionContract;
};

export const TransactionProvider: React.FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  );
  const [transactions, setTransactions] = useState([]);
  const handleChange = (e: any, name: any) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install metamask',
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const transactionContract = await getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();
      const structuredTransactions = availableTransactions.map(
        (transaction: any) => ({
          addressTo: transaction.reciever,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );
      console.log(availableTransactions);
      console.log(structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install metamask',
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log('No accounts found');
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error('No ethereum object.');
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = await getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem('transactionCount', transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error('No ethereum object.');
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install metamask',
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error('No ethereum object.');
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install metamask',
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const { addressTo, amount, keyword, message } = formData;
      console.log(addressTo);
      const transactionContract = await getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // 21000 GWEI
            value: parsedAmount._hex, // 0.00001
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
