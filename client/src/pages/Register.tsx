import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { register, me } from '../adapters/user';
import { Loader } from '../components/Loader';
import { useWeb3 } from '@3rdweb/hooks';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { Navbar } from '../components';
import Swal from 'sweetalert2';

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
    className="my-2 w-full max-w-[400px] rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer"
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

export const Register: React.FC<RegisterProps> = ({}) => {
  const { connectWallet, currentAccount } = useContext(TransactionContext);
  const navigate = useNavigate();
  const { ethereum } = window;
  const { data } = useQuery('me', me);
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
    let error: any = null;
    let user: any = null;
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
    if (!username || !email || !password || !address)
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out the required fields',
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    setIsLoading(true);
    await register(username, email, password, address).then((res) => {
      user = res;
    });
    setIsLoading(false);
    if (user) {
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
    <div className=" overflow-hidden">
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="p-5 w-96 sm:w-4/6 max-w-[700px] flex flex-col justify-start items-center blue-glassmorphism">
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
              type="email"
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
                <p className="text-white text-base font-semibold">
                  Connect Wallet
                </p>
              </button>
            )}
            <div className="h-[1px] w-full bg-gray-400 my-2 max-w-[400px]" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 p-2 rounded-full cursor-pointer btn-gradient-border max-w-[400px]"
              >
                Register
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
