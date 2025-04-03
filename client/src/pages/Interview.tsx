import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import Spinner from '../components/common/Spinner';
import useAuthStore from '../stores/useAuthStore';
import SpeechToText from '../components/Interview/SpeechToText';
import Webcam from "react-webcam";
import { useVoiceToText } from 'react-speakup';

interface Interview {
    _id: string;
    question: string;
}

const Interview: React.FC = () => {
    const webcamRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState(60); // Set initial time in seconds
    const { token } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [interview, setInterview] = useState<Interview[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const { user } = useAuthStore()

    const navigate = useNavigate()

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const startAutoRecording = async () => {
            try {
                // Get webcam stream with audio
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                // Initialize MediaRecorder
                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp9,opus'
                });

                // Collect video/audio data chunks
                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        setRecordedChunks(prev => [...prev, e.data]);
                    }
                };

                mediaRecorderRef.current.start(1000); // Collect chunks every second

            } catch (error) {
                console.error('Error starting recording:', error);
            }
        };

        // Start recording immediately on mount
        startAutoRecording();

        // Cleanup on unmount
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream
                    .getTracks()
                    .forEach(track => track.stop());
            }
        };
    }, []);

    const { startListening, stopListening, transcript } = useVoiceToText();
    useEffect(() => {
        startListening();
        return () => stopListening();
    }, []);

    const handleNext = () => {
        if (currentQuestionIndex < interview.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex => currentQuestionIndex + 1);
        } else {
            stopListening(); // Stop recognition
            setLoading(true)
            setTimeout(() => {

                handleSubmit(transcript);
            }, 2000);
        }
    };

    const handleSubmit = async (submittedAnswers: string) => {


        if (!token)
            return
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        const blob = new Blob(recordedChunks, { type: "video/webm" });

        // Convert to File
        const videoFile = new File([blob], "interview.webm", {
            type: "video/webm",
        });

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("answers", submittedAnswers);

        if (user?.accountType === 'student') {
            setTimeout(async () => {
                try {
                    const response = await axios.post(apiRoutes.submitInterviewResult(token), formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    enqueueSnackbar(response.data.status);
                    navigate(`/assessment/${token}`);
                } catch (error) {
                    enqueueSnackbar(axios.isAxiosError(error) ? error.response?.data?.message || 'An error occurred' : 'An unexpected error occurred');
                }
                finally {
                    setLoading(false)
                }
            }, 1000);
            return
        }

        else if (user?.accountType === 'company')
            return
        setTimeout(async () => {


            try {
                const response = await axios.post(apiRoutes.addInterviewResult(token), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                enqueueSnackbar("Success")
                navigate('/')
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    enqueueSnackbar(error.response?.data?.message || 'An error occurred');
                } else {
                    enqueueSnackbar('An unexpected error occurred');
                }
            }
            finally {
                setLoading(false)
            }
        }, 1000);
    };

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };


    const getJob = async (token: string) => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(apiRoutes.getJob(token))
            setInterview(response.data.data.interview)
            setTimeLeft(response.data.data.interview.length * 1000)

        } catch (error) {
            enqueueSnackbar("An error occurred fetching the assessments")

        }
        finally {
            setLoading(false)
        }
    }



    const fetchInterview = async () => {

        if (!token)
            return
        if (user?.accountType === 'student') {
            getJob(token)
            return
        }
        else if (user?.accountType === 'company')
            return

        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getCandidateInterview(token));
            setInterview(response.data.data);
            setTimeLeft(response.data.data.length * 60)
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

    useEffect(() => {
        fetchInterview();
    }, [token]);


    if (loading)
        return (
            <div className='h-screen'>
                <Spinner />
            </div>
        )
    return (
        <div className="grid min-h-screen md:grid-cols-2 p-12 gap-2">
            {/* Left Half - Question */}
            <div className="flex items-center justify-center text-white shadow-md">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h1>
                    <p className="text-lg">{interview[currentQuestionIndex]?.question}</p>
                </div>
            </div>

            {/* Right Half - Video + Timer */}
            <div className="flex flex-col h-full items-center justify-between p-6">
                {/* Video Camera */}
                <div className="w-full h-2/3 bg-black rounded-md border border-primary mb-4">
                    <Webcam audio={true} ref={webcamRef} muted={true} />
                </div>

                {/* Timer */}
                <div className="text-center mt-8">
                    <p className="text-xl font-semibold">Total Questions: {interview.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-semibold">Time Left: {formatTime(timeLeft)}</p>
                </div>

                {/* Next Button */}
                <div className="flex w-full justify-end">
                    <button className='bg-primary text-black p-3 rounded-2xl' onClick={handleNext}>
                        {currentQuestionIndex < interview.length - 1 ? 'Next' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;