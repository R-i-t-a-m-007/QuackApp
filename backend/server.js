import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: '*', // Allow any origin for development
    methods: ['GET', 'POST'],
}));
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
