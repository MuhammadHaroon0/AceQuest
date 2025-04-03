import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Spinner from './common/Spinner';

interface JobFormInputs {
  title: string;
  description: string;
  experience: number;
  quizDuration: string;
  noOfInterviewQuestions: number;
}

const JobForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm<JobFormInputs>();

  const navigate = useNavigate()
  const [loading, setLoading] = useState<Boolean>(false)
  const submitJobForm: SubmitHandler<JobFormInputs> = async (data) => {
    setLoading(true)
    try {

      if (data.title.length < 3) {
        setError('title', {
          type: 'manual',
          message: 'Job title must be at least 3 characters long.',
        });
        return;
      }

      if (data.description.split(' ').length < 10) {
        setError('description', {
          type: 'manual',
          message: 'Job description must have at least 10 words.',
        });
        return;
      }

      const response = await axiosInstance.post(apiRoutes.createJobDescription, data)
      console.log(response);

      enqueueSnackbar(response.data.data.message)
      setTimeout(() => {
        navigate('/assessments')
      }, 1500);
    } catch (error: any) {
      console.log('Error:', error);
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

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: '',
        description: '',
        experience: 0,
        quizDuration: '',
        noOfInterviewQuestions: 5,
      });
    }
  }, [reset, isSubmitSuccessful]);


  if (loading)
    return (
      <div className='h-[80vh]'>
        <Spinner />
      </div>
    )

  return (
    <form onSubmit={handleSubmit(submitJobForm)}>
      <div className="flex flex-col gap-6">
        {/* Job Name */}
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter job title"
            className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
            {...register('title', { required: 'Job title is required.' })}
          />
          {errors.title && <span className="text-red-500">{errors.title.message}</span>}
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="description">
            Job Description
          </label>
          <textarea
            id="description"
            rows={7}
            placeholder="Enter job description"
            className="text-white border-b border-b-richblack-400 bg-richblack-700 focus:outline-none p-3 rounded-md placeholder:text-richblack-200"
            {...register('description', { required: 'Job description is required.' })}
          />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>

        {/* Difficulty Level */}
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="experience">
            Experience Level
          </label>
          <select
            id="experience"
            className="bg-richblack-700 border-b border-b-richblack-400 p-3 rounded-md focus:outline-none"
            {...register('experience', { required: 'Please select an experience level.' })}
          >
            <option value="" selected disabled hidden>Select Experience</option>
            <option value="0">Fresh</option>
            <option value="2">2+ years</option>
          </select>
          {errors.experience && <span className="text-red-500">{errors.experience.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="experience">
            Quiz duration
          </label>
          <select
            id="quizDuration"
            className="bg-richblack-700 border-b border-b-richblack-400 p-3 rounded-md focus:outline-none"
            {...register('quizDuration', { required: 'Please select an quiz duration.' })}
          >
            <option value="" selected disabled hidden>Select quiz duration</option>
            <option value="20min">20 minutes</option>
            <option value="30min">30 minutes</option>
          </select>
          {errors.quizDuration && <span className="text-red-500">{errors.quizDuration.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="text-richblack-5 text-sm mb-2" htmlFor="experience">
            Maximum no of interview questions
          </label>
          <select
            id="noOfInterviewQuestions"
            className="bg-richblack-700 border-b border-b-richblack-400 p-3 rounded-md focus:outline-none"
            {...register('noOfInterviewQuestions', { required: 'Please select a quiz duration.' })}
          >
            <option value="" selected disabled hidden>Select maximum no of interview questions</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          {errors.noOfInterviewQuestions && <span className="text-red-500">{errors.noOfInterviewQuestions.message}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="rounded-md bg-primary text-center py-3 tracking-wide text-[18px] font-bold text-white hover:bg-hover">
          Next
        </button>
      </div>
    </form>
  );
};

export default JobForm;
