require('dotenv').config();

const cors = require('cors');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const initializeSocket = require('./config/socket');
const io = initializeSocket(server);

const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const creatorRouter = require('./routes/creator');
const fanRouter = require('./routes/fan');
const paymentRouter = require('./routes/payment');
const { webhookHandler } = require('./controllers/paymentController');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('io', io);

app.post('/api/v1/payments/webhook',
    express.raw({ type: 'application/json' }),
    webhookHandler
);

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/creator', creatorRouter);
app.use('/api/v1', fanRouter);
app.use('/api/v1/payments', paymentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();

