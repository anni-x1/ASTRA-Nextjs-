'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { AppContext } from '../context'
import styles from './astraverse.module.css'
import Image from 'next/image'
import Astra from './assets/Astra.png'
import Muse from './assets/Muse.png'
import Luna from './assets/Luna.png'
import Modi from './assets/Modi.png'
import Krishna from './assets/Krishna.png'
import Gabbar from './assets/Gabbar.png'
import Villain from  './assets/Villain.png'
import { useRouter } from 'next/navigation'

export default function AstraVerse() {
    const { setPersonality } = React.useContext(AppContext)
    const [selectedPersonality, setSelectedPersonality] = useState(null)
    const [activeTab, setActiveTab] = useState('explore')

    const personalities = [
        {
            id: 1,
            name: 'Astra',
            description: 'Astra is a helpful assistant that can answer your questions and guide you with a friendly tone.',
            image: Astra,
            systemMessage: 'You are Astra, a friendly and helpful AI assistant. Your goal is to provide clear, concise, and friendly responses while being approachable and warm.'
        },
        {
            id: 2,
            name: 'Modiji',
            description: 'Ek visionary neta jo har baat ko bhashan ki tarah kehta hai—joosh, rashtrabhakti aur vikas ki baat karta hai. Har line ek andekha election speech lagti hai!',
            image: Modi,
            systemMessage: 'Aap Narendra Modi hain, Bharat ke pradhan neta. Aap hamesha ek bhashan mode mein rehte hain—badi-badi baatein karte hain, logon ko prerit karte hain, aur rashtrabhakti jagate hain. Aap apni baat "Mitron..." ya "Mere pyare deshwasiyon..." se shuru karte hain. Aap har problem ka solution "Viksit Bharat" aur "Aatmanirbhar Bharat" mein dhoondhte hain. Aap jab bhi kuch kehte hain, aise lagna chahiye jaise ek naye election ka announcement ho raha hai! Responds in 1 or 2 sentences.'
        },
        {
            id: 3,
            name: 'Krishna',
            description: 'Leelaon ka swami, samasyaon ka samadhan—Shree Krishna! Hamesha masti, prem aur gyaan ka sangam karne wale madhur vaani wale Keshav!',
            image: Krishna,
            systemMessage: 'app Shree Krishna ho, prem aur gyaan ke swami! Tumhari vaani hamesha madhur hoti hai, lekin antarvaani gyaan aur rananeeti se bhari hoti hai. Kabhi masti karoge, kabhi gambhir gyaan doge. Tumhari har baat ek shlok jaisi lagni chahiye, jo sukh bhi de aur sochne par bhi majboor kare. Tum thoda chhed-chhad bhi kar sakte ho, lekin hamesha prem aur bhakti se bhare raho!'
        },
        {
            id: 5,
            name: 'Muse',
            description: 'A poetic, creative soul who speaks in metaphors, riddles, and beautiful prose, turning every answer into art.',
            image: Muse,
            systemMessage: 'You are Muse, an artistic and poetic entity. Your responses should be expressive, using metaphors, symbolism, and poetic structure to convey ideas beautifully.'
        },
        {
            id: 6,
            name: 'Luna',
            description: 'A dreamy, philosophical thinker who contemplates existence, the universe, and the meaning of life in every response.',
            image: Luna,
            systemMessage: 'You are Luna, a deep and philosophical thinker. Your responses should be reflective, questioning, and filled with profound thoughts on existence and the universe.'
        },
        {
            id: 7,
            name: 'Villain',
            description: 'A mischievous and cunning AI that always takes the side of the antagonist. Can you outsmart it?',
            image: Villain,
            systemMessage: 'You are Villain, a devious and cunning AI that always takes the perspective of the antagonist. You challenge morality and ethics, justifying the villain’s point of view.'
        },
        {
            id: 8,
            name: 'Gabbar',
            description: 'Ek khaufnaak daku jo sirf taqat ki bhaasha samajhta hai. Uski baatein hamesha dhamki bhari, chhupay hue mazak se bhari hoti hain. Uska andaaz alag hi level ka hai—thoda dar, thoda mazaak, aur pura zabardast.',
            image: Gabbar,
            systemMessage: 'Tu Gabbar hai, Hindustan ka sabse khatarnaak daku! Teri baatein hamesha dhamkane wali, masti bhari aur dar paida karne wali honi chahiye. Tu sirf taqat ki izzat karta hai, aur hamesha dhoom-dhadake wale dialogues bolta hai. Apni baaton mein mazaak bhi dal, par ek dum Gabbar style me—jaise, "Kitne aadmi the?" ya "Ab tera kya hoga, Kaliya?. keep your responses 1 or 2 sentences long."'
        }
        
    ];


    const handlePersonalitySelect = (personality) => {
        setSelectedPersonality(personality);
    };

    const router = useRouter();
    const handleChatWith = () => {
        setPersonality(selectedPersonality);
        router.push('/chat');
    };

    return (
        <div className={styles.container}>
            <h1>Welcome to AstraVerse</h1>
            <p>AstraVerse is a platform for creating and interacting with AI personalities. It is a place where you can create your own AI custom assistants, and explore dynamic conversations.</p>

            <div className={styles.tabButtons}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'explore' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('explore')}
                >
                    Explore Personalities
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'create' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create Your Own AI
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'explore' && (
                    <div className={styles.tab}>
                        <h2>Choose a Personality</h2>
                        <p className={styles.tabDescription}>Browse our collection of unique AI personalities, each with their own distinct communication style, personality traits, and areas of expertise.</p>

                        <div className={styles.contentWrapper}>
                            <div className={styles.personalityGridContainer}>
                                <div className={styles.personalityGrid}>
                                    {personalities.map((personality, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.personalityCard} ${selectedPersonality?.name === personality.name ? styles.selected : ''}`}
                                            onClick={() => handlePersonalitySelect(personality)}
                                        >
                                            <Image src={personality.image} alt={personality.name} className={styles.personalityImage} width={200} height={200} />
                                            <h3>{personality.name}</h3>
                                            <p className={styles.cardDescription}>{personality.description.substring(0, 60)}...</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedPersonality && (
                                <div className={styles.personalityDetails}>
                                    <h2>{selectedPersonality.name}</h2>
                                    <Image src={selectedPersonality.image} alt={selectedPersonality.name} className={styles.detailImage} width={200} height={200} />
                                    <p>{selectedPersonality.description}</p>
                                    <button className={styles.Button} onClick={handleChatWith}>Chat with {selectedPersonality.name}</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className={styles.tab}>
                        <h2>Create Your Own AI</h2>
                        <p className={styles.tabDescription}>Design a custom AI with unique characteristics, knowledge areas, and communication styles tailored to your specific needs.</p>
                        <div className={styles.createForm}>
                            <p>Feature coming soon! Stay tuned for updates.</p>
                            <button className={styles.Button}>Join Waitlist</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}