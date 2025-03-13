'use client'
import React from 'react';
import Image from 'next/image';
import { AppContext } from './context';
import Core from './components/Core';
import StatusBar from './components/StatusBar';
import styles from './page.module.css';
import Link from 'next/link';

export default function Page() {
  const { authenticated, setAuthenticated } = React.useContext(AppContext);

  return (
    <>
      {authenticated ? (
        <div>
          <Core />
          <StatusBar />
        </div>
      ) : (
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={`${styles.title} ${styles.typingEffect}`}>Welcome to ASTRA</h1>
            <h2 className={styles.subtitle}>Your AI-powered voice assistant</h2>
          </header>
          <section className={styles.hero}>
            <p className={styles.description}>
              ASTRA is a next-gen voice assistant designed for seamless, natural interaction.
              Speak naturally, and let ASTRA handle the rest.
            </p>
            <div className={styles.getStarted}>
              <Link href="/login">
                <button>Get Started</button>
              </Link>
            </div>
          </section>
          <section className={styles.howItWorks}>
            <h3 className={styles.sectionTitle}>How It Works</h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <h4>1. Speak Naturally</h4>
                <p>Talk to ASTRA as you would with a friend.</p>
              </div>
              <div className={styles.step}>
                <h4>2. Intelligent Processing</h4>
                <p>ASTRA processes your voice commands in real-time.</p>
              </div>
              <div className={styles.step}>
                <h4>3. Instant Response</h4>
                <p>Receive quick, accurate responses every time.</p>
              </div>
            </div>
          </section>
          <section className={styles.features}>
            <h3 className={styles.sectionTitle}>Features</h3>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <h4>Natural Voice Interaction</h4>
                <p>Experience conversation as smooth as chatting with a friend.</p>
              </div>
              <div className={styles.featureItem}>
                <h4>Real-Time Response</h4>
                <p>Adaptive, intelligent conversation flows at lightning speed.</p>
              </div>
              <div className={styles.featureItem}>
                <h4>Minimalist Interface</h4>
                <p>A clean, monochrome design that keeps it all simple and sleek.</p>
              </div>
            </div>
          </section>
          <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} ASTRA. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
