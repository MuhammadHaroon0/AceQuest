import React, { Fragment, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { enqueueSnackbar } from 'notistack';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import useAuthStore from '../stores/useAuthStore';
import Spinner from '../components/common/Spinner';

import CandidateSection from '../components/IndividualAssessmentPage/CandidateSection';
import PerformanceModal from '../components/IndividualAssessmentPage/PerformanceModal';


interface QuizQuestion {
    question: string;
    correctAnswer: number;
    allAnswers: string[];

}


interface InterviewQuestion {
    question: string;
    answer: string;
}

interface Job {
    _id: string;
    title: string;
    description: string;
    experience: number;
    quiz: QuizQuestion[];
    interview: InterviewQuestion[];
    noOfInterviewQuestions: number;
    quizDuration: '20m' | '30m' | '45m' | '1h';
    createdAt: string;
    performance?: string
}

const IndividualAssessmentPage: React.FC = () => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const { jobId } = useParams()
    if (!jobId)
        return
    const [job, setJob] = useState<Job>()
    const [loading, setLoading] = useState<boolean>(false)
    useLayoutEffect(() => {
        const getJob = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(apiRoutes.getJob(jobId))
                setJob(response.data.data)
            } catch (error) {
                enqueueSnackbar("An error occurred fetching the assessments")

            }
            finally {
                setLoading(false)
            }
        }
        getJob()
    }, [jobId])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading)
        return (
            <div className='h-screen'>
                <Spinner />
            </div>
        )

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button className="text-gray-400 hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-semibold">{job?.title}</h1>
                    <div className="flex gap-2 text-sm text-gray-400">
                        <span>No of interview questions: {job?.noOfInterviewQuestions}</span>•<span>Quiz Duration: {job?.quizDuration}</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-4 md:mt-0">
                    {user?.accountType === 'student' ? (
                        job?.performance ?
                            <>
                                <button onClick={openModal} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700" >
                                    View Performance Report
                                </button>
                                <PerformanceModal isOpen={isModalOpen} closeModal={closeModal} jobId={job._id} />
                            </>
                            :
                            <button onClick={() => navigate(`/quiz/${job?._id}`)} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700" >
                                Attempt this Assessment
                            </button>
                    ) :
                        <>
                            <button onClick={openModal} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700" >
                                Preview
                            </button>
                            <Modal job={job} isOpen={isModalOpen} closeModal={closeModal} />
                        </>
                    }

                </div>
            </div>

            {/* Overview Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4">Overview</h2>
                <p className="text-gray-400 mb-4">
                    This assessment is designed to evaluate the skills necessary for the {job?.title} role, including analytical, interpersonal, and technical skills.
                </p>
                <div className="flex gap-4 text-gray-400 text-sm">
                    <span><strong>Created On:</strong> {job?.createdAt ? format(new Date(job.createdAt), "dd-MM-yyyy") : "N/A"}</span>
                    <span><strong>Experience level:</strong> {job?.experience} years</span>
                </div>
            </div>
            {/* Candidate Management Section */}
            {
                user && user.accountType === 'company' &&
                <>
                    <CandidateSection assessmentId={job?._id} />

                </>
            }
        </div>
    );
};


interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    job: Job | undefined;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, job }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full transform overflow-y-auto rounded-2xl bg-richblack-600 p-6 text-left h-full align-middle transition-all border shadow-primary shadow-[0px_0px_12px_0px]">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                                    {job?.title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-white">
                                        {job?.description}
                                    </p>
                                </div>
                                <div className="mt-6 mx-auto">
                                    {/* Quiz Questions Section */}
                                    <section className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 text-white">Quiz Questions</h2>
                                        <div className="space-y-6">
                                            {job?.quiz.map((q, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                                                >
                                                    <h3 className="font-semibold text-lg">{q.question}</h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm font-medium text-gray-600">Answers:</p>
                                                        <ul className="list-disc list-inside ml-4">
                                                            {q.allAnswers.map((answer, i) => (
                                                                <li
                                                                    key={i}
                                                                    className={`${answer === q.allAnswers[q.correctAnswer]
                                                                        ? "text-green-600 font-bold"
                                                                        : "text-gray-800"
                                                                        }`}
                                                                >
                                                                    {answer}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Interview Questions Section */}
                                    <section>
                                        <h2 className="text-2xl font-bold mb-4 text-white">
                                            Interview Questions
                                        </h2>
                                        <div className="space-y-6">
                                            {job?.interview.map((q, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                                                >
                                                    <h3 className="font-semibold text-lg">{q.question}</h3>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        Correct Answer:{" "}
                                                        <span className="text-green-600 font-bold">
                                                            {q.answer}
                                                        </span>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-white hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default IndividualAssessmentPage;
