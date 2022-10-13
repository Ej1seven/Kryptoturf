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
  // console.log(usernameOrEmail, password);
  return await axios
    .post(`${URL}/userAuth/register`, {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      address: address,
    })
    .then((res): any => {
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
      if (res.data.user.username === username) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'You have successfully created an account. Please login!',
          background: '#19191a',
          color: '#fff',
          confirmButtonColor: '#2952e3',
        });
        user = res.data.user;
      }
    });
}
export async function login(usernameOrEmail: String, password: String) {
  // console.log(usernameOrEmail, password);
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
    .then((res) => {
      return {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
    });
}
export async function logout() {
  // console.log(usernameOrEmail, password);
  return await axios
    .delete(`${URL}/userAuth/logout`, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    });
}
export async function me() {
  // console.log(usernameOrEmail, password);
  return await axios
    .get(`${URL}/userAuth/me`, {
      withCredentials: true,
    })
    .then(async (res) => {
      console.log(res.data);
      if (res.data === 'TokenExpiredError') {
        return token();
      }
      return res.data;
    });
}

export async function token() {
  return await axios
    .get(`${URL}/userAuth/token`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    });
}

export async function addImages(images: {
  profileImage?: String;
  bannerImage?: String;
  email: String;
}) {
  console.log(images);
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
      console.log(res.data);
      // collectionItem = res.data;
      return res.data;
    });
}

export async function getUserData(emailOrContractAddress: String) {
  console.log(emailOrContractAddress);
  return await axios
    .post(
      `${URL}/userAuth/user`,
      {
        emailOrContractAddress: emailOrContractAddress,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      console.log(res.data);
      return res.data;
    });
}
export async function getAllUsers() {
  return await axios
    .get(`${URL}/userAuth/users`, { withCredentials: true })
    .then((res): any => {
      console.log(res.data);
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
  console.log(buyerAddress);
  console.log(sellerAddress);
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
      console.log(res.data);
      return res.data;
    });
}
