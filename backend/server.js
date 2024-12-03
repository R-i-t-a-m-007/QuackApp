import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import companyRoutes from './routes/companyRoutes.js'; // Import the new routes


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: '*', // Allow any origin (use caution in production)
    methods: ['GET', 'POST'], // Allowed HTTP methods
  })
);

// Middleware
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // Payment routes placeholder
app.use('/api/companies', companyRoutes); // Add company routes


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
