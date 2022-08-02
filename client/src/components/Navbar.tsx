import React, { useState } from 'react';
import logo from '../../src/images/logo.png';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { me, logout, token } from '../adapters/user';
import { HiMenu, HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { MdAccountBalanceWallet } from 'react-icons/md';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useQuery('me', me, {
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
  });
  const [toggleMenu, setToggleMenu] = useState(false);
  const queryClient = useQueryClient();
  const NavbarItem = ({
    title,
    classProps,
  }: {
    title?: any;
    classProps?: any;
  }) => {
    return (
      <li className={`mx-4 cursor-pointer ${classProps}`} onClick={navigateTo}>
        {title}
      </li>
    );
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    (await !data?.id) ? navigate('/login') : logout();
    await me();
    await queryClient.invalidateQueries('me');
    window.location.reload();
  };
  const navigateTo: any = (e: any) => {
    switch (e.target.innerText) {
      case 'Collection':
        navigate('/collection/0xFB1C5578629F802Ee2393a05ADffc4c665DC3ea8');
        break;
      case 'Stats':
        navigate('/stats');
        break;
      case 'Resources':
        navigate('/resources');
        break;
      case 'Create':
        navigate('/create');
        break;
      case 'Profile':
        navigate('/profile');
        break;
      case 'Wallet':
        navigate('/wallet');
        break;
      case 'Login':
        navigate('/login');
        break;
    }
  };
  return (
    <div className="w-full flex md:justify-center justify-between items-center">
      <div className="flex-1 md:flex-[0.5] sm:flex-[1] justify-center items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="cursor-pointer"></img>
        </Link>
      </div>
      <div className="flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#27335966] rounded-[0.8rem] hover:bg-[#4c505c] border-[#ffffff4d] border-2">
        <div className="text-[#8a939b] mx-3 font-bold text-lg">
          <AiOutlineSearch />
        </div>
        <input
          className="h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]"
          placeholder="Search items, collections, and accounts"
        ></input>
      </div>
      <ul className="text-white md:flex  list-none flex-row justify-between items-center flex-initial">
        {['Collection', 'Stats', 'Resources', 'Create'].map((item, index) => (
          <div className="hidden lg:block">
            <NavbarItem key={item + index} title={item} />
          </div>
        ))}
        <div className=" text-3xl font-black px-4 hidden lg:block cursor-pointer">
          <Link to="/profile">
            <CgProfile />
          </Link>
        </div>
        <div className=" text-3xl font-black px-4 hidden lg:block cursor-pointer">
          <Link to="/wallet">
            <MdAccountBalanceWallet />
          </Link>
        </div>
        <div className="flex relative">
          {toggleMenu ? (
            <AiOutlineClose
              fontSize={28}
              className="text-white lg:hidden mx-2 cursor-pointer"
              onClick={() => setToggleMenu(false)}
            />
          ) : (
            <HiMenuAlt4
              fontSize={28}
              className="text-white lg:hidden mx-2 cursor-pointer"
              onClick={() => setToggleMenu(true)}
            />
          )}
          {toggleMenu && (
            <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-md text-white animate-slide-in blue-glassmorphism ">
              <li className="text-xl w-full my-2">
                <AiOutlineClose onClick={() => setToggleMenu(false)} />
              </li>
              {[
                'Collection',
                'Stats',
                'Resources',
                'Create',
                'Profile',
                'Wallet',
              ].map((item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classProps="my-2 text-lg"
                />
              ))}
              <li
                className="mx-4 cursor-pointer my-2 text-lg md:hidden"
                onClick={handleSubmit}
              >
                {isLoading
                  ? 'Loading'
                  : isError
                  ? 'Something went wrong'
                  : !data?.id
                  ? 'Login'
                  : 'Logout'}
              </li>
            </ul>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full hidden md:block cursor-pointer hover:bg-[#2546bd]"
        >
          {isLoading
            ? 'Loading'
            : isError
            ? 'Something went wrong'
            : !data?.id
            ? 'Login'
            : 'Logout'}
        </button>
      </ul>
    </div>
  );
};
