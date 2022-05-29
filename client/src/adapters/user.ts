import axios from 'axios';
import Swal from 'sweetalert2';
const URL = 'http://localhost:4001/userAuth';
export let user: any;

export async function register(
  username: String,
  email: String,
  password: String,
  address?: String
) {
  // console.log(usernameOrEmail, password);
  return await axios
    .post(`${URL}/register`, {
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
      `${URL}/login`,
      {
        usernameOrEmail: usernameOrEmail.toLowerCase(),
        password: password,
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
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
    .delete(`${URL}/logout`, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    });
}
export async function me() {
  // console.log(usernameOrEmail, password);
  return await axios
    .get(`${URL}/me`, {
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
    .get(`${URL}/token`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    });
}
