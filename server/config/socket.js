const socketIO = require('socket.io');

const initializeSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
            //origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;
        if (!userId) {
            socket.disconnect();
            return;
        }
        console.log(`Client connected: ${userId}`);
        socket.join(userId);
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${userId}`);
        });
    })

    return io;
}

module.exports = initializeSocket;