import tensorflow as tf
import cv2
import numpy as np
from configuration import str_model
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
import ast
from fastapi import  HTTPException


with open('./config/network_emotions.json', 'r') as json_file:
    json_saved_model = json_file.read()

network_loaded = tf.keras.models.model_from_json(json_saved_model)
network_loaded.load_weights('./config/weights_emotions.hdf5')
network_loaded.compile(loss = 'categorical_crossentropy', optimizer='Adam', metrics=['accuracy'])

face_detector = cv2.CascadeClassifier('./config/haarcascade_frontalface_default.xml')
emotions = [0, 20, 10, 99, 50, 40, 60]  # Emotion mapping

def process_frame(frame):
    """Detect faces and predict emotions for a single frame"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.4, minNeighbors=5, minSize=(80, 80))
    predictions = []
    
    for (x, y, w, h) in faces:
        roi = frame[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = roi / 255.0  # Normalize
        roi = np.expand_dims(roi, axis=0)

        prediction = network_loaded.predict(roi) 
        if prediction is not None:
            result = np.argmax(prediction)
            predictions.append(emotions[result]) 

    return predictions  


def evaluate_answers(correct_answers, user_answers):
    print(correct_answers,user_answers)
    
    prompt = PromptTemplate.from_template(
    """I have taken an interview of student and recorded his response. 
    You are an exam grader that assists me in finding out if he answers correct.
    For all the questions I asked the correct answers are:
    "{correct_answers}"
    
    The student's answers are:
    "{user_answers}"
    
    Grade the answer on a scale from 0 to 100, considering accuracy, completeness, and relevance. 
    If a student's answers is empty then you should assign 0 score for that answer.
    Provide the response as a single two digit number like 95, 80, or 50 etc.
    """
    )
    chain = prompt | str_model| StrOutputParser()
    

    score=chain.invoke({"correct_answers": correct_answers, "user_answers": user_answers})
    
    result = float(score)
    print(result)
    return result