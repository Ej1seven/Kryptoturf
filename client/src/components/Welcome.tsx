import React, { useContext } from 'react';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { TransactionContext } from '../context/TransactionContext';
import { Loader } from './';
import { shortenAddress } from '../utils/shortenAddress';
import { useNavigate } from 'react-router-dom';

interface WelcomeProps {}
/*custom input component used on the ethereum transfer form */
const Input = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
}: {
  placeholder: any;
  name: String;
  type: any;
  value: any;
  handleChange: any;
}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer"
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

export const Welcome: React.FC<WelcomeProps> = ({}) => {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    /*destructures the following fields from the form object */
    const { addressTo, amount, keyword, message } = formData;
    e.preventDefault();
    /*All fields must be filled out before submitting form. If not, an error message will popup */
    if (!addressTo || !amount || !keyword || !message)
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields must be filled out to send Ethereum!',
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    (async () => {
      /*sendTransaction() - send transfer transaction to the blockchain */
      const transactionResponse = await sendTransaction();
      /*If the transaction fails to go through a modal pops up 
        with the corresponding error message */
      if (transactionResponse.code) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${transactionResponse.message}`,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      }
      /*If the transaction is successful a modal pops up informing the user the transaction was successful. The page reloads and the new transaction is visible in the <Transactions /> section on the homepage */
      if (transactionResponse === 'success') {
        return Swal.fire({
          icon: 'success',
          title: 'Transaction Complete',
          text: `You've successfully transferred ${amount} ETH to account ${addressTo}`,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    })();
  };
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto
            <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily on
            Kryptoturf.
          </p>
          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${commonStyles}`}>Reliability</div>
            <div className={`${commonStyles}`}>Security</div>
            <div className={`rounded-tr-2xl ${commonStyles}`}>Ethereum</div>
            <div className={`rounded-bl-2xl ${commonStyles}`}>Web 3.0</div>
            <div className={` ${commonStyles}`}>Low Fees</div>
            <div className={`rounded-br-2xl ${commonStyles}`}>Blockchain</div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {shortenAddress(currentAccount)}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input
              placeholder="Address to"
              name="addressTo"
              type="text"
              handleChange={handleChange}
              value={null}
            />
            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="number"
              handleChange={handleChange}
              value={null}
            />
            <Input
              placeholder="Keyword (Gif)"
              name="keyword"
              type="text"
              handleChange={handleChange}
              value={null}
            />
            <Input
              placeholder="Enter Message"
              name="message"
              type="text"
              handleChange={handleChange}
              value={null}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 p-2 rounded-full cursor-pointer btn-gradient-border"
              >
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
