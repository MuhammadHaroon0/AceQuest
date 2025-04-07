from operator import itemgetter
from langchain.prompts import PromptTemplate
from configuration import str_model
from langchain_core.output_parsers import StrOutputParser,JsonOutputParser

from pydantic import BaseModel
from typing import List

class QuizQuestion(BaseModel):
    question: str
    answers: List[str]
    correctAnswerIndex: int

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

class InterviewQuestion(BaseModel):
    question: str
    answer: str

class InterviewResponse(BaseModel):
    questions: List[InterviewQuestion]

json_parser_for_quiz = JsonOutputParser(pydantic_object=QuizResponse)
json_parser_for_interview = JsonOutputParser(pydantic_object=InterviewResponse)


# JSON template for quizzes
json_quiz_template = """
  Text: {text}

  Convert the above quiz into a valid JSON, strictly following this schema:
  {{
    "questions": [
      {{
        "question": "What is Node.js?",
        "answers": ["Node.js is a JavaScript compiler.", "Node.js is a database.","Node.js is a framework.","Node.js is a JavaScript runtime."],
        "correctAnswerIndex": 3
      }},
      {{
        "question": "What is npm?",
        "answers": ["npm is a package manager.", "npm is a programming language.","npm is a JavaScript runtime.","npm is a framework."],
        "correctAnswerIndex": 0
      }}
    ]
  }}
  Remember correctAnswerIndex to be a valid array index present in answers array.
"""

# JSON template for interview questions
json_interview_template = """
  Text: {text}

  Convert the above text into a valid JSON object, strictly following this format:
  {{
    "questions": [
      {{
        "question": "What is Node.js?",
        "answer": "Node.js is a JavaScript runtime."
      }},
      {{
        "question": "What is npm?",
        "answer": "npm is a package manager."
      }}
    ]
  }}
"""

questions_prompt = PromptTemplate.from_template(
    json_quiz_template, partial_variables={"format_instructions": json_parser_for_quiz.get_format_instructions()}
)
interview_prompt = PromptTemplate.from_template(
    json_interview_template, partial_variables={"format_instructions": json_parser_for_interview.get_format_instructions()}
)

json_chain_for_quizzes = (
    {"text": itemgetter("text")}
    | questions_prompt
    | str_model
    | StrOutputParser()
    | json_parser_for_quiz
)
json_chain_for_interview = (
    {"text": itemgetter("text")}
    | interview_prompt
    | str_model
    | StrOutputParser()
    | json_parser_for_interview
)

def convert_to_json(questions, is_interview=False):
    """
    Converts generated questions into JSON format.
    """
    results=[]
    json_chain = json_chain_for_interview if is_interview else json_chain_for_quizzes
    if is_interview:
        results=json_chain.invoke({"text": questions})
    else:
        results=[]
        for question in questions:
            results.append(json_chain.invoke({"text": question}))

    return results
