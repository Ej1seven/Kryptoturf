import React, { useEffect, useState } from 'react';
import { me, login } from '../adapters/user';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useIsAuth } from '../utils/useIsAuth';
import Swal from 'sweetalert2';
import { Navbar } from '../components';

interface LoginProps {}
const Input = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
}: {
  placeholder: any;
  name: String;
  type: any;
  value: any;
  handleChange: any;
}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism cursor-pointer max-w-[400px]"
  />
);

const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

export const Login: React.FC<LoginProps> = ({}) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const { data, isLoading, isError, refetch } = useQuery('me', me);
  const queryClient = useQueryClient();
  const handleChange = (e: any, name: any) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleSubmit = async (e: any) => {
    let error: any = null;
    const { usernameOrEmail, password } = await formData;
    e.preventDefault();

    if (!usernameOrEmail || !password)
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out the required fields',
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    await login(usernameOrEmail, password).catch((err) => (error = err));
    if (error) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Wrong password or username',
        background: '#19191a',
        color: '#fff',
        confirmButtonColor: '#2952e3',
      });
    }
    await me();
    await queryClient.invalidateQueries('me');
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (data?.id) {
      // if the user is not logged in the router will take the user to the login page
      //once the user logs in the router with proceed forward by taking the end user to their intended page
      navigate('/');
    }
  }, [data, navigate]);
  return (
    <div className=" overflow-hidden">
      <Navbar />
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="p-5 w-96 sm:w-4/6 max-w-[700px] flex flex-col justify-start items-center blue-glassmorphism">
            <p className="text-white text-2xl text-left w-full pb-8">Sign In</p>

            <Input
              placeholder="Username or Email"
              name="usernameOrEmail"
              type="text"
              handleChange={handleChange}
              value={null}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              handleChange={handleChange}
              value={null}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2 max-w-[400px]" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 p-2 rounded-full cursor-pointer btn-gradient-border max-w-[400px]"
              >
                Login
              </button>
            )}
            {/* <p className="text-white text-right w-full pt-2">Forgot Password?</p> */}
            <div className="flex flex-col justify-start	text-white  w-full py-2">
              <p>Need an account?</p>
              <p
                className="underline cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Sign up
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
