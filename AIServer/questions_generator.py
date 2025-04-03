from operator import itemgetter
from langchain.prompts import PromptTemplate
from configuration import str_model

from langchain_core.output_parsers import StrOutputParser

str_parser = StrOutputParser()

# Template for generating multiple-choice questions
questions_template = """
  You are given a context containing technical Q&A. Generate multiple-choice questions 
  for technical candidate assessments based on given context. Each question should have 3 incorrect answers and 1 correct answer. Do not generate a question if it should'nt be asked in technical assessment of candidate. Be concise and straight to the point.

  Context: {context}
"""

# Template for generating interview questions
interview_template = """
  Generate technical interview questions with precise answers based on a given context. Do not generate a question if it shouldn't be asked in technical assessment of candidate.

  Context: {context}
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
        questions = questions_chain.invoke({'context': context[i:i+5]})
        generated_questions.append(questions)
    
    return generated_questions
    
    
    return questions
