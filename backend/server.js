const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const env = require('./src/config/env');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express listener
    const server = app.listen(env.PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Ideathon Backend Server is running!`);
      console.log(`📡 URL: http://localhost:${env.PORT}`);
      console.log(`🔌 API Prefix: ${env.API_PREFIX}`);
      console.log(`⚙️  Environment: ${env.NODE_ENV}`);
      console.log(`======================================================\n`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection Error]: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle Uncaught Exceptions
    process.on('uncaughtException', (err) => {
      console.error(`[Uncaught Exception Error]: ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error(`[Fatal Server Start Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
