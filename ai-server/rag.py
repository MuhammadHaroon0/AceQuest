from questions_generator import generate_questions, generate_interview_questions
from json_converter import convert_to_json

def extract_quiz_questions(context,noOfQuizQuestions):
    """
    Extracts quiz-style multiple-choice questions from a job description.
    """
    generated_questions = generate_questions(context,noOfQuizQuestions)
    return convert_to_json(generated_questions)

def extract_interview_questions(context,noOfInterviewQuestions):
    """
    Extracts direct interview-style questions from a job description.
    """
    generated_questions = generate_interview_questions(context,noOfInterviewQuestions)
    return convert_to_json(generated_questions,is_interview=True)

