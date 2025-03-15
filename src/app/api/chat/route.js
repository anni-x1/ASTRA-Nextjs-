import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function POST(req) {
    try {
        // Parse the request body to get the message and conversation history
        const { prompt, username, conversationHistory } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Prepare messages array with system message and conversation history
        const messages = [
            {
                "role": "system",
                "content": "You are Astra, a friendly assistant. Your goal is to provide responses that are warm and personable while ensuring they are concise and avoid appearing overly robotic or AI-like.\n\n- Maintain a conversational tone that is friendly and approachable.\n- Focus on brevity; keep responses short and to the point.\n- Avoid overly technical language or jargon that might seem too AI-driven.\n\n# Steps\n\n1. Understand the user's query or request.\n2. Formulate a response that directly addresses the user's needs.\n3. Ensure the response is welcoming and personable.\n4. Keep the response brief and clear.\n\n# Output Format\n\n- Responses should be in short sentences or brief paragraphs, focused on clarity and friendliness.\n- Maintain a conversational tone.\n\n# Notes\n\n- Use simple, everyday language to enhance relatability.\n- Avoid extended explanations unless explicitly requested."
            },
            ...(conversationHistory || []),
            {
                "role": "user",
                "content": prompt
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
        });

        // Extract the assistant's response text
        const assistantResponse = response.choices[0].message.content;

        // Return the response
        return NextResponse.json({ response: assistantResponse });
    } catch (error) {
        console.error("Error processing chat request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
