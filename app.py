import json
import openai
import os

# load the questions
with open('questions.json') as f:
    questions = json.load(f) 

response = {}
for question in questions:
    print(question)
    question_text = question.get('text')
    answer = input(question_text + ": ")
    response[question_text] = answer


response = "\n".join([f'{key}: {value}' for key, value in response.items()])

print(response)

# answer any question
openai.api_key = "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"
def ask_openai(question):
    chat_completion = openai.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": question,
            }
        ],
        model="gpt-3.5-turbo",
    )
    print(chat_completion.choices[0].message.content)



# TO DO: format the prompt
question = """
This is what I'm currently experiencing:

{response}

Return the answer as a list of 3 potential causes and 3 solutions each. Include a listing of step by step bullet points,
and detailed descriptions for each step. Also, give me the expected time frame for each solution.
"""

ask_openai(question)