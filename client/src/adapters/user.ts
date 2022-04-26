import axios from 'axios';
const URL = 'http://localhost:4001/userAuth';

export async function register(
  username: String,
  email: String,
  password: String
) {
  // console.log(usernameOrEmail, password);
  return await axios
    .post(`${URL}/register`, {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
    })
    .then((res) => {
      return res.data;
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
