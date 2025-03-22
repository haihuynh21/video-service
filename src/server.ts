import app from './app';
import { config } from './config/enviroment';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database');

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });

    // Handle server shutdown
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log('Disconnected from database');
      process.exit(0);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();