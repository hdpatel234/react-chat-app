const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8081 });

server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        let parsedMessage;

        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error('Invalid JSON received:', message);
            return;
        }

        const messageToBroadcast = JSON.stringify(parsedMessage);
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageToBroadcast);
            }
        });
    });

    socket.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8081');
