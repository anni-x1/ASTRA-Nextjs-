import OpenAI from "openai";
import { connectToMongoDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        // Parse request body
        const { prompt, username, personalityId, personalityName, systemMessage } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        await connectToMongoDB();

        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the chat session for the selected personality
        let chatSession = user.chats.find(chat => chat .personalityId === personalityId);

        if (!chatSession) {
            // Create a new chat session if none exists for this personality
            chatSession = { personalityId, personalityName, messages: [] };
            user.chats.push(chatSession);
        }

        // Prepare messages array
        const messages = [
            { "role": "system", "content": systemMessage},
            ...chatSession.messages,
            { "role": "user", "content": prompt }
        ];

        // Get response from OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
        });

        // Extract response
        const assistantResponse = response.choices[0].message.content;

        // Save chat history for this personality
        chatSession.messages.push(
            { role: "user", content: prompt },
            { role: "assistant", content: assistantResponse }
        );

        await user.save();

        return NextResponse.json({ response: assistantResponse });
    } catch (error) {
        console.error("Error processing chat request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
