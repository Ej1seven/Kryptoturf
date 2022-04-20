export const validateRegister = (
  username: String,
  email: String,
  password: String
) => {
  if (!email.includes('@')) {
    return { message: 'invalid email' };
  }
  if (username.length <= 2) {
    return { message: 'username length must be greater than 2' };
  }

  if (username.includes('@')) {
    return { message: 'username cannot include an @' };
  }

  if (password.length <= 2) {
    return { message: 'password length must be greater than 2' };
  }
  return null;
};
