import concurrent.futures
from fastapi import FastAPI, HTTPException, UploadFile, File,Form
from pathlib import Path
from pydantic import BaseModel,ValidationError
from rag import extract_interview_questions,extract_quiz_questions
from skills_extractor import extract_context
import tempfile
import cv2
import re
from typing import List 
from cnn import evaluate_answers,process_frame
import logging
import shutil
import os

app = FastAPI()

class JobDescriptionRequest(BaseModel):
    jobDescription: str
    quizDuration:str
    noOfInterviewQuestions:int

@app.post("/create-assessment")
def generate_assessment(request: JobDescriptionRequest):
    num=int(re.search(r'\d+', request.quizDuration).group())
    num_total = num+request.noOfInterviewQuestions

    job_description = request.jobDescription
    context = extract_context(job_description,num_total)
    interview_questions=extract_interview_questions(context=context,noOfInterviewQuestions=request.noOfInterviewQuestions)
    quiz_questions=extract_quiz_questions(context=context,noOfQuizQuestions=num)
    
    response = {
        "quiz_questions": quiz_questions,
        "interview_questions": interview_questions
    }
    return response


@app.post("/assess-interview")
def assess_interview(video_file: UploadFile = File(...), user_answers: str = Form(...), correct_answers: str = Form(...)):
    """Process interview with resilient video handling"""
    
    # Initialize default scores
    confidence_score = 50
    interview_score = 50
    temp_video_path = None
    
    try:
        # 1. Safely save video (even if incomplete)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_video:
            shutil.copyfileobj(video_file.file, temp_video)
            temp_video_path = temp_video.name

        # 2. Attempt video processing with fallbacks
        frames = []
        cap = cv2.VideoCapture(temp_video_path)
        frame_skip = 10
        frame_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break  
                
            if frame_count % frame_skip == 0:
                frames.append(frame)
            frame_count += 1

        if frames:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                results = executor.map(process_frame, frames)

            pred = 0
            total_frames = 0
            for res in results:
                pred += sum(res)
                total_frames += len(res)

            if total_frames > 0:
                confidence_score = pred // total_frames

    except Exception as e:
        logging.error(f"Partial video processing failed: {str(e)}", exc_info=True)

    try:
        interview_score = evaluate_answers(correct_answers, user_answers)
    except Exception as e:
        logging.error(f"Answer scoring failed: {str(e)}", exc_info=True)
        interview_score = 50  # Fallback to avg score

    # 5. Cleanup with safety
    if temp_video_path and os.path.exists(temp_video_path):
        try:
            os.remove(temp_video_path)
        except OSError as e:
            logging.warning(f"Temp file cleanup failed: {str(e)}")

    return {
        "confidence_score": confidence_score,
        "interview_score": interview_score,
        "warning": "Partial video processing" if not frames else None
    }