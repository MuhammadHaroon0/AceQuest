import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Button from '../Button';
import useAuthStore from '../../stores/useAuthStore';
import { enqueueSnackbar } from 'notistack';

const LoginForm: React.FC = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Static form submission - no dispatch, no navigate
    try {
      await login(formData)

    } catch (error: any) {
      enqueueSnackbar(error.response.data.message)
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-4">
      <label className="w-full">
        <div className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </div>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
      </label>

      <label className="relative">
        <div className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </div>
        <input
          required
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter the Password"
          style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer text-richblack-5 opacity-80 text-[24px]"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-sm text-blue-100">Forgot Password</p>
        </Link>
      </label>
      <Button
        type="primary"
      // className="mt-6 rounded-[8px] bg-primary py-[8px] px-[12px] font-medium text-white"
      >
        Sign In
      </Button>
      <Link to='/signup'>Don't have an account? Create one here</Link>
    </form>
  );
};

export default LoginForm;
