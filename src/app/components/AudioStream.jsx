'use client'
import { useEffect, useContext } from "react";
import { AppContext } from "../context";

const Listen = () => {
  const { setSize } = useContext(AppContext); // Get setSize from Context

  useEffect(() => {
    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);

        const checkSound = () => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          
          const volume = data.reduce((a, b) => a + b, 0) / data.length; // Avg volume
          // console.log(volume)
          const newSize = 0.5 + (volume / 255) * 1; // Normalize size
          // console.log("Volume:", volume, "New size:", newSize);

          setSize(newSize);
          requestAnimationFrame(checkSound); // Repeat
        };

        checkSound();
      } catch (err) {
        console.log("Mic error:", err);
      }
    };

    setupMicrophone();
  }, [setSize]); // Only run once

  return null; // No UI, just logic
};

export default Listen; 