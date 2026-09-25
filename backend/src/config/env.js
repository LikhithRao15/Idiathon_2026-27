const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  API_PREFIX: process.env.API_PREFIX || '/api',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ideathon_db',
  
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_for_ideathon_management_system_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  MAX_TEAM_SIZE: parseInt(process.env.MAX_TEAM_SIZE, 10) || 4,
  MIN_TEAM_SIZE: parseInt(process.env.MIN_TEAM_SIZE, 10) || 1,
  
  // Email config
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Hasiru Samvadha Ideathon',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'no-reply@ideathon.org',
  
  // SMS config
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'mock',
  SMS_API_KEY: process.env.SMS_API_KEY || '',
  SMS_API_SECRET: process.env.SMS_API_SECRET || '',
  SMS_SENDER_ID: process.env.SMS_SENDER_ID || 'IDEATHON',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  
  // Rate Limiter
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};

module.exports = env;
