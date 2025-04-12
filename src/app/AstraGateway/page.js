'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './astragateway.module.css'
import Link from 'next/link'
import { AppContext } from '../context'

export default function AstraVerse() {
    const { authenticated, username } = React.useContext(AppContext)
    const [mode, setMode] = useState(null);
    const router = useRouter();
    const handleVoiceMode = () => {
        setMode('voice');
        router.push('/VoiceMode');
    }
    const handleAstraVerse = () => {
        setMode('astraverse');
        router.push('/AstraVerse');
    }

    return (
        <>
            {authenticated ?
                <div className={styles.container}>
                    <div className={styles.modeContainer}>
                        <div className={styles.modeCard}>
                            <h2>Voice Mode</h2>
                            <p className={styles.modeMetaDescription}>Just Speak. Astra Listens</p>
                            <p className={styles.modeDescription}>Astra Voice Mode is designed for seamless, natural interaction—no typing required. Just speak, and Astra listens, understands, and responds instantly. Whether you need quick answers, real-time assistance, or a casual chat.
                            </p>
                            <button style={{ marginTop: '3.4rem' }} className={styles.modeButton} onClick={handleVoiceMode}>Talk to Astra</button>
                        </div>
                        <div className={styles.modeCard}>
                            <h2>AstraVerse</h2>
                            <p className={styles.modeMetaDescription}>AstraVerse - The AI Playground</p>
                            <p className={styles.modeDescription}>Welcome to AstraVerse<br></br>
                                Your space to interact with AI personalities,chat and craft your own AI custom assistants, and explore dynamic conversations
                            </p>
                            <button style={{ marginTop: '5rem' }} className={styles.modeButton} onClick={handleAstraVerse}>Explore AstraVerse</button>
                        </div>
                    </div>
                </div> :
                <div className={styles.container}>
                    <h1>Please Login to Continue</h1>
                    <Link href="/login">Login</Link>
                </div>
            }
        </>
    )
}