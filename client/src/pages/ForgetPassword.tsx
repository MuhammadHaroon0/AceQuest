
import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { BiArrowBack } from 'react-icons/bi';
import apiRoutes from '../utils/apiRoutes';
import axiosInstance from '../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

type AuthState = {
  loading: boolean;
};

const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");


  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    try {
      const response = await axiosInstance.post(apiRoutes.forgotPassword, { email: email });
      enqueueSnackbar(response.data.message)
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
        <div className='h-screen'>

          <Spinner />
        </div>
      ) : (
        <div
          className={`flex justify-center md:h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] items-center ${loading ? 'bg-caribbeangreen-400' : ''
            }`}
        >
          <div className="text-white lg:w-[30%] md:w-[30%] w-[90%] mt-16 lg:mt-0 md:mt-0 flex flex-col gap-3 justify-center">
            <h1 className="font-bold lg:text-3xl md:text-3xl text-xl text-richblack-5">
              {emailSent ? 'Check Your Email' : 'Reset your Password '}
            </h1>

            <p className="text-richblack-100 font-normal lg:text-lg md:text-lg text-base">
              {emailSent
                ? `We have sent the reset email to ${email}`
                : "Have no fear. We'll email you instructions to reset your password."}
            </p>

            <form className="flex flex-col gap-3" onSubmit={handleOnSubmit}>
              {!emailSent && (
                <label className="font-normal text-sm text-richblack-5">
                  <p className="my-1">
                    Email Address<span className="text-pink-300">*</span>
                  </p>
                  <input
                    className="text-white border-b w-full border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email address"
                  />
                </label>
              )}

              <button
                className="rounded-[8px] bg-primary lg:py-[8px] md:py-[8px] py-[4px] lg:font-bold md:font-bold font-normal px-[12px] text-lg text-white"
                type="submit"
              >
                {emailSent ? 'Resend Email' : 'Reset Password'}
              </button>
            </form>

            <div>
              <Link to="/login">
                <div className="text-richblack-5 text-base font-medium flex items-center gap-1">
                  <BiArrowBack />
                  <p className="text-base text-richblack-50">Back to Login</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
