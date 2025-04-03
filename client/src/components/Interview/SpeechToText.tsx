import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface SpeechToTextComponentProps {
    setTranscript: React.Dispatch<React.SetStateAction<string>>;
}

const SpeechToTextComponent: React.FC<SpeechToTextComponentProps> = ({ setTranscript }) => {

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            enqueueSnackbar('Speech Recognition API is not supported in this browser. Use Google Chrome or Microsoft Edge instead!');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setTranscript((prevTranscript) => prevTranscript + ' ' + transcriptPart);
                } else {
                    interimTranscript += transcriptPart;
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
        };
        recognition.start();

        return () => {
            recognition.stop();
        };
    }, []);

    return (
        <div>
        </div>
    );
};

export default SpeechToTextComponent;