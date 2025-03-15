import React from 'react'
import { useState, useRef, useEffect } from 'react'
import style from './styles/chat.module.css';
import { AppContext } from '../context';

export default function ChatWindow() {
    const { user } = React.useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    // Scroll to bottom of messages when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        
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
                    conversationHistory: conversationHistory
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Add assistant response to chat
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                // Handle error
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: 'Sorry, I encountered an error. Please try again.',
                    error: true
                }]);
                console.error('Error from chat API:', data.error);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.',
                error: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={style.chatWindowContainer}>
            <h2 className={style.chatWindowTitle}>Chat Window</h2>
            <div className={style.chatWindow}>
                <div className={style.chatMessages}>
                    {messages.length === 0 ? (
                        <div className={style.emptyChat}>
                            Start a conversation with Astra!
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`${style.message} ${message.role === 'user' ? style.userMessage : style.assistantMessage} ${message.error ? style.errorMessage : ''}`}
                            >
                                {message.content}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className={`${style.message} ${style.assistantMessage} ${style.loadingMessage}`}>
                            <div className={style.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className={style.chatInputContainer}>
                    <input 
                        className={style.chatInput} 
                        type="text" 
                        placeholder="Message" 
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        className={style.chatInputButton}
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
    )
}