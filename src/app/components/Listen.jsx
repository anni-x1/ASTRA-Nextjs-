import { useState, useRef } from "react";
import { AppContext } from "../context";

export default function AudioRecorder() {
    const { setListening } = useContext(AppContext);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const reader = new FileReader();
            reader.readAsDataURL(blob); // Convert to Base64
            reader.onloadend = () => {
                const base64Audio = reader.result.split(",")[1]; // Remove the prefix
                sendAudioToBackend(base64Audio);
            };
        };

        mediaRecorderRef.current.start();
        setListening(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setListening(false);
        }
    };

    const sendAudioToBackend = async (base64Audio) => {
        await fetch("/api/upload-audio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio: base64Audio }),
        });
    };
}
