import React from 'react';
import {
  Navbar,
  Welcome,
  Services,
  Transactions,
  Footer,
  Hero,
} from '../components';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <>
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
