import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Tab from './Tab';
import Button from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import useAuthStore from '../../stores/useAuthStore';

// Dummy constants for account types
const ACCOUNT_TYPE = {
  STUDENT: 'student',
  COMPANY: 'company',
};

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string,
  companyWebsite: string,
  email: string;
  password: string;
  confirmPassword: string;
}

type SignUpData = {
  name: string;
  email: string;
  password: string;
  accountType: string;
  companyName?: string;
  companyWebsite?: string;
};

export const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { firstName, lastName, email, password, confirmPassword, companyName, companyWebsite } = formData;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const validatePassword = (password: string) => {
    // Regular expression to match at least one letter, one number, and one special character
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return regex.test(password);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    // Combine firstName and lastName into a single name field
    const name = `${firstName} ${lastName}`;

    let signUpData: SignUpData = {
      name,
      email,
      password,
      accountType,
    };

    // Add company fields if accountType is 'company'
    if (accountType === ACCOUNT_TYPE.COMPANY) {
      signUpData = {
        ...signUpData,
        companyName,
        companyWebsite,
      };
    }

    try {
      await signup(signUpData)
      enqueueSnackbar("Signup successful")
      setTimeout(() => {
        navigate("/login")
      }, 2000);
    } catch (error: any) {

      enqueueSnackbar(error.response.data.message)
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      companyWebsite: '',
      password: '',
      confirmPassword: '',
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  const tabData = [
    { id: 1, tabName: 'Student', type: ACCOUNT_TYPE.STUDENT },
    { id: 2, tabName: 'Company', type: ACCOUNT_TYPE.COMPANY },
  ];

  return (
    <div className=''>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex flex-col lg:flex-row md:flex-row gap-4">
          <label className="flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label className="flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>
        {accountType === ACCOUNT_TYPE.COMPANY && <div className="flex flex-col lg:flex-row md:flex-row gap-4">
          <label className="flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Company Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="companyName"
              value={companyName}
              onChange={handleOnChange}
              placeholder="Enter company name"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label className="flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Company Website <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="companyWebsite"
              value={companyWebsite}
              onChange={handleOnChange}
              placeholder="Enter company website"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>}
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>
        <div className="flex flex-col lg:flex-row md:flex-row gap-4">
          <label className="relative flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{ boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)' }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        {passwordError && (
          <p className="mt-1 text-xs text-red-500">{passwordError}</p>
        )}
        <Button
          type="primary"
        // className="mt-6 rounded-[8px] bg-primary py-[8px] px-[12px] font-medium text-white"
        >
          Sign Up
        </Button>
        <Link to='/login'>Already have an account? Login here</Link>
      </form>

    </div>
  );
};
