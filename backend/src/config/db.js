const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async (customUri = null) => {
  try {
    const uri = customUri || env.MONGODB_URI;
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB Disconnected successfully');
  } catch (error) {
    console.error(`[Database Error] Disconnect Failed: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
