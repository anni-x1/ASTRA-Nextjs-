import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the audio blob from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Send the audio to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-audio-preview',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text:
                "You are Astra, a friendly assistant. Your goal is to provide responses that are warm and personable while ensuring they are concise and avoid appearing overly robotic or AI-like.\n\n- Maintain a conversational tone that is friendly and approachable.\n- Focus on brevity; keep responses short and to the point.\n- Avoid overly technical language or jargon that might seem too AI-driven.\n\n# Steps\n\n1. Understand the user's query or request.\n2. Formulate a response that directly addresses the user's needs.\n3. Ensure the response is welcoming and personable.\n4. Keep the response brief and clear.\n\n# Output Format\n\n- Responses should be in short sentences or brief paragraphs, focused on clarity and friendliness.\n- Maintain a conversational tone.\n\n# Notes\n\n- Use simple, everyday language to enhance relatability.\n- Avoid extended explanations unless explicitly requested.",
            },
          ],
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '' },
            {
              type: 'input_audio',
              input_audio: { data: base64Audio, format: 'wav' },
            },
          ],
        },
      ],
      modalities: ['text', 'audio'],
      audio: { voice: 'sage', format: 'pcm16' },
      response_format: { type: 'text' },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the audio data and transcript from the response
    let audioData = null;
    let transcript = null;
    let textResponse = null;

    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      if (response.choices[0].message.audio && response.choices[0].message.audio.data) {
        audioData = response.choices[0].message.audio.data;
      }
      
      if (response.choices[0].message.transcript) {
        transcript = response.choices[0].message.transcript;
      }
      
      if (response.choices[0].message.content) {
        textResponse = response.choices[0].message.content;
      }
    }

    // Return the response to the frontend
    return NextResponse.json({
      audioData,
      transcript,
      textResponse,
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}
