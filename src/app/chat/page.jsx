'use client'
import React from "react";
import { useEffect } from "react";
import { AppContext } from "../context";
import styles from './chat.module.css'
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chat() {
    const { personality, user } = React.useContext(AppContext);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const messagesEndRef = React.useRef(null);

    // Initialize messages from the user's chat history
    const [messages, setMessages] = React.useState(() => {
        const person = user.chats.find(chat => chat.personalityId === personality.id);
        return person?.messages || [];
    });

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        
        // Add user message to chat
        setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "user",
              content: userMessage,
            },
          ]);
        
        // Set loading state
        setIsLoading(true);
        
        try {
            // Format conversation history for the API
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Call the chat API with conversation history
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: userMessage,
                    username: user.username,
                    personalityId: personality.id,
                    personalityName: personality.name,
                    systemMessage: personality.systemMessage
                }),
            });
            
            const data = await response.json();
            console.log(data.response)
            
            if (response.ok) {
                // Add assistant response to chat
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      role: "assistant",
                      content: data.response,
                    },
                  ]);
            } else {
                // Handle error
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      role: "assistant",
                      content: 'Sorry, I encountered an error. Please try again.',
                      error: true,
                    },
                  ]);
                console.error('Error from chat API:', data.error);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                  role: "assistant",
                  content: 'Sorry, I encountered an error. Please try again.',
                  error: true,
                },
              ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Markdown components for rendering code blocks with syntax highlighting
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.chatHeader}>
                    <Image className={styles.chatHeaderImage} src={personality.image} alt={personality.name} width={50} height={50} />
                    <h1>{personality.name}</h1>
                </div>
                <div className={styles.chatContainer}>
                    <div className={styles.chatMessages}>
                        {messages.length === 0 ? (
                            <div className={styles.emptyChat}>
                                Start a conversation with {personality.name}!
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage} ${message.error ? styles.errorMessage : ''}`}
                                >
                                    <ReactMarkdown components={components}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className={`${styles.message} ${styles.assistantMessage} ${styles.loadingMessage}`}>
                                <div className={styles.typingIndicator}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className={styles.chatInputContainer}>
                        <input
                            className={styles.chatInput}
                            type="text"
                            placeholder="Message"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button
                            className={styles.chatInputButton}
                            onClick={sendMessage}
                            disabled={isLoading || !inputValue.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
