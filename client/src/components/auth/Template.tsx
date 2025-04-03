import React from 'react';
import { SignupForm } from './SignupForm';
import LoginForm from './LoginForm';
import { FaGoogle } from "react-icons/fa6";
import Button from '../Button';

interface TemplateProps {
  title: string;
  description1: string;
  description2: string;
  image: string;
  formType: 'signup' | 'login';
}

const Template: React.FC<TemplateProps> = ({ title, description1, description2, image, formType }) => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">

        {/* Left Section with Box Styling */}
        {/* border border-richblack-600  */}
        <div className="mx-auto w-11/12 max-w-[600px] md:mx-0 p-6 rounded-lg shadow-blue-200 shadow-[0px_0px_12px_0px]">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {title}
          </h1>
          <div className="mt-4 text-[1.125rem] leading-[1.625rem]">
            <p className="text-richblack-100">{description1}</p>
            <p className="font-edu-sa italic text-blue-100">{description2}</p>
          </div>

          {/* Form Section */}
          {formType === 'signup' ? <SignupForm /> : <LoginForm />}

          {/* OR Section for Google Login */}
          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="w-full flex justify-center">

            <Button type='secondary'>
              <div className="flex">

                <FaGoogle className='w-5 h-5 mr-2' />
                <h1>

                  Login with Google
                </h1>
              </div>
            </Button>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex items-center relative mx-auto w-11/12 max-w-[450px] md:mx-0">
          <div className="relative">
            <img src={image} className="-top-4 right-4 z-10 rounded-lg" alt="Pattern" loading="lazy" />
            {/* Decorative Shape (Optional) */}
            {/* <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 animate-pulse" /> */}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Template;
