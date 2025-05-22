from operator import itemgetter
from langchain.prompts import PromptTemplate
from configuration import str_model

from langchain_core.output_parsers import StrOutputParser

str_parser = StrOutputParser()

# Template for generating multiple-choice questions
questions_template = """
  You are given a context containing technical Q&A. Generate multiple-choice questions 
  for technical candidate assessments based on given context. Each question should have 3 incorrect answers and 1 correct answer. Do not generate a question if it should'nt be asked in technical assessment of candidate. Be concise and straight to the point.
  Strictly follow this format below:
  - MCQ:
    QUESTION: ...
    OPTIONS:
    A. ...
    B. ...
    C. ...
    D. ...
    ANSWER: B

    Here is the context:
  Context: {context}
"""

# Template for generating interview questions
interview_template = """You are an AI assistant that generates technical interview questions based on the provided context. 
Your goal is to create clear, relevant, and technically sound questions suitable for assessing a candidate's knowledge in a professional interview setting.

Instructions:
- Only generate questions that are directly supported by the context.
- Avoid vague or opinion-based questions.
- Focus on key technical concepts, terminology, workflows, or problem-solving aspects.
- Each question must have a precise, fact-based answer.
- Do NOT generate a question if there is no valid answer in the context.

Use the format below:
QUESTION: <Write the technical question here>
ANSWER: <Write the accurate answer here>

Context:
{context}
"""


questions_prompt = PromptTemplate.from_template(questions_template)
interview_prompt = PromptTemplate.from_template(interview_template)

questions_chain = (
    {"context": itemgetter("context")}
    | questions_prompt
    | str_model
    | str_parser
)

interview_chain = (
    {"context": itemgetter("context")}
    | interview_prompt
    | str_model
    | str_parser
)

def generate_questions(context,num_questions):
    """
    Generates multiple-choice questions from a given technical context.
    """
    generated_questions = []
    for i in range(0, num_questions, 5):
        questions = questions_chain.invoke({'context': context[i:i+5]})
        generated_questions.append(questions)
    
    return generated_questions

def generate_interview_questions(context,num_questions):
    """
    Generates direct interview questions from a given technical context.
    """
   
    generated_questions = []
    for i in range(len(context)-num_questions, len(context),5):
        questions = interview_chain.invoke({'context': context[i:i+5]})
        generated_questions.append(questions)
    
    return generated_questions
    
    
    return questions
