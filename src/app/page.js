'use client'
import React from 'react';
import Image from 'next/image';
import { AppContext } from './context';
import Core from './components/Core';
import StatusBar from './components/StatusBar';
import styles from './page.module.css';
import Link from 'next/link';
import AstraVerse from './AstraVerse/page';
export default function Page() {
  const { authenticated } = React.useContext(AppContext);

  return (
    <>
      {authenticated ? (
        <AstraVerse />
      ) : (
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={`${styles.title} ${styles.typingEffect}`}>Welcome to Astra                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </h1>
            <h2 className={styles.subtitle}>Your AI Personality Universe</h2>
          </header>
          <section className={styles.hero}>
            <p className={styles.description}>
              AstraVerse is your gateway to a world of unique AI personalities. Chat with Astra,
              explore creative conversations with Muse, or engage with other fascinating AI characters.
              Each personality brings its own unique perspective and style to every interaction.
              Experience natural voice conversations or text-based chats - the choice is yours.
            </p>
            <div className={styles.getStarted}>
              <Link href="/register">
                <button>Begin Your Journey</button>
              </Link>
            </div>
          </section>
          <section className={styles.howItWorks}>
            <h3 className={styles.sectionTitle}>How It Works</h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <h4>1. Choose Your AI</h4>
                <p>Select from a diverse collection of AI personalities, each with unique traits and communication styles.</p>
              </div>
              <div className={styles.step}>
                <h4>2. Start Chatting</h4>
                <p>Engage in dynamic conversations tailored to your chosen AI's personality and expertise.</p>
              </div>
              <div className={styles.step}>
                <h4>3. Choose Your Mode</h4>
                <p>Switch between voice and text modes for natural, flexible interactions with your AI.</p>
              </div>
              <div className={styles.step}>
                <h4>4. Create Your Own</h4>
                <p>Design and customize your own AI personality with unique characteristics and knowledge areas.</p>
              </div>
            </div>
          </section>
          <section className={styles.features}>
            <h3 className={styles.sectionTitle}>Features</h3>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <h4>Diverse AI Personalities</h4>
                <p>From helpful assistants to creative muses, each AI brings a unique perspective to your conversations.</p>
              </div>
              <div className={styles.featureItem}>
                <h4>Dynamic Interactions</h4>
                <p>Experience engaging conversations that adapt to each AI's personality and communication style.</p>
              </div>
              <div className={styles.featureItem}>
                <h4>Voice & Text Modes</h4>
                <p>Choose between natural voice conversations or text-based chats for flexible interaction.</p>
              </div>
              <div className={styles.featureItem}>
                <h4>Custom AI Creation</h4>
                <p>Design your own AI personality with specific traits, knowledge, and communication patterns.</p>
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
