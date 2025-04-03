
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { BiArrowBack } from 'react-icons/bi';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

type FormData = {
  password: string;
  confirmPassword: string;
};

type AuthState = {
  loading: boolean;
};

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState('');


  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const { token } = useParams()
  const validatePassword = (password: string) => {
    // Regular expression to match at least one letter, one number, and one special character
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return regex.test(password);
  };
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      enqueueSnackbar("Password reset token not found")
      return
    }
    const { password, confirmPassword } = formData
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must contain at least one letter, one number, and one special character, and be at least 7 characters long.');
      return;
    } else {
      setPasswordError('');  // Clear error if password is valid
    }
    setLoading(true)
    try {
      const response = await axiosInstance.patch(apiRoutes.resetPassword(token), { password: password });
      enqueueSnackbar(response.data.message)
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        enqueueSnackbar(error.response?.data?.message || "An error occurred");
      } else {
        enqueueSnackbar("An unexpected error occurred");
      }
    }
    finally {
      setLoading(false)
    }

  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex justify-center h-full items-center md:h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] '>
          <div className='flex lg:w-[30%] md:w-[30%] w-[90%] my-10 flex-col gap-3 justify-center text-white'>
            <h1 className='text-richblack-5 text-3xl font-semibold'>
              Choose new Password
            </h1>
            <p className='text-lg font-normal text-richblack-100'>
              Almost done. Enter your new password and you are all set.
            </p>
            <form className='flex flex-col gap-5' onSubmit={submitHandler}>
              <label className='relative font-normal text-sm text-richblack-5'>
                <p className='my-1'>New Password<span className='text-pink-300'>*</span></p>
                <input
                  className='text-white border-b w-full border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200'
                  required
                  placeholder='Enter new password'
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={changeHandler}
                  name='password'
                />
                <span
                  className='absolute right-3 top-[38px] z-[10] cursor-pointer text-white'
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
              </label>

              <label className='relative font-normal text-sm text-richblack-5'>
                <p className='my-1'>Confirm Password<span className='text-pink-300'>*</span></p>
                <input
                  className='text-white border-b w-full border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200'
                  required
                  placeholder='Enter confirm password'
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={changeHandler}
                  name='confirmPassword'
                />
                <span
                  className='absolute top-[38px] right-3 z-[10] cursor-pointer text-white'
                  onClick={() => setShowConfirmPassword((prevState) => !prevState)}
                >
                  {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
              </label>


              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              )}
              <button
                className='w-full rounded-[8px] bg-primary py-[8px] px-[12px] font-semibold text-white'
              >
                Reset Password
              </button>
            </form>
            <div>
              <Link to={"/login"}>
                <div className='text-richblack-5 text-base font-medium flex items-center gap-1'>
                  <BiArrowBack />
                  <p className='text-base text-richblack-50'>Back to Login</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword