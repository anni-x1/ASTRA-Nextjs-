'use client'
import { useState, useContext } from 'react';
import { AppContext } from '../context';

/**
 * Custom hook for audio recording functionality
 * @returns {Object} Recording functions and state
 */
const useListen = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [error, setError] = useState(null);
  const { audioBlob, setAudioBlob } = useContext(AppContext);

  /**
   * Converts audio blob to WAV format
   * @param {Blob} blob - The audio blob to convert
   * @returns {Promise<Blob>} A promise that resolves with the WAV blob
   */
  const convertToWav = async (blob) => {
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Decode the audio data from the blob
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create a WAV file from the audio buffer
      const wavBlob = await encodeWavFile(audioBuffer);
      
      return wavBlob;
    } catch (err) {
      console.error('Error converting to WAV:', err);
      setError(`Failed to convert to WAV: ${err.message}`);
      // Return the original blob if conversion fails
      return blob;
    }
  };

  /**
   * Encodes an AudioBuffer to a WAV file
   * @param {AudioBuffer} audioBuffer - The audio buffer to encode
   * @returns {Blob} The WAV blob
   */
  const encodeWavFile = (audioBuffer) => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM format
    const bitDepth = 16; // 16-bit audio
    
    // Extract the raw audio data
    const channelData = [];
    for (let channel = 0; channel < numChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }
    
    // Calculate the total file size
    const dataLength = channelData[0].length * numChannels * (bitDepth / 8);
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);
    
    // Write the WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true); // audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // byte rate
    view.setUint16(32, numChannels * (bitDepth / 8), true); // block align
    view.setUint16(34, bitDepth, true);
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write the PCM samples
    const offset = 44;
    const volume = 1;
    let position = offset;
    
    for (let i = 0; i < channelData[0].length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        // Convert float audio data to 16-bit PCM
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(position, value, true);
        position += 2;
      }
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  };

  /**
   * Helper function to write a string to a DataView
   */
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  /**
   * Starts recording audio from the microphone
   * @returns {Promise<boolean>} Success status
   */
  const startRecording = async () => {
    try {
      // Reset states
      setAudioChunks([]);
      setAudioBlob(null);
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Find the best supported MIME type
      let mimeType = 'audio/webm';
      
      // Check if specific codecs are supported
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }
      
      // Create a new MediaRecorder instance with the supported MIME type
      const recorder = new MediaRecorder(stream, { mimeType });
      
      // Create a local array to collect chunks
      let chunks = [];
      
      // Set up event handlers
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks(chunks);
        }
      };

      // Start recording and request data every 1 second
      recorder.start(1000);
      setMediaRecorder(recorder);
      setRecording(true);
      
      return true;
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
      console.error('Error starting recording:', err);
      return false;
    }
  };

  /**
   * Stops recording and returns the audio blob
   * @returns {Promise<Blob|null>} The recorded audio as a Blob
   */
  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        setError('No active recording to stop');
        resolve(null);
        return;
      }

      // Request final data
      mediaRecorder.requestData();

      // Set up the onstop handler to create the blob when recording stops
      mediaRecorder.onstop = async () => {
        // Create a blob from all the audio chunks with the original format
        const originalBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        
        // Convert the blob to WAV format
        const wavBlob = await convertToWav(originalBlob);
        
        // Update the audio blob in the context
        setAudioBlob(wavBlob);
        setRecording(false);
        
        // Stop all audio tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        console.log('Recording stopped, WAV blob created with size:', wavBlob.size);
        resolve(wavBlob);
      };
      // Stop the recording
      mediaRecorder.stop();
    });
  };

  return {
    startRecording,
    stopRecording,
    recording,
    audioBlob,
    error
  };
};

export default useListen;
