import React from 'react';
import { Navbar, Welcome, Services, Transactions, Footer } from '../components';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <>
      <div>
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </>
  );
};
