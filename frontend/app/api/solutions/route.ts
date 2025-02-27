import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { answers } = await req.json();
        
        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json(
                { error: 'No answers provided' },
                { status: 400 }
            );
        }

        console.log('Received answers:', answers);

        // Format answers for the prompt
        const formattedAnswers = Object.entries(answers)
            .map(([question, answer]) => `${question}: ${answer}`)
            .join('\n');

        console.log('Formatted answers:', formattedAnswers);

        const prompt = `
As a healthcare analysis AI, analyze the following patient responses and provide structured recommendations:

${formattedAnswers}

Based on these responses, provide:
1. Three potential causes for the reported symptoms/issues
2. For each cause, provide three practical solutions

Format your response exactly as this JSON structure:
{
    "causes": [
        {
            "title": "Clear title of the cause",
            "description": "Detailed explanation of why this might be a cause",
            "solutions": [
                {
                    "title": "Solution name",
                    "steps": ["Specific step 1", "Specific step 2", "Specific step 3"],
                    "timeframe": "Expected time to see results",
                    "description": "Detailed explanation of how this solution helps"
                }
            ]
        }
    ]
}`;

        console.log('Sending request to OpenAI...');

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
        });

        console.log('Received response from OpenAI');

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        console.log('OpenAI response content:', content);

        const solution = JSON.parse(content);
        return NextResponse.json(solution);

    } catch (error) {
        console.error('Error generating solution:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate solution' },
            { status: 500 }
        );
    }
}
