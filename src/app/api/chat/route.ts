import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace string with environment variable in production
const API_KEY = "AIzaSyBa90oU4AOoYA_dINnNhZwfeFPJsq0lF7g";
const genAI = new GoogleGenerativeAI(API_KEY);

// You can use a specific Gemini model, like 'gemini-1.5-flash' or 'gemini-1.5-pro'
const aiModel = "gemini-1.5-flash"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: aiModel });

    // Construct the full prompt combining the user's message and the hidden context
    const fullPrompt = `
You are an expert financial AI assistant integrated into "Phase X Trading Platform". 
Your job is to cleanly analyze market data and give precise, professional, and directly useful insights.

### Market Context (HIDDEN FROM USER)
Analyze the following context before answering:
${context}

### User User/Prompt
${prompt}

### Instructions:
- Answer in the same language the user asks the question in (Arabic or English).
- Be concise. Use bullet points for readability.
- If the user asks about the current state, use the exact data provided in the Market Context.
- Do NOT hallucinate data. If the data is missing, say you don't have enough data.
- Mention "Phase X State", "Displacement", "Oscillation", etc., if they are relevant to the user's question and context.
- Format the response beautifully using markdown (bolding key numbers).
`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again later." },
      { status: 500 }
    );
  }
}
