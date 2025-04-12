'use client'
import React, { useEffect, useState } from 'react'
import { AppContext } from '../context'
import style from './styles/statusBar.module.css'
import useListen from './Listen'
import { sendToGPT } from './AudioChat'
export default function StatusBar() {
    const { user, listening, setListening, thinking, setThinking, setMessages, messages } = React.useContext(AppContext);
    const [audioUrl, setAudioUrl] = useState(null);
    const {
        startRecording,
        stopRecording,
        recording,
        audioBlob,
        error
    } = useListen();

    // Create audio URL when blob changes
    useEffect(() => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            
            // Clean up URL when component unmounts
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [audioBlob]);

    const handleListening = async () => {
        setListening(true);
        const success = await startRecording();
        if (success) {
            console.log('Recording started successfully');
        } else {
            console.error('Failed to start recording');
            setListening(false);
        }
    }

    const handleStopListening = async () => {
        setListening(false);
        setThinking(true);
        const blob = await stopRecording();
        console.log('Recorded audio blob:', blob);
        if (blob && blob.size > 0) {
            console.log('Audio blob size:', blob.size, 'bytes');
            console.log('Audio blob type:', blob.type);
            // Send the actual blob returned from stopRecording, not the audioBlob from context
            const response = await sendToGPT(blob, user.username, user, setListening, setMessages, messages);
        } else {
            console.error('No audio data recorded or empty blob');
        }
    }

    return (
        <div className={style.statusMessage}>
            {thinking ? 'thinking...' : listening ? 'listening...' : 'ready to chat!'}
            {listening ? 
                <button className={style.micButton} onClick={handleStopListening}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
                    </svg>
                </button>
                :
                <button className={style.micButton} onClick={handleListening}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
                    </svg>
                </button>
            }
            
            {error && (
                <div className={style.errorMessage}>Error: {error}</div>
            )}
            
            {/* {audioUrl && (
                <div className={style.audioPlayer}>
                    <audio 
                        src={audioUrl} 
                        controls 
                        onError={(e) => console.error('Audio playback error:', e)}
                    />
                </div>
            )} */}
        </div>
    )
}