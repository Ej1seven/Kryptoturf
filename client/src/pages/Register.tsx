import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { register, user, me } from '../adapters/user';
import { Loader } from '../components/Loader';
import { useWeb3 } from '@3rdweb/hooks';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';

interface RegisterProps {}
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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

export const Register: React.FC<RegisterProps> = ({}) => {
  const { connectWallet, currentAccount } = useContext(TransactionContext);
  const navigate = useNavigate();
  const { ethereum } = window;
  const { data, isError, refetch } = useQuery('me', me);
  const { address } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const handleChange = (e: any, name: any) => {
    console.log(e.target.value);
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleSubmit = async (e: any) => {
    const { username, email, password } = formData;
    console.log(address);
    if (!address) {
      let connectWalletPrompt = window.confirm(
        'You need to connect your wallet to create a new account. Would you like to connect your wallet now?'
      );
      if (connectWalletPrompt) {
        connectWallet();
      } else {
        return;
      }
    }
    console.log(address);
    e.preventDefault();
    if (!username || !email || !password || !address) return;
    await register(username, email, password, address);
    if (user) {
      console.log(user);
      navigate('/login');
    }
  };
  // Detect change in Metamask account
  useEffect(() => {
    if (ethereum) {
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
    me();
    if (data?.id) {
      // if the user is not logged in the router will take the user to the login page
      //once the user logs in the router with proceed forward by taking the end user to their intended page
      alert('Please logout before creating a new user');
      navigate('/');
    }
  });
  return (
    <div className="flex justify-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
        <p className="text-white text-2xl text-left w-full pb-8">Sign Up</p>

        <Input
          placeholder="Username"
          name="username"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Email"
          name="email"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Password"
          name="password"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        {!currentAccount && (
          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <p className="text-white text-base font-semibold">Connect Wallet</p>
          </button>
        )}
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {isLoading ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};
