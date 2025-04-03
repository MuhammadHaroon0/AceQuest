import { Fragment, useEffect, useState } from "react";
import apiRoutes from "../../utils/apiRoutes";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from "../common/Spinner";
import Performance from "./Performance";
import useAuthStore from "../../stores/useAuthStore";

interface PerformanceModalProps {
    isOpen: boolean;
    closeModal: () => void;
    username?: string;
    candidateId?: string;
    jobId?: string
}

interface Performance {
    quizScore: number;
    interviewScore: number;
    confidenceScore: number;
    quizCorrectAnswers: number;
}

const PerformanceModal: React.FC<PerformanceModalProps> = ({ isOpen, closeModal, username, candidateId, jobId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [performance, setPerformance] = useState<Performance>();


    const fetchPerformanceForCandidate = async () => {

        if (!candidateId)
            return
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getPerformanceByCandidateId(candidateId));
            setPerformance(response.data.data.performance);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred fetching candidate performance');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformanceForStudent = async () => {
        if (!jobId)
            return

        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getMyPerformance(jobId));

            setPerformance(response.data.data);


        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');

            } else {
                enqueueSnackbar('An unexpected error occurred fetching candidate performance');
            }
        } finally {
            setLoading(false);
        }
    };
    const { user } = useAuthStore()
    useEffect(() => {
        if (isOpen) {
            if (user?.accountType === 'student')
                fetchPerformanceForStudent()
            else
                fetchPerformanceForCandidate()

        }
    }, [isOpen])


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
                            <Dialog.Panel className="w-full transform overflow-y-auto rounded-2xl bg-richblack-800 p-6 text-left h-full align-middle transition-all border shadow-primary shadow-[0px_0px_6px_0px]">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                                    {username}
                                </Dialog.Title>
                                <div className='my-4'>
                                    {
                                        loading ?
                                            <Spinner /> :
                                            performance && (<Performance quizScore={performance.quizScore} interviewScore={performance.interviewScore} confidenceScore={performance.confidenceScore} quizCorrectAnswers={performance.quizCorrectAnswers} />)
                                    }
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
export default PerformanceModal