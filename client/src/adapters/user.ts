import axios from 'axios';
import Swal from 'sweetalert2';
const URL = process.env.REACT_APP_API_URL;

export let user: any;

export async function register(
  username: String,
  email: String,
  password: String,
  address?: String
) {
  return await axios
    .post(`${URL}/userAuth/register`, {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      address: address,
    })
    .then((res): any => {
      if (res.data === 'invalid email')
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      if (res.data.message)
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data.message,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      if (res.data.err)
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data.err,
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
      return Swal.fire({
        icon: 'success',
        title: 'Congrats!',
        text: `You have successfully created a new account. A confirmation email has been sent to ${email}. Please confirm your email before attempting to login.`,
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      }).then((result) => {
        if (result.isConfirmed) {
          return res.data.user;
        }
      });
    });
}
export async function login(usernameOrEmail: String, password: String) {
  return await axios
    .post(
      `${URL}/userAuth/login`,
      {
        usernameOrEmail: usernameOrEmail.toLowerCase(),
        password: password,
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': 'https://kryptoturf.com',
        },
      }
    )
    .then((res: any) => {
      return {
        res,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
    });
}
export async function logout() {
  return await axios
    .delete(`${URL}/userAuth/logout`, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    });
}
/* me() checks JWT and determines if the access token is active or expired. When the access and refresh tokens expires the user 
   will be logged out of their account.*/
export async function me() {
  return await axios
    .get(`${URL}/userAuth/me`, {
      withCredentials: true,
    })
    .then(async (res) => {
      if (res.data === 'TokenExpiredError') {
        return token();
      }
      return res.data;
    });
}
/*token() checks JWT and determines if the refresh token is active or expired. If the refresh token is active then
 it will create a new access token and the user will remain logged in. If the refresh token is expired then the user will be logged out.*/
export async function token() {
  return await axios
    .get(`${URL}/userAuth/token`, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    });
}

export async function addImages(images: {
  profileImage?: String;
  bannerImage?: String;
  email: String;
}) {
  return await axios
    .post(
      `${URL}/userAuth/images`,
      {
        profileImage: images.profileImage,
        bannerImage: images.bannerImage,
        email: images.email,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}

export async function getUserData(emailOrContractAddress: String) {
  return await axios
    .post(
      `${URL}/userAuth/user`,
      {
        emailOrContractAddress: emailOrContractAddress,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}
export async function getAllUsers() {
  return await axios
    .get(`${URL}/userAuth/users`, { withCredentials: true })
    .then((res): any => {
      return res.data;
    });
}
export async function buyNFT(
  buyerAddress: String,
  sellerAddress: String,
  coins: Number,
  royaltyOwnerAddress: String,
  royaltyFee: Number
) {
  return await axios
    .post(
      `${URL}/userAuth/buyNFT`,
      {
        buyerAddress: buyerAddress,
        sellerAddress: sellerAddress,
        coins: coins,
        royaltyOwnerAddress: royaltyOwnerAddress,
        royaltyFee: royaltyFee,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}
