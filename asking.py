import json

with open('questions.json') as f:
    questions = json.load(f) 

response = {}

for question in questions:
    print(question)
    question_text = question.get('text')
    answer = input(question_text + ": ")
    response[question_text] = answer