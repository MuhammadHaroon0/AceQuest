import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import Spinner from '../components/common/Spinner';
import useAuthStore from '../stores/useAuthStore';
interface Quiz {
    _id: string
    question: string;
    correctAnswer: string;
    allAnswers: string[]
}
const Quiz: React.FC = () => {
    const [responses, setResponses] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(10000); // Example: 10 minutes
    const { user } = useAuthStore()
    const { token } = useParams()

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [loading, setLoading] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<Quiz[]>([]);

    const getJob = async (token: string) => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(apiRoutes.getJob(token))
            setQuiz(response.data.data.quiz)
            setResponses(Array(response.data.data.quiz.length).fill("-1"))

            setTimeLeft(response.data.data.quizDuration.slice(0, 2) * 60)

        } catch (error) {
            if (axios.isAxiosError(error)) {

                enqueueSnackbar('Try logging out and then open the test if you\'re a candidate for this job.');
            } else {
                enqueueSnackbar('An unexpected error occurred fetching candidates');
            }
        }
        finally {
            setLoading(false)
        }
    }

    const fetchQuiz = async () => {

        if (!token)
            return
        if (user?.accountType === 'student') {
            getJob(token)
            return
        }
        else if (user?.accountType === 'company') {
            enqueueSnackbar("You're logged in as company. Logout to attempt the test")
            return
        }


        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getCandidateQuiz(token));
            setQuiz(response.data.data.quiz);

            setResponses(Array(response.data.data.quiz.length).fill("-1"))

            setTimeLeft(response.data.data.quizDuration.slice(0, 2) * 60)

        } catch (error) {
            if (axios.isAxiosError(error)) {

                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred fetching candidates');
            }
        } finally {
            setLoading(false);
        }
    };
    useLayoutEffect(() => {
        fetchQuiz()

    }, [token])

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    const handleOptionChange = (questionId: number, optionIndex: string) => {
        const updatedResponses = [...responses];
        updatedResponses[questionId] = optionIndex;
        setResponses(updatedResponses);
    };
    const navigate = useNavigate()

    const handleSubmit = async () => {

        const data = {
            answers: responses
        }

        if (!token)
            return
        if (user?.accountType === 'student') {
            try {
                const response = await axiosInstance.post(apiRoutes.submitQuizResult(token), data)
                enqueueSnackbar(response.data.status)
                navigate(`/interview/${token}`)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    enqueueSnackbar(error.response?.data?.message || 'An error occurred');
                } else {
                    enqueueSnackbar('An unexpected error occurred')
                }
            } finally {
                return
            }
        }

        else if (user?.accountType === 'company')
            return

        try {
            const response = await axiosInstance.post(apiRoutes.addQuizResult(token), data)
            enqueueSnackbar(response.data.status)
            navigate(`/interview/${token}`)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred')
            }
        }
    }

    if (loading)
        return (
            <div className='h-screen'>
                <Spinner />
            </div>
        )

    return (
        <div className="min-h-screen bg-richblack-900 text-secondary p-4">

            <div className="max-w-6xl mx-auto bg-richblack-900 p-6 rounded-md">
                {/* Quiz Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-primary">Choose one right asnwer only</h1>
                    <div className="text-lg font-semibold bg-gray-800 text-secondary px-2 md:px-4 py-2 rounded-md">
                        Time Left: {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Quiz Questions */}
                <div className="mt-6 space-y-8">
                    {quiz.map((question, index) => (
                        <div key={question._id} className="p-4 rounded-md">
                            <h2 className="text-lg font-semibold text-secondary">
                                {index + 1}. {question.question}
                            </h2>
                            <div className="mt-4 space-y-2">
                                {question.allAnswers.map((option, optionIndex) => (
                                    <label
                                        key={optionIndex}
                                        className="flex items-center space-x-3 text-secondary cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={optionIndex}
                                            checked={responses[index] === optionIndex.toString()}
                                            onChange={() => handleOptionChange(index, optionIndex.toString())}
                                            className="form-radio w-4 h-4 text-[#1ecdf8] focus:ring-[#1ecdf8]"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6 text-right">
                    <button
                        className="bg-primary text-black px-8 py-2  font-semibold hover:bg-secondary"
                        onClick={handleSubmit}
                    >
                        Submit Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
