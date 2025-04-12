import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { getTranscription } from './groqTranscription';
import { connectToMongoDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/models/User";

export async function POST(request) {
  try {
    // Get the audio blob from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const username = formData.get('username');
    await connectToMongoDB();
    const user = await User.findOne({ username });

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the audio file to a buffer and then to base64 for OpenAI
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    // Write the audio buffer to a temporary file for Groq transcription
    const tempFilePath = join(tmpdir(), 'audio_temp.m4a');
    fs.writeFileSync(tempFilePath, buffer);

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Send the audio to OpenAI for an intelligent response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-audio-preview',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text:
                "You are Astra, a friendly assistant. Your goal is to provide responses that are warm and personable while ensuring they are concise and avoid appearing overly robotic or AI-like. Keep responses short and to the point, only one sentence.",
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
    // console.log(response);

    // Extract response details from OpenAI
    let audioData = null;
    audioData = response.choices[0].message.audio.data;

    // Get the transcription from our Groq module
    const groqTranscription = await getTranscription(tempFilePath);
    const transcription = groqTranscription.transcription;
    console.log("groqTranscription", transcription);
    //  Save the new messages to the user's history
    user.transcriptions.push(
      {
        "role": "user",
        "content": groqTranscription.transcription
      },
      {
        "role": "assistant",
        "content": response.choices[0].message.audio.transcript
      }
    );
    const userTranscriptions = groqTranscription.transcription;
    const assistantTranscriptions = response.choices[0].message.audio.transcript;

    await user.save();

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    // Return the combined response to the frontend
    return NextResponse.json({
      audioData,
      userTranscriptions,
      assistantTranscriptions
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}
