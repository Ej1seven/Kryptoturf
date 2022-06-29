import React, { useEffect } from 'react';
import {
  Navbar,
  Welcome,
  Services,
  Transactions,
  Footer,
  Hero,
} from '../components';
import { useQuery } from 'react-query';
import { me } from '../adapters/user';
import toast, { Toaster } from 'react-hot-toast';

interface HomeProps {}

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
};

export const Home: React.FC<HomeProps> = ({}) => {
  const { data, isLoading, isError, refetch } = useQuery('me', me);
  console.log(process.env);
  useEffect(() => {
    if (data?.id) {
      // if the user is not logged in the router will take the user to the login page
      //once the user logs in the router with proceed forward by taking the end user to their intended page
      // navigate('/');
      toast.success(`Welcome back ${data.username}`, {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      });
      console.log(data.username);
    }
  }, [data]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <Navbar />
        <Hero />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </>
  );
};
