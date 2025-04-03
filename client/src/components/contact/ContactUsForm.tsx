import React from 'react';
import CountryCode from '../../data/countrycode.json';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ContactFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  countrycode: string;
  phoneNo: string;
  message: string;
}

const ContactUsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormInputs>();

  const submitContactForm: SubmitHandler<ContactFormInputs> = (data) => {
    console.log('Logging data', data);
    try {
      // Static submission (no API call)
      const response = { status: 'OK' };
      console.log('Logging response', response);
    } catch (error: any) {
      console.log('Error while submitting contact us form', error.message);
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        phoneNo: '',
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-6">
        {/* First and last name */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* firstname */}
          <div className="flex w-full flex-col">
            <label className="text-richblack-5 text-sm mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
              {...register('firstName', { required: true })}
            />
            {errors.firstName && <span>Please enter your first name</span>}
          </div>

          {/* Last Name */}
          <div className="flex w-full flex-col">
            <label className="text-richblack-5 text-sm mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
              {...register('lastName', { required: true })}
            />
            {errors.lastName && <span>Please enter your last name</span>}
          </div>
        </div>

        {/* email */}
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
            placeholder="Enter Email Address"
            {...register('email', { required: true })}
          />
          {errors.email && <span>Please enter your email address</span>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label htmlFor="phonenumber" className="text-sm mb-2">
            Phone Number
          </label>
          <div className="flex flow-row gap-2">
            {/* Dropdown */}
            <select
              id="dropdown"
              className="bg-richblack-700 border-b border-b-richblack-400 w-[85px] rounded-md focus:outline-none p-3"
              {...register('countrycode', { required: true })}
            >
              {CountryCode.map((element, index) => (
                <option key={index} value={element.code}>
                  {`${element.code} ${element.country}`}
                </option>
              ))}
            </select>
            <input
              type="number"
              id="phonenumber"
              placeholder="12345 67890"
              className="w-[calc(100%-90px)] appearance-none text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
              {...register('phoneNo', {
                required: { value: true, message: 'Please enter Phone Number' },
                maxLength: { value: 10, message: 'Invalid Phone Number' },
                minLength: { value: 8, message: 'Invalid Phone Number' },
              })}
            />
          </div>
          {errors.phoneNo && <span>{errors.phoneNo.message}</span>}
        </div>

        {/* message */}
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
            rows={7}
            placeholder="Enter Your message here"
            {...register('message', { required: true })}
          />
          {errors.message && <span>Please enter your message</span>}
        </div>

        <button type="submit" className="bg-[#1ecdf8] text-center py-3 tracking-wide text-[16px] font-bold text-richblack-5">
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
