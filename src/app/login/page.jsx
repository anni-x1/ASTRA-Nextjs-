'use client'
import React, { useState, useContext } from 'react'
import { AppContext } from '../context'
import styles from './login.module.css'
import { useRouter } from 'next/navigation'
export default function page() {
    const { setUser, setAuthenticated } = useContext(AppContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const validateLogin = () => {
        if (!username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        return true;
    }
    const handleLogin = async () => {
        if (!validateLogin()) return;
        
        setLoading(true)
        setError('')
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log('Login successful');
                setAuthenticated(true);
                setUser(data.user);
                router.push('/AstraGateway');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Login
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                    </svg>
                </h1>
                <input 
                    type="text" 
                    placeholder='Username' 
                    className={styles.input} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input q
                    type="password" 
                    placeholder='Password' 
                    className={styles.input} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                    className={styles.button} 
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}
