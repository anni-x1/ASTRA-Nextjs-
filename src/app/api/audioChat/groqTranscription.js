import fs from 'fs';
import Groq from 'groq-sdk';

export async function getTranscription(filePath) {
  // Initialize the Groq client
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Create a transcription job using the provided audio file
  const transcriptionResponse = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3-turbo",
  });
  // console.log(transcriptionResponse.text);

  // Return the transcription as a JSON object
  return { transcription: transcriptionResponse.text };
}