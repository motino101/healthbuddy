import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Adjust the path to point to your questions.json file
        const questionsPath = path.join(process.cwd(), 'backend', 'questions.json');
        
        if (!fs.existsSync(questionsPath)) {
            console.error('Questions file not found at:', questionsPath);
            return NextResponse.json(
                { error: 'Questions file not found' },
                { status: 404 }
            );
        }

        const fileContents = fs.readFileSync(questionsPath, 'utf8');
        const questions = JSON.parse(fileContents);
        
        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error reading questions:', error);
        return NextResponse.json(
            { error: 'Failed to load questions' },
            { status: 500 }
        );
    }
}
