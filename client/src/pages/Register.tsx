import React, { useState } from 'react';
import { register } from '../adapters/user';
import { Loader } from '../components/Loader';

interface RegisterProps {}
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

export const Register: React.FC<RegisterProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const handleChange = (e: any, name: any) => {
    console.log(e.target.value);
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleSubmit = (e: any) => {
    const { username, email, password } = formData;
    e.preventDefault();

    if (!username || !email || !password) return;
    register(username, email, password);
  };

  return (
    <div className="flex justify-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism  lg:mt-72 md:mt-64 mt-60">
        <p className="text-white text-2xl text-left w-full pb-8">Sign Up</p>

        <Input
          placeholder="Username"
          name="username"
          type="text"
          handleChange={handleChange}
          value={null}
        />
        <Input
          placeholder="Email"
          name="email"
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
            Register
          </button>
        )}
      </div>
    </div>
  );
};
