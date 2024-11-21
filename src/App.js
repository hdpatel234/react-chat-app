import React, { useState, useRef, useEffect } from 'react';
import useWebSocket from './WebSocket';
import './ChatApp.css';

const App = () => {
    const [username, setUsername] = useState('');
    const [input, setInput] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const { messages, sendMessage } = useWebSocket('ws://localhost:8081');

    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleRegister = () => {
        if (username.trim()) {
            setIsRegistered(true);
        }
    };

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(username, input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRegisterKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRegister();
        }
    }

    return (
        <div className="chat-app">
            {!isRegistered ? (
                <div className="register">
                    <h2>Register</h2>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleRegisterKeyDown()}
                    />
                    <button onClick={handleRegister}>Register</button>
                </div>
            ) : (
                <div className="chat-container">
                    <div className="chat-header">
                        <h2>Welcome {username}!</h2>
                    </div>
                    <div className="chat-messages" ref={chatRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${
                                    msg.username === username ? 'sent' : 'received'
                                }`}
                            >
                                <strong>{msg.username}</strong>: {msg.message}
                                <div className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message"
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
