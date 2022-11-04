import React, { useRef } from 'react';
import { Navbar } from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { RiArrowLeftCircleFill, RiArrowRightCircleFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import docArt1 from '../../src/images/docArt1-min.png';
import docArt2 from '../../src/images/docArt2-min.png';
import docArt3 from '../../src/images/docArt3-min.png';
import docArt4 from '../../src/images/docArt4-min.png';
import docArt5 from '../../src/images/docArt5-min.png';
import docArt6 from '../../src/images/docArt6-min.png';
import docArt7 from '../../src/images/docArt7-min.png';
import docArt8 from '../../src/images/docArt8-min.png';
import docArt10 from '../../src/images/docArt10-min.png';
import docArt11 from '../../src/images/docArt11-min.png';
import docArt12 from '../../src/images/docArt12-min.png';

interface ResourcesProps {}
const style = {
  wrapper: `relative`,
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-30 before:blur w-full`,
  contentWrapper: `flex md:h-screen relative justify-center flex-wrap items-center`,
  copyContainer: `md:w-1/2`,
  title: `relative text-center md:text-left text-white text-4xl  pt-8 md:pt-0 sm:text-[46px] font-semibold`,
  description: `text-[#8a939b] container-[400px] text-2xl  text-center md:text-left mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex justify-center md:justify-start mb-8 md:mb-0`,
  accentedButton: `mx-auto md:mx-0 lg:w-36 md:w-34 sm:w-32 w-28 h-12 smMAX:h-14 mt-5 text-lg font-semibold bg-[#2181e2]  rounded-lg text-white text-center hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold   bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-lg w-1/2 h-full md:h-3/4 bg-[#313338] shadow-black shadow-lg shadow-inner px-4 pt-8 -rotate-12 scale-75 -translate-y-6 translate-x-9 slide-in-left`,
  infoContainer: `h-28 pt-6 smMAX:pt-8 pb-4 smMAX:pr-0 pr-4 flex flex-row`,
  author: `flex flex-col justify-center ml-4 w-full `,
  name: `info-container-box-shadow h-4 w-full`,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold info-container-box-shadow`,
};

export const Resources: React.FC<any> = ({}) => {
  /*Each slide on the slide represents a different option. When the user clicks the slide a popup modal will appear with the following text. */
  const messagePop = (option: Number) => {
    let title: any;
    let text: any;
    if (option === 1) {
      title = 'How do I create an account?';
      text = `<p>To create an account, click the "Login" button on the navigation bar. You will be directed to the login page. On the bottom left you will find the option to "Sign Up". On the Sign Up page you need to provide a username, valid email, and password. If you are not logged in to your Metamask account you will see the option to connect your wallet. If you do not have Metamask installed on your web browser, go to <a href="https://metamask.io/download/">metamask.io/download</a> and follow the directions. </p)`;
    }
    if (option === 2) {
      title = 'What blockchain network does Kryptoturf use?';
      text = `<p>Kryptoturf is ran under the Goerli Test Network. In order to buy and sell NFTs your Metamask account must be connected to this network. </p)`;
    }
    if (option === 3) {
      title = 'What are Turf coins?';
      text = `<p>Turf coins are a form of currency specific to the Kryptoturf marketplace designed to limit the amount of buying power users have. Each user starts off with 100 turf coins. Once a user runs out of coins they can no longer purchase NFTs. 1 Turf coin is equivalent to 1 ETH. You will notice your total Turf coin value increase or decrease depending on whether you have just purchased or sold a NFT. Remember, you can also earn Turf coins from royalties based off the percentage you set when the NFT was listed on the marketplace. </p)`;
    }
    if (option === 4) {
      title = 'Can I transfer my Ethereum to another Metamask account?';
      text = `<p>Yes, you can exchange Ethereum from one account to another by completing the form found on the home page. Scroll down to the section that says "Send Crypto across the world" and fill out the form, then select "Send Now". Make sure your wallet is connected before attempting to transfer Ethereum. Note, you can only transfer Ethereum, Turf coins can not be transferred. </p)`;
    }
    if (option === 5) {
      title = 'How can I view my wallet funds and Turf coins?';
      text = `<p>You can view your Metamask wallet funds and TURF coins by selecting the wallet or profile icons on the navigation bar. If you select the profile icon your wallet funds and TURF coins will be located on the top left of the profile page. </p)`;
    }
    if (option === 6) {
      title = 'How do I create an NFT?';
      text = `<p>Select the "Create" option located on the Navigation bar then select "Create NFT". </p)`;
    }
    if (option === 7) {
      title = 'How do I create an Collection?';
      text = `<p>Select the "Explore" option located on the Navigation bar then select "Create Collection". </p)`;
    }
    if (option === 8) {
      title = 'Why is my collection named "Untitled Collection"?';
      text = `<p>Untitled collections are considered generic collections. These collections automatically created for unassigned NFTs.</p)`;
    }
    if (option === 9) {
      title = 'How do I list an NFT on the marketplace?';
      text = `<p>Select "Collections" on the navigation bar then find the collection that contains the NFT you desire to list. Once you are on the collection page select the NFT you want to list and click "List Item". You can also find all the NFTs you created on your profile page and list them from there.</p)`;
    }
    if (option === 10) {
      title = 'How can I view my Profile?';
      text = `<p>You can view your profile by clicking the profile icon located on the far right side of the navigation bar.</p)`;
    }
    if (option === 11) {
      title = 'How can I get more GoerliETH??';
      text = `<p>In order to create, list, or buy NFTs you must use Ethereum Goerli ETH. There are many faucets you can request Ethereum Goerli ETH. The two faucets I use the most are <a href="https://faucets.chain.link/">https://faucets.chain.link</a> and <a href="https://goerlifaucet.com/">https://goerlifaucet.com</a> </p)`;
    }
    return Swal.fire({
      icon: 'question',
      title: title,
      html: text,
      background: '#19191a',
      width: '50%',
      color: '#fff',
      confirmButtonColor: '#2952e3',
    });
  };
  const PreviousArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <RiArrowLeftCircleFill
        className="slide-arrows"
        style={{
          ...style,
          color: 'white',
          position: 'absolute',
          display: 'inline',
          zIndex: '10',
          marginLeft: '10px',
          fontSize: '60px',
        }}
        onClick={onClick}
      />
    );
  };
  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <RiArrowRightCircleFill
        className="slide-arrows"
        style={{
          ...style,
          color: 'white',
          position: 'absolute',
          display: 'block',
          top: '0',
          bottom: '0',
          right: '0',
          zIndex: '20',
          marginRight: '10px',
          fontSize: '60px',
        }}
        onClick={onClick}
      />
    );
  };
  /*The setting for the react-slick slideshow */
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    rows: 1,
    slidesToScroll: 4,
    slidesToShow: 4,
    initialSlide: 0,
    adaptiveHeigh: true,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const ref = useRef<null | HTMLDivElement>(null);
  /*When the user clicks the Start Learning button page will auto-scroll down to the slideshow */
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="">
      <Navbar />
      <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center">
        <div className="mt-4 md:mt-0 w-5/6 md:w-1/2 md:ml-4 sm:ml-0 pb-20 flex justify-end">
          <div className={style.cardContainer}>
            <img
              className="rounded-lg w-full"
              src="https://i.seadn.io/gae/GKeYhtLNnF8wAfNWVlq2YIjyPLzX8pMV_7p9cwf8svRMdJRa8CrNejju9X96Pik8iqJMu8ACqaRxDLGa3SP-05-E3-hT_ImlTV4BRLo?auto=format"
              alt=""
            />
            <div className={style.infoContainer}>
              <div className="md:w-[36px] md:h-[36px] sm:w-[24px] sm:h-[24px] nft-card-image rounded-full info-container-box-shadow"></div>

              <div className="h-14  smMAX:h-10 ml-3 rounded-b-lg justify-between text-white w-3/4 flex flex-col ">
                <div className="animate-pulse info-container-box-shadow h-4 smMAX:h-2 w-full" />
                <div className="animate-pulse info-container-box-shadow h-4 smMAX:h-2 w-2/3" />
              </div>
            </div>
          </div>
          <div className="rounded-lg w-1/2 h-full md:h-3/4 bg-[#313338] shadow-black shadow-lg shadow-inner px-4 pt-8 rotate-12 slide-in-right ">
            <img
              className="rounded-lg w-full"
              src="https://i.seadn.io/gae/Td8uHW4V1GjkLFT0CPF1OmNI0OL6A8EFDYqq6oU5lSfw4xYjycovaFmwcP1ckMWdHgGAj-ShUlo72N8NbsguuMLnUmQSu5bUIn9i?auto=format"
              alt=""
            />
            <div className={style.infoContainer}>
              <div className="md:w-[36px] md:h-[36px] sm:w-[24px] sm:h-[24px] nft-card-image rounded-full info-container-box-shadow"></div>

              <div className="h-14 smMAX:h-10 ml-3 rounded-b-lg justify-between text-white w-3/4 flex flex-col ">
                <div className="animate-pulse info-container-box-shadow h-4 smMAX:h-2 w-full" />
                <div className="animate-pulse info-container-box-shadow h-4 smMAX:h-2 w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4 md:w-1/3 ml-8 flex items-center">
          <div className=" flex flex-col text-white ">
            <p className="text-4xl text-bold">
              It's time to explore the world of NFTS!
            </p>
            <p className="">
              A practical guide covering the main features of Kryptoturf for
              first-time users interested in the NFT market.
            </p>
            <button className={style.accentedButton}>
              <div className="w-full" onClick={handleClick}>
                Start Learning
              </div>
            </button>
          </div>
        </div>
      </div>
      <div ref={ref}>
        <Slider {...settings}>
          <div onClick={() => messagePop(1)} className="">
            <div className="border-2 border-white rounded-lg help-message-one h-80 cursor-pointer">
              {' '}
              <img
                className="my-16 2xl:w-1/2 2xl:mx-auto"
                src={docArt1}
                alt=""
              />
            </div>

            <p className="text-white text-center">
              How do I create an account?
            </p>
          </div>
          <div onClick={() => messagePop(2)} className="">
            <div className="border-2 border-white rounded-lg help-message-two h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mx-auto my-16 2xl:w-1/2"
                src={docArt2}
                alt=""
              />
            </div>

            <p className="text-white text-center">
              What blockchain network does Kryptoturf use?
            </p>
          </div>
          <div onClick={() => messagePop(3)} className="">
            <div className="border-2 border-white rounded-lg help-message-three h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mx-auto my-16 2xl:w-1/2"
                src={docArt3}
                alt=""
              />
            </div>
            <p className="text-white text-center">What are Turf coins?</p>
          </div>
          <div onClick={() => messagePop(4)} className="">
            <div className="border-2 border-white rounded-lg help-message-four h-80 cursor-pointer">
              {' '}
              <img
                className="my-16 2xl:w-1/2 2xl:mx-auto"
                src={docArt4}
                alt=""
              />
            </div>
            <p className="text-white text-center">
              Can I transfer my Ethereum to another Metamask account?
            </p>
          </div>
          <div onClick={() => messagePop(5)} className="">
            <div className="border-2 border-white rounded-lg help-message-five h-80 cursor-pointer">
              {' '}
              <img className="mx-auto my-16 2xl:w-1/2" src={docArt5} alt="" />
            </div>
            <p className="text-white text-center">
              How can I view my wallet funds and TURF coins?
            </p>
          </div>
          <div onClick={() => messagePop(6)} className="">
            <div className="border-2 border-white rounded-lg help-message-one h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mx-auto my-16 2xl:w-1/2"
                src={docArt6}
                alt=""
              />
            </div>
            <p className="text-white text-center">How do I create an NFT?</p>
          </div>
          <div onClick={() => messagePop(7)} className="">
            <div className="border-2 border-white rounded-lg help-message-two h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mx-auto my-162xl:w-1/2"
                src={docArt7}
                alt=""
              />
            </div>
            <p className="text-white text-center">
              How do I create an Collection?
            </p>
          </div>
          <div onClick={() => messagePop(8)} className="">
            <div className="border-2 border-white rounded-lg help-message-three h-80 cursor-pointer">
              {' '}
              <img className="w-3/4 mx-auto 2xl:w-1/2" src={docArt8} alt="" />
            </div>
            <p className="text-white text-center">
              Why is my collection named "Untitled Collection"?
            </p>
          </div>
          <div onClick={() => messagePop(9)} className="">
            <div className="border-2 border-white rounded-lg help-message-four h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mx-auto my-16 2xl:w-1/2"
                src={docArt10}
                alt=""
              />
            </div>
            <p className="text-white text-center">
              How do I list an NFT on the marketplace?
            </p>
          </div>
          <div onClick={() => messagePop(10)} className="">
            <div className="border-2 border-white rounded-lg help-message-five h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mt-8 mx-auto 2xl:w-1/2"
                src={docArt11}
                alt=""
              />
            </div>
            <p className="text-white text-center">How can I view my Profile?</p>
          </div>
          <div onClick={() => messagePop(11)} className="">
            <div className="border-2 border-white rounded-lg help-message-five h-80 cursor-pointer">
              {' '}
              <img
                className="w-3/4 mt-8 mx-auto 2xl:w-1/2"
                src={docArt12}
                alt=""
              />
            </div>
            <p className="text-white text-center">
              How can I get more GoerliETH?
            </p>
          </div>
          <div></div>
        </Slider>
      </div>
    </div>
  );
};
