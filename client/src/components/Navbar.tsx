import React, { useContext, useEffect, useState } from 'react';
import logo from '../../src/images/logo.png';
import mobileLogo from '../../src/images/mobileLogo.png';
import { useQuery, useQueryClient } from 'react-query';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { me, logout } from '../adapters/user';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { Wallet } from '../pages/Wallet';
import Swal from 'sweetalert2';
import { TransactionContext } from '../context/TransactionContext';
import { WalletNav } from './WalletNav';
import { getCollections } from '../adapters/marketItems';
import useMarkeplaceData from '../hooks/useMarketplaceData';
import { Pagination } from './Pagination';

interface NavbarProps {}
const SearchInput = ({
  id,
  placeholder,
  name,
  type,
  value,
  searchCollections,
  toggleCollectionsAndNFTSDropdown,
}: {
  id: any;
  placeholder: any;
  name: String;
  type: any;
  value: any;
  searchCollections: any;
  toggleCollectionsAndNFTSDropdown: any;
}) => (
  <input
    id={id}
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    className="h-[2.6rem] w-full border-0 bg-transparent outline-0 focus:ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b] cursor-pointer"
    onKeyUp={(e) => searchCollections(e)}
    onClick={(e) => toggleCollectionsAndNFTSDropdown(e)}
  />
);
const SearchInputMobile = ({
  id,
  placeholder,
  name,
  type,
  value,
  searchCollections,
  toggleCollectionsAndNFTSDropdownMobile,
}: {
  id: any;
  placeholder: any;
  name: String;
  type: any;
  value: any;
  searchCollections: any;
  toggleCollectionsAndNFTSDropdownMobile: any;
}) => (
  <input
    id={id}
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    className="h-[2.6rem] w-full border-2 bg-black rounded-t-md outline-0 focus:ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b] cursor-pointer"
    onKeyUp={(e) => searchCollections(e)}
    onClick={(e) => toggleCollectionsAndNFTSDropdownMobile(e)}
  />
);

export const Navbar: React.FC<NavbarProps> = ({}) => {
  /*currentAccount - gets the account of the user currently connected to Metamask */
  const { currentAccount } = useContext(TransactionContext);
  /*useNavigate() allows you to route to other pages */
  const navigate = useNavigate();
  /*me query checks if the user is logged in. If the user is logged in the server responds 
    with the user data. isLoading represents the processing time to pull the user data. isError is triggered
    if the server has issues pulling the data*/
  const { data, isLoading, isError } = useQuery('me', me, {
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
  });
  /*Displays a popup menu that appears from the right side of the screen.This popup menu is
    only available on smaller screens */
  const [toggleMenu, setToggleMenu] = useState(false);
  /*Displays a popup menu that appears from the right side of the screen 
    when the wallet icon is clicked */
  const [toggleWallet, setToggleWallet] = useState(false);
  const [toggleSearchBar, setToggleSearchBar] = useState(false);
  /*Pulls all the collections from the database and puts them in the collections array */
  const [collections, setCollections]: any = useState([]);
  /*Pulls all the NFTs from each collection and puts then into the allNFTS array */
  const [allNfts, setAllNfts]: any = useState([]);
  /*Pulls all the NFTs from each collection and puts then into the allNFTS array */
  const [collectionsAndNFTS, setCollectionsAndNFTS]: any = useState([]);
  /*toggles the collections and NFTS dropdown menu */
  const [displayCollectionsAndNFTS, setDisplayCollectionsAndNFTS] =
    useState(false);
  /*toggles the collections and NFTS dropdown menu */
  const [displayCollectionsAndNFTSMobile, setDisplayCollectionsAndNFTSMobile] =
    useState(false);
  /*The useQueryClient hook returns the instance of the current QueryClient in the application.*/
  const queryClient = useQueryClient();
  /*Determines if the NFT is listed on the marketplace. If so, the listing price will display on the NFT card. */
  const [isListed, setIsListed] = useState(false);
  const [currentPage, setCurrentPage]: any = useState(1);
  const [postPerPage, setPostPerPage]: any = useState(5);
  const lastPostIndex = currentPage + postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPost = collectionsAndNFTS?.slice(
    firstPostIndex - 1,
    lastPostIndex
  );
  /*NavbarItem is used to list each item on the nav bar. This function takes the title argument and any
    additional css properties*/
  const NavbarItem = ({
    title,
    classProps,
  }: {
    title?: any;
    classProps?: any;
  }) => {
    return (
      <li
        className={title && `mx-4 cursor-pointer ${classProps}`}
        onClick={navigateTo}
      >
        <p className="text-glow"> {title}</p>
      </li>
    );
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    /*If the user is not logged in they will be sent to the login page after clicking 
      the button, otherwise the user will be logged out */
    (await !data?.id) ? navigate('/login') : logout();
    /*If the user is logged out the access and refresh tokens will be removed. 
      Once this happens we run me() to check for the tokens*/
    await me();
    /*invalidateQueries is used to rerender the me query. This allows the front-end to 
      recognize the access and refresh tokens are no longer available */
    await queryClient.invalidateQueries('me');
    /*The page is reloaded and the user is no longer logged in*/
    window.location.reload();
  };
  /*navigateTo takes the title argument and routes the user to the 
    corresponding page*/
  const navigateTo: any = (e: any) => {
    switch (e.target.innerText) {
      case 'Explore':
        {
          currentAccount && data?.id && navigate('/collections');
        }
        break;
      case 'Stats':
        navigate('/stats');
        break;
      case 'Resources':
        navigate('/resources');
        break;
      case 'Create':
        {
          currentAccount && data?.id && navigate('/create');
        }
        break;
      case 'Profile':
        {
          currentAccount && data?.id
            ? navigate('/profile')
            : Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please login to view your profile',
                background: '#19191a',
                color: '#fff',
                confirmButtonColor: '#2952e3',
              });
        }
        break;
      case 'Wallet':
        {
          currentAccount && data?.id
            ? navigate('/wallet')
            : Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please connect your Metamask wallet to view your funds',
                background: '#19191a',
                color: '#fff',
                confirmButtonColor: '#2952e3',
              });
        }
        break;
      case 'Login':
        navigate('/login');
        break;
    }
  };
  /*Toggles the collections dropdown menu */
  const toggleCollectionsAndNFTSDropdown = (e: any) => {
    setCollectionsAndNFTS(collections.concat(allNfts));
    setDisplayCollectionsAndNFTS(!displayCollectionsAndNFTS);
  };
  const toggleCollectionsAndNFTSDropdownMobile = (e: any) => {
    setCollectionsAndNFTS(collections.concat(allNfts));
    setDisplayCollectionsAndNFTSMobile(true);
  };

  const searchCollections = (e: any) => {
    !displayCollectionsAndNFTS && setDisplayCollectionsAndNFTS(true);
    let input = e.target.value;
    input = input.toLowerCase();
    let collections = document.getElementsByClassName('collection');
    for (let i = 0; i < collections.length; i++) {
      if (
        !collections[i].innerHTML.toLowerCase().startsWith(input.toLowerCase())
      ) {
        collections[i].classList.add('hidden');
      } else {
        collections[i].classList.remove('hidden');
      }
    }
  };
  let collectionInput: any = document.getElementById('search-bar');
  /*Changes the collection input to the selected item */
  const changeSearchInput = (e: any, collection: any) => {
    const params = {
      isListed: `${isListed}`,
      collection: `${collection.collectionContractAddress}`,
    };
    collectionInput.value = e.target.outerText;
    /*Checks if the current NFT is listed on the marketplace */
    const listing = listings.find(
      (listing: any) =>
        listing.asset.id.toNumber() === collection.nft.metadata.id.toNumber() &&
        collection.collectionContractAddress === listing.assetContractAddress
    );
    /*If the NFT is listed on the marketplace setIsListed is set to true and 
          the listing price is displayed */
    if (Boolean(listing)) {
      setIsListed(true);
    }
    collection.title
      ? navigate(`/collection/${collection.contractAddress}`)
      : window.location.replace(
          `/nfts/${collection.nft.metadata.id}?${createSearchParams(params)}`
        );
  };
  const { marketPlaceModule, listings } = useMarkeplaceData();
  /*Recognizes when the user has selected a different collection and hides the dropdown afterwards */
  document.addEventListener('click', (event) => {
    const isClickInside = collectionInput.contains(event.target);
    if (!isClickInside) {
      setDisplayCollectionsAndNFTS(false);
    } else if (isClickInside && !displayCollectionsAndNFTS) {
      setDisplayCollectionsAndNFTS(true);
    }
  });
  useEffect(() => {
    (async () => {
      const collections = await getCollections();
      await setCollections(collections);
    })();
  }, []);
  useEffect(() => {
    if (!marketPlaceModule) return;
    let allNftsArray: any = [];

    for (let x = 0; x <= collections.length - 1; x++) {
      (async () => {
        const contract = await marketPlaceModule.getNFTCollection(
          collections[x].contractAddress
        );
        const allNfts = await contract.getAll();
        allNfts.map((nft: any) => {
          let nftObject = {
            nft: nft,
            collectionContractAddress: collections[x].contractAddress,
            createdBy: collections[x].createdBy,
          };
          allNftsArray.push(nftObject);
        });
      })();
      setAllNfts(allNftsArray);
    }
  }, [marketPlaceModule]);
  let searchInputElement: any = document.getElementById('search-bar');

  return (
    <div className="w-full flex justify-between items-center px-4 pt-4">
      <div className="hidden md:block flex-1 md:flex-[0.5] sm:flex-[1] justify-center items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="cursor-pointer"></img>
        </Link>
      </div>
      <div className="md:hidden block justify-center items-center">
        <Link to="/">
          <img src={mobileLogo} alt="logo" className="h-8 cursor-pointer"></img>
        </Link>
      </div>
      {currentAccount && data?.id && (
        <>
          {' '}
          <div className="hide-search-bar flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#27335966] rounded-[0.8rem] hover:bg-[#4c505c] border-[#ffffff4d] border-2">
            <div className="text-[#8a939b] mx-3 font-bold text-lg">
              <AiOutlineSearch />
            </div>
            <SearchInput
              toggleCollectionsAndNFTSDropdown={
                toggleCollectionsAndNFTSDropdown
              }
              placeholder="Search items, collections, and accounts"
              id="search-bar"
              name="search-bar"
              type="text"
              value={null}
              searchCollections={searchCollections}
            ></SearchInput>
            {displayCollectionsAndNFTS && (
              <>
                {' '}
                {currentPost.length > 0 && (
                  <div className="z-10 fixed top-[4rem]  p-3 w-1/2 max-w-xl min-width-[100px] h-1/2 shadow-2xl  list-none flex flex-col justify-start items-end rounded-md text-white animate-slide-down blue-glassmorphism">
                    {currentPost.map((collection: any, index: any) => {
                      if (index !== collections.length - 1) {
                        return (
                          <div
                            className="w-full  p-2 outline-none bg-transparent text-white text-sm border-b border-[#3d4f7c] collection  cursor-pointer"
                            onClick={(e) => changeSearchInput(e, collection)}
                          >
                            {collection.title
                              ? collection.title
                              : collection.nft.metadata.name}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="w-full  p-2 outline-none bg-transparent text-white text-sm border-b border-[#3d4f7c] collection  cursor-pointer"
                            onClick={(e) => changeSearchInput(e, collection)}
                          >
                            {collection.title
                              ? collection.title
                              : collection.nft.metadata.name}
                          </div>
                        );
                      }
                    })}
                    <div className="w-full">
                      <Pagination
                        totalPosts={collectionsAndNFTS?.length}
                        postPerPage={postPerPage}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-3/4 show-search-icon hidden text-3xl mr-2 text-white remove-margin">
            <div className="w-full flex justify-end px-4">
              {' '}
              <AiOutlineSearch
                onClick={() => setToggleSearchBar(!toggleSearchBar)}
              />
            </div>
            {toggleSearchBar && (
              <div className="w-screen z-[100] fixed bg-white inset-x-0 top-20 flex flex-col items-center h-1/2 rounded-md">
                {' '}
                <SearchInputMobile
                  toggleCollectionsAndNFTSDropdownMobile={
                    toggleCollectionsAndNFTSDropdownMobile
                  }
                  placeholder="Search items, collections, and accounts"
                  id="search-bar"
                  name="search-bar"
                  type="text"
                  value={null}
                  searchCollections={searchCollections}
                ></SearchInputMobile>
                {displayCollectionsAndNFTSMobile && (
                  <>
                    {' '}
                    {currentPost.length > 0 && (
                      <div className="p-3 w-full max-w-xl min-width-[100px] h-full shadow-2xl  list-none flex flex-col justify-start items-end rounded-md text-black animate-slide-down rounded-md">
                        {currentPost.map((collection: any, index: any) => {
                          if (index !== collections.length - 1) {
                            return (
                              <div
                                className="w-full  p-2 outline-none bg-transparent text-black text-sm border-b border-black font-bold collection  cursor-pointer"
                                onClick={(e) =>
                                  changeSearchInput(e, collection)
                                }
                              >
                                {collection.title
                                  ? collection.title
                                  : collection.nft.metadata.name}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                className="w-full  p-2 outline-none bg-transparent text-black text-sm border-b border-black font-bold collection  cursor-pointer"
                                onClick={(e) =>
                                  changeSearchInput(e, collection)
                                }
                              >
                                {collection.title
                                  ? collection.title
                                  : collection.nft.metadata.name}
                              </div>
                            );
                          }
                        })}
                        <div className="w-full">
                          <Pagination
                            totalPosts={collectionsAndNFTS?.length}
                            postPerPage={postPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="w-full flex justify-end pr-4 pb-4 absolute bottom-0">
                  <AiOutlineClose
                    onClick={() => setToggleSearchBar(!toggleSearchBar)}
                    color={'black'}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <ul className="text-white md:flex  list-none flex-row justify-between items-center flex-initial">
        {[
          currentAccount && data?.id && 'Explore',
          'Stats',
          'Resources',
          currentAccount && data?.id && 'Create',
        ].map((item, index) => (
          <div className="hidden lg:block">
            <NavbarItem key={item + index} title={item} />
          </div>
        ))}
        {currentAccount && data?.id && (
          <>
            <div className=" text-3xl font-black px-4 hidden lg:block cursor-pointer">
              <CgProfile
                onClick={() =>
                  data?.id
                    ? navigate('/profile')
                    : Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please login to view your profile',
                        background: '#19191a',
                        color: '#fff',
                        confirmButtonColor: '#2952e3',
                      })
                }
              />
            </div>
          </>
        )}

        {currentAccount && data?.id && (
          <div className=" text-3xl font-black px-4 hidden lg:block cursor-pointer">
            <MdAccountBalanceWallet
              onClick={() =>
                currentAccount
                  ? setToggleWallet(true)
                  : Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Please connect your Metamask wallet to view your funds',
                      background: '#19191a',
                      color: '#fff',
                      confirmButtonColor: '#2952e3',
                    })
              }
            />
          </div>
        )}
        {toggleWallet && (
          <div className="flex relative hidden lg:block">
            {' '}
            <div className="z-10 fixed top-0 -right-2 p-3 w-[30vw] h-screen shadow-2xl list-none flex flex-col justify-start items-end rounded-md text-white animate-slide-in blue-glassmorphism ">
              <div className="text-xl w-full my-2 cursor-pointer">
                <AiOutlineClose onClick={() => setToggleWallet(false)} />
              </div>
              <WalletNav />
            </div>
          </div>
        )}
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
                currentAccount && data?.id && 'Explore',
                'Stats',
                'Resources',
                currentAccount && data?.id && 'Create',
                currentAccount && data?.id && 'Profile',
                currentAccount && data?.id && 'Wallet',
              ].map((item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classProps={item && 'my-2 text-lg text-glow'}
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
          className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full hidden md:block cursor-pointer hover:bg-[#2546bd] text-glow"
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
