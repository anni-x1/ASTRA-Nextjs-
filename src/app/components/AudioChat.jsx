export async function sendToGPT(audioBlob, username, setListening, setMessages, messages) {

  if (!audioBlob || audioBlob.size === 0) {
    console.error('No audio data available to send to OpenAI');
    return;
  }

  try {
    // Create a FormData object to send the audio blob to the backend
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('username', username);
    // Send the audio to our backend API
    const response = await fetch('/api/audioChat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datas:", data.userTranscriptions);
    console.log("Datas:", data.assistantTranscriptions);

    // First, make sure the messages is initialized properly
    const safeMessages = Array.isArray(messages) ? messages : [];
    console.log("Datas:", safeMessages);

    // Then update messages in a single call to avoid race conditions
    setMessages([
      ...safeMessages,
      { role: 'user', content: data.userTranscriptions },
      { role: 'assistant', content: data.assistantTranscriptions }
    ]);

    // Check if we have audio data in the response
    if (data.audioData) {
      // Play the audio
      playAudioFromBase64(data.audioData);
    } else {
      console.error("No audio or text data in the response");
    }
    return data;
  } catch (error) {
    console.error('Error sending audio to backend:', error);
  }
}

// Rest of the code remains unchanged
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract the base64 data from the FileReader result
      // FileReader.result is like: "data:audio/wav;base64,UklGRiXu..."
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function playAudioFromBase64(audioBase64) {
  try {
    // Convert base64 to binary
    const binaryString = atob(audioBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a blob with the PCM16 audio data
    const wavBlob = createWavFromPcm16(bytes);

    // Create an audio element and play it
    const audioUrl = URL.createObjectURL(wavBlob);
    const audio = new Audio(audioUrl);

    // Add event listeners for debugging
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
    });

    audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play through');
    });

    // Play the audio
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
    });

    // Clean up the URL object when done
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
    });
  } catch (error) {
    console.error('Error processing audio data:', error);
  }
}

function createWavFromPcm16(pcmData) {
  // WAV header parameters
  const numChannels = 1; // Mono
  const sampleRate = 24000; // OpenAI's PCM16 is typically 24kHz
  const bitsPerSample = 16; // PCM16 = 16 bits per sample

  // Calculate sizes
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = pcmData.length;
  const headerSize = 44; // Standard WAV header size
  const totalSize = headerSize + dataSize;

  // Create the WAV header
  const header = new ArrayBuffer(headerSize);
  const view = new DataView(header);

  // "RIFF" chunk descriptor
  view.setUint8(0, 'R'.charCodeAt(0));
  view.setUint8(1, 'I'.charCodeAt(0));
  view.setUint8(2, 'F'.charCodeAt(0));
  view.setUint8(3, 'F'.charCodeAt(0));

  // Chunk size (file size - 8)
  view.setUint32(4, totalSize - 8, true);

  // Format ("WAVE")
  view.setUint8(8, 'W'.charCodeAt(0));
  view.setUint8(9, 'A'.charCodeAt(0));
  view.setUint8(10, 'V'.charCodeAt(0));
  view.setUint8(11, 'E'.charCodeAt(0));

  // "fmt " sub-chunk
  view.setUint8(12, 'f'.charCodeAt(0));
  view.setUint8(13, 'm'.charCodeAt(0));
  view.setUint8(14, 't'.charCodeAt(0));
  view.setUint8(15, ' '.charCodeAt(0));

  // Sub-chunk size (16 for PCM)
  view.setUint32(16, 16, true);

  // Audio format (1 for PCM)
  view.setUint16(20, 1, true);

  // Number of channels
  view.setUint16(22, numChannels, true);

  // Sample rate
  view.setUint32(24, sampleRate, true);

  // Byte rate
  view.setUint32(28, byteRate, true);

  // Block align
  view.setUint16(32, blockAlign, true);

  // Bits per sample
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  view.setUint8(36, 'd'.charCodeAt(0));
  view.setUint8(37, 'a'.charCodeAt(0));
  view.setUint8(38, 't'.charCodeAt(0));
  view.setUint8(39, 'a'.charCodeAt(0));

  // Data size
  view.setUint32(40, dataSize, true);

  // Combine header and PCM data
  const wavBuffer = new Uint8Array(totalSize);
  wavBuffer.set(new Uint8Array(header), 0);
  wavBuffer.set(pcmData, headerSize);

  // Create and return the WAV blob
  return new Blob([wavBuffer], { type: 'audio/wav' });
}