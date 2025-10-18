import express from 'express';
import cors from 'cors';
import importRoutes from './routes/importRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/imports', importRoutes);
app.use('/api/jobs', jobRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
