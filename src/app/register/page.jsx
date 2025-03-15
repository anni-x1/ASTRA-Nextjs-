'use client'
import React from 'react';
import Link from 'next/link'
import { AppContext } from '../context'
import { useState } from 'react'
import styles from './register.module.css'
import { useRouter } from 'next/navigation'
export default function page() {
    const { setAuthenticated } = React.useContext(AppContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setName] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const validateRegister = () => {
        if (!username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Invalid email format');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    }
    const handleRegister = async () => {
        if (!validateRegister()) return;
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password }),
            });
      
            if (response.ok) {
              console.log('Registration successful');
              alert('Registration successful')
              router.push('/login')
            } else {
              const errorData = await response.text();
              setError(errorData || 'Registration failed');
            }
          } catch (error) {
            setError('An error occurred. Please try again.');
          }
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Register
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </h1>
                <input 
                    type="text" 
                    placeholder='Username' 
                    className={styles.input} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder='Email' 
                    className={styles.input} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder='Password' 
                    className={styles.input} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder='Confirm Password' 
                    className={styles.input} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button className={styles.button} onClick={handleRegister}>Register</button>
                <p className={styles.login}>Already have an account? <Link href="/login">Login</Link></p>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}
