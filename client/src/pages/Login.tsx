import React, { useEffect, useState } from 'react';
import { me, login } from '../adapters/user';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useIsAuth } from '../utils/useIsAuth';
import Swal from 'sweetalert2';

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
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
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
    const { usernameOrEmail, password } = await formData;
    e.preventDefault();

    if (!usernameOrEmail || !password) return;
    await login(usernameOrEmail, password);
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
    <div className="flex justify-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
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
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {isLoading ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
          >
            Login
          </button>
        )}
        <p className="text-white text-right w-full pt-2">Forgot Password?</p>

        <div className="flex flex-col justify-start	text-white  w-full pb-2">
          <p>Need an account?</p>
          <p className="underline">Sign up</p>
        </div>
      </div>
    </div>
  );
};
