'use client';

import Image from "next/image";
import { Progress } from "@nextui-org/progress";
import React, { useEffect, useState, KeyboardEvent } from "react";
import { CheckboxGroup, Radio, RadioGroup, Input, Textarea } from "@nextui-org/react";
import { CustomCheckbox } from "./CustomCheckbox";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import questionBank from './questions.json';

interface BaseQuestion {
    id: string;
    text: string;
    type: string;
    required: boolean;
    confidential?: boolean;
}

interface MultipleChoiceQuestionData {
    id: string;
    text: string;
    type: 'multiple_choice';
    required: boolean;
    confidential?: boolean;
    options: string[];
    allowMultiple: boolean;
}

interface ShortAnswerQuestionData {
    id: string;
    text: string;
    type: 'short_answer';
    required: boolean;
    confidential?: boolean;
    minLength?: number;
}

interface ScaleQuestionData {
    id: string;
    text: string;
    type: 'scale';
    required: boolean;
    confidential?: boolean;
    options: string[];
}

type Question = MultipleChoiceQuestionData | ShortAnswerQuestionData | ScaleQuestionData;

interface Category {
    id: string;
    name: string;
    description: string;
    questions: Question[];
}

interface QuestionBank {
    version: string;
    categories: Category[];
}

interface QuestionState {
    currentCategoryIndex: number;
    currentQuestionIndex: number;
    answers: Map<string, any>;
    groupSelected: string[];
}

const typedQuestionBank = questionBank as QuestionBank;

const QuestionWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-lg mx-auto p-4 rounded-lg">
        {children}
    </div>
);

export default function QuestionsPage() {
    const router = useRouter();
    const [state, setState] = useState<QuestionState>({
        currentCategoryIndex: 0,
        currentQuestionIndex: 0,
        answers: new Map(),
        groupSelected: [],
    });

    const currentCategory = typedQuestionBank.categories[state.currentCategoryIndex];
    const currentQuestion = currentCategory.questions[state.currentQuestionIndex] as Question;
    const totalQuestions = typedQuestionBank.categories.reduce((acc, cat) => acc + cat.questions.length, 0);
    const questionsAnswered = state.answers.size;
    const progress = (questionsAnswered / totalQuestions) * 100;

    const handleNext = () => {
        if (currentQuestion.required && !state.answers.get(currentQuestion.id)) {
            alert('This question is required');
            return;
        }

        setState(prevState => {
            if (prevState.currentQuestionIndex < currentCategory.questions.length - 1) {
                return {
                    ...prevState,
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    groupSelected: [],
                };
            } else if (prevState.currentCategoryIndex < typedQuestionBank.categories.length - 1) {
                return {
                    ...prevState,
                    currentCategoryIndex: prevState.currentCategoryIndex + 1,
                    currentQuestionIndex: 0,
                    groupSelected: [],
                };
            } else {
                const answersObj = Object.fromEntries(prevState.answers);
                localStorage.setItem('questionAnswers', JSON.stringify(answersObj));
                console.log('Quiz answers:', answersObj);
                router.push('/solutions');
                return prevState;
            }
        });
    };

    const handleBack = () => {
        setState(prevState => {
            if (prevState.currentQuestionIndex > 0) {
                return {
                    ...prevState,
                    currentQuestionIndex: prevState.currentQuestionIndex - 1,
                };
            } else if (prevState.currentCategoryIndex > 0) {
                const prevCategory = typedQuestionBank.categories[prevState.currentCategoryIndex - 1];
                return {
                    ...prevState,
                    currentCategoryIndex: prevState.currentCategoryIndex - 1,
                    currentQuestionIndex: prevCategory.questions.length - 1,
                };
            }
            return prevState;
        });
    };

    const handleAnswer = (value: any) => {
        setState(prevState => ({
            ...prevState,
            answers: new Map(prevState.answers).set(currentQuestion.id, value),
        }));
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleNext();
        }
    };

    const handleGroupSelect = (value: string[]) => {
        setState(prevState => ({
            ...prevState,
            groupSelected: value,
            answers: new Map(prevState.answers).set(currentQuestion.id, value),
        }));
    };

    const renderQuestion = () => {
        const capitalizeFirstLetter = (str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        if (currentQuestion.type === 'multiple_choice') {
            const mcQuestion = currentQuestion as MultipleChoiceQuestionData;
            return mcQuestion.allowMultiple ? (
                <CheckboxGroup
                    value={state.groupSelected}
                    onValueChange={handleGroupSelect}
                    className="flex flex-col space-y-4"
                >
                    {mcQuestion.options.map((option) => (
                        <div key={option} className="transform transition-all duration-200 hover:scale-[1.02]">
                            <CustomCheckbox value={option}>
                                {capitalizeFirstLetter(option)}
                            </CustomCheckbox>
                        </div>
                    ))}
                </CheckboxGroup>
            ) : (
                <RadioGroup
                    value={state.answers.get(mcQuestion.id) || ''}
                    onValueChange={handleAnswer}
                    className="flex flex-col space-y-4"
                >
                    {mcQuestion.options.map((option) => (
                        <div key={option} className="w-full transform transition-all duration-200 hover:scale-[1.02]">
                            <Radio 
                                value={option}
                                className="bg-gray-800 hover:bg-gray-700 w-full p-3.5 rounded-lg border-2 border-transparent hover:border-gray-600"
                            >
                                <div className="text-white text-lg">{capitalizeFirstLetter(option)}</div>
                            </Radio>
                        </div>
                    ))}
                </RadioGroup>
            );
        }

        if (currentQuestion.type === 'short_answer') {
            const saQuestion = currentQuestion as ShortAnswerQuestionData;
            return saQuestion.minLength ? (
                <Textarea
                    value={state.answers.get(saQuestion.id) || ''}
                    onValueChange={handleAnswer}
                    onKeyDown={handleKeyPress}
                    minRows={3}
                    placeholder="Enter your answer..."
                    className="text-white bg-gray-800"
                />
            ) : (
                <Input
                    value={state.answers.get(saQuestion.id) || ''}
                    onValueChange={handleAnswer}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter your answer..."
                    className="text-white bg-gray-800"
                />
            );
        }

        if (currentQuestion.type === 'scale') {
            const scaleQuestion = currentQuestion as ScaleQuestionData;
            return (
                <RadioGroup
                    orientation="horizontal"
                    value={state.answers.get(scaleQuestion.id)?.toString() || ''}
                    onValueChange={(value) => handleAnswer(parseInt(value))}
                    className="flex flex-wrap gap-3 justify-center"
                >
                    {scaleQuestion.options.map((num) => (
                        <Radio
                            key={num}
                            value={num}
                            className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-lg border-2 border-transparent hover:border-gray-600"
                        >
                            <div className="text-white text-lg">{num}</div>
                        </Radio>
                    ))}
                </RadioGroup>
            );
        }

        return null;
    };

    return (
        <div className="bg-gray-900 min-h-screen relative">
            <div className="absolute top-0 left-0 p-4 z-10">
                <Image
                    src="https://i.postimg.cc/pTJQR9k2/Screenshot-2024-11-02-at-10-50-04-AM.png"
                    width={100}
                    height={100}
                    alt="Logo"
                    priority
                />
            </div>
            
            <div className="flex flex-col items-center justify-start pt-32 px-8">
                <div className="w-full max-w-lg mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">{currentCategory.name}</h2>
                    <p className="text-gray-400 mb-4">{currentCategory.description}</p>
                    <Progress
                        aria-label="Progress"
                        value={progress}
                        className="max-w-md"
                        color="success"
                    />
                </div>

                <QuestionWrapper>
                    <div className="mb-6">
                        <h3 className="text-xl text-white mb-4">{currentQuestion.text}</h3>
                        <div className="flex gap-2">
                            {currentQuestion.required && (
                                <span className="text-red-500 text-sm">* Required</span>
                            )}
                            {currentQuestion.confidential && (
                                <span className="text-yellow-500 text-sm">(Confidential)</span>
                            )}
                        </div>
                    </div>
                    {renderQuestion()}
                </QuestionWrapper>

                <div className="flex justify-between w-full max-w-lg mt-8">
                    <Button
                        onClick={handleBack}
                        disabled={state.currentCategoryIndex === 0 && state.currentQuestionIndex === 0}
                        className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="bg-blue-700 text-white hover:bg-blue-600"
                    >
                        {state.currentCategoryIndex === typedQuestionBank.categories.length - 1 &&
                        state.currentQuestionIndex === currentCategory.questions.length - 1
                            ? "Get Solutions"
                            : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
}