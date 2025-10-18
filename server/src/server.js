import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import { startScheduledImports } from './cron/scheduledImport.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start cron jobs
startScheduledImports();

// Start server
server.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
