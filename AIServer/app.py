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
def assess_interview(video_file: UploadFile = File(...), user_answers: str = Form(...),
correct_answers: str = Form(...)
):
    """API endpoint to process an interview video"""

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_video:
        temp_video.write(video_file.file.read())
        temp_video_path = temp_video.name

    # Open video file
    cap = cv2.VideoCapture(temp_video_path)
    frame_skip = 10  # Process every 5th frame to speed up
    frame_count = 0
    frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_skip == 0:
            frames.append(frame)  
        frame_count += 1
    cap.release()

    # Use ThreadPoolExecutor to process frames in parallel
    pred = 0
    total_frames = 0

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(process_frame, frames)  # Process frames concurrently

    for res in results:
        pred += sum(res)
        total_frames += len(res)

    confidence_score = pred // total_frames if total_frames > 0 else 0
    temp_video.close()
    
    
    interview_score = evaluate_answers(correct_answers, user_answers)  
    return {"confidence_score":confidence_score,"interview_score":interview_score}


