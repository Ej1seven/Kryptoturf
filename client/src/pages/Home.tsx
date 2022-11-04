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

export const Home: React.FC<HomeProps> = ({}) => {
  /*me query checks if the user is logged in. If the user is logged in the server responds 
    with the user data */
  const { data } = useQuery('me', me);
  useEffect(() => {
    /*If the user is logged in a toast message will prompt */
    if (data?.id) {
      toast.success(`Welcome back ${data.username}`, {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      });
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
