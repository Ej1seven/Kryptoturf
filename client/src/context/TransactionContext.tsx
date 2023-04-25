import React, { useEffect, useState } from 'react';
import { ethers, Transaction } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    ethereum?: any;
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
/*The following statement detects if the web browser has Metamask installed */
const { ethereum } = window;
/*If the user does have Metamask installed the page will reload if the user changes to another network. For example, if the user changed from Goerli to Mumbia the page will reload.  */
if (ethereum) {
  ethereum.on('chainChanged', (_chainId: any) => window.location.reload());
}

const getEthereumContract = async () => {
  let transactionContract;
  /*The ethers.js library aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem. The following statement provides a connection to the Ethereum network.*/
  const provider = new ethers.providers.Web3Provider(ethereum);
  /*A Signer in ethers is an abstraction of an Ethereum Account, which can be used to sign messages and transactions and send signed transactions to the Ethereum Network to execute state changing operations. The provider.getSigner(address) in ethers.js, takes in an address and creates a JsonRpcSigner instance, which uses the appropriate methods in from field when submitting a transaction*/
  const signer = provider.getSigner();
  /*A Contract is an abstraction of code that has been deployed to the blockchain. transactionContract will  trigger its code to be run with the input of the transaction data.  */
  transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
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
          text: 'Please install Metamask',
          background: '#180c1a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const transactionContract = await getEthereumContract();
      /* availableTransactions - gets all the transactions tied the to contract that has matching contractAddress,
        contractABI, and signer */
      const availableTransactions =
        await transactionContract.getAllTransactions();
      /*Structures all the transactions to display addressTo, addressFrom, timestamp, message, keyword, and amount */
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
      /*Removed the first 19 test transactions */
      await structuredTransactions.splice(0, 19);
      /*Adds the structured transactions to an array which will used in the <Transactions /> component 
      to display each transaction on individual cards*/
      setTransactions(structuredTransactions);
    } catch (error: any) {
      throw new Error(error);
    }
  };
  /*checkIfWalletIsConnected- checks if the user's Metamask account is currently connected to Krytoturf */
  const checkIfWalletIsConnected = async () => {
    try {
      /*If the user is not connected to their Metamask account a modal will appear instructing the user
        to please install Metamask */
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install Metamask, and make sure you are connected to the Goerli Test Network before attempting to create an account or buy/sell NFTs!',
          background: '#180c1a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      /*Checks how many accounts are connected to Kryptoturf and sets the first account to 
        currentAccount. */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        return 'No accounts found';
      }
    } catch (error) {
      throw new Error('No ethereum object.');
    }
  };
  /*Checks is the connected account has any transactions */
  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = await getEthereumContract();
      /*Gets the total number of transactions created by the user */
      const transactionCount = await transactionContract.getTransactionCount();
      /*sets the total number of transcation in local storage */
      window.localStorage.setItem('transactionCount', transactionCount);
    } catch (error) {
      throw new Error('No ethereum object.');
    }
  };
  /*Connects the users Metamask wallet to Kryptoturf */
  const connectWallet = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install metamask and refresh page',
          background: '#180c1a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      throw new Error('No ethereum object.');
    }
  };
  /*sends the users transactions data to the blockchain */
  const sendTransaction = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: 'info',
          text: 'Please install Metamask',
          background: '#180c1a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();
      /*parsedAmount takes the ether value and converts it to a BigNumber*/
      const parsedAmount = ethers.utils.parseEther(amount);
      /*Sends the transaction to the blockchain with the following params: from, to, gas fee, and value. */
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
      /*Adds the transaction to the blockchain. */
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      await transactionHash.wait();
      setIsLoading(false);
      /*After the transaction has been added to the blockchain transactionCount gets the new transaction count. */
      const transactionCount = await transactionContract.getTransactionCount();
      /*Sets the new transaction count */
      setTransactionCount(transactionCount.toNumber());
      return 'success';
    } catch (error: any) {
      throw new Error(error);
    }
  };
  /*When TransactionContext is first loaded it checks if the users wallet is connected and how many transactions exist. */
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
