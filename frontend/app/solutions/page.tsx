'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import Image from "next/image";

interface Solution {
    title: string;
    steps: string[];
    timeframe: string;
    description: string;
}

interface Cause {
    title: string;
    description: string;
    solutions: Solution[];
}

interface SolutionResponse {
    causes: Cause[];
}

export default function SolutionsPage() {
    const router = useRouter();
    const [solutions, setSolutions] = useState<SolutionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                // Get answers from localStorage
                const answers = localStorage.getItem('questionAnswers');
                if (!answers) {
                    setError('No answers found. Please complete the questionnaire first.');
                    setIsLoading(false);
                    return;
                }

                console.log('Sending answers to API:', answers);

                const response = await fetch('/api/solutions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ answers: JSON.parse(answers) }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate solutions');
                }

                const data = await response.json();
                console.log('Received solutions:', data);
                setSolutions(data);
            } catch (err) {
                console.error('Error in solutions page:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSolutions();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-black min-h-screen flex flex-col items-center justify-center p-8">
                <Image
                    src="https://i.postimg.cc/pTJQR9k2/Screenshot-2024-11-02-at-10-50-04-AM.png"
                    width={200}
                    height={200}
                    alt="Logo"
                    className="mb-8"
                />
                <Spinner size="lg" color="white" />
                <p className="text-white mt-4">Analyzing your responses and generating personalized solutions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black min-h-screen flex flex-col items-center justify-center p-8">
                <Image
                    src="https://i.postimg.cc/pTJQR9k2/Screenshot-2024-11-02-at-10-50-04-AM.png"
                    width={200}
                    height={200}
                    alt="Logo"
                    className="mb-8"
                />
                <p className="text-white text-xl mb-4">{error}</p>
                <Button 
                    onClick={() => router.push('/')}
                    className="bg-blue-600 text-white"
                >
                    Back to Questionnaire
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-8">
                    <Image
                        src="https://i.postimg.cc/pTJQR9k2/Screenshot-2024-11-02-at-10-50-04-AM.png"
                        width={200}
                        height={200}
                        alt="Logo"
                    />
                </div>

                <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Personalized Health Solutions</h1>

                <div className="space-y-6">
                    {solutions?.causes.map((cause, causeIndex) => (
                        <Card 
                            key={causeIndex}
                            className="bg-gray-900 text-white"
                        >
                            <CardHeader className="flex gap-3">
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold">Potential Cause {causeIndex + 1}</p>
                                    <p className="text-small text-white/60">{cause.title}</p>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <p className="text-white/80 mb-4">{cause.description}</p>
                                
                                <div className="space-y-4">
                                    {cause.solutions.map((solution, solutionIndex) => (
                                        <Card 
                                            key={solutionIndex}
                                            className="bg-gray-800"
                                        >
                                            <CardHeader>
                                                <div className="flex flex-col">
                                                    <p className="text-lg font-semibold">Solution {solutionIndex + 1}</p>
                                                    <p className="text-small text-white/60">{solution.title}</p>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="font-semibold mb-2">Steps:</p>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {solution.steps.map((step, stepIndex) => (
                                                                <li key={stepIndex} className="text-white/80">{step}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-2">Expected Timeframe:</p>
                                                        <p className="text-white/80">{solution.timeframe}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-2">Details:</p>
                                                        <p className="text-white/80">{solution.description}</p>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <Button 
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white"
                    >
                        Take Questionnaire Again
                    </Button>
                </div>
            </div>
        </div>
    );
}
