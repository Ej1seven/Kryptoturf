import axios from 'axios';

const URL = 'http://localhost:3001/user';

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
    .then((res) => console.log(res.data));
}
export async function login(usernameOrEmail: String, password: String) {
  // console.log(usernameOrEmail, password);
  return await axios
    .post(`${URL}/login`, {
      usernameOrEmail: usernameOrEmail.toLowerCase(),
      password: password,
    })
    .then((res) => console.log(res.data));
}
