import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        setSocket(ws);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data); // Parse the received JSON object
                setMessages((prev) => [...prev, data]);
            } catch (error) {
                console.error('Failed to parse message:', event.data);
            }
        };

        return () => ws.close();
    }, [url]);

    const sendMessage = (username, message) => {
        if (socket?.readyState === WebSocket.OPEN) {
            const messageObject = { username, message, timestamp: new Date().toISOString() }; // Include timestamp
            socket.send(JSON.stringify(messageObject)); // Send as JSON
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
