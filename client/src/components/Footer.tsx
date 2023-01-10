import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../src/images/logo.png';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className="w-64" />
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <a
            href="https://nftplazas.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <p className="text-white text-base text-glow text-center mx-2 cursor-pointer">
              Market
            </p>
          </a>
          <p className="text-white text-base text-glow text-center mx-2 cursor-pointer">
            <a href="mailto:erikhunter@erikhunter.dev">Feedback</a>
          </p>
          <p
            className="text-white text-base text-glow text-center mx-2 cursor-pointer"
            onClick={() => navigate('/collections')}
          >
            Explore
          </p>
          <p
            className="text-white text-base text-glow text-center mx-2 cursor-pointer"
            onClick={() => navigate('/resources')}
          >
            Resources
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-small text-center">Come join us</p>
        <p className="text-white text-small text-center">
          erikhunter@erikhunter.dev
        </p>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-40 mt-5" />
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        {' '}
        <p className="text-white text-small text-center">@kryptoturf 2022</p>
        <p className="text-white text-small text-center">All rights reserved</p>
      </div>
    </div>
  );
};
