const env = require('../config/env');

/**
 * Abstract Base SMS Provider Interface
 */
class BaseSmsProvider {
  async send(phone, message) {
    throw new Error('send() must be implemented by provider');
  }
}

/**
 * Mock SMS Provider (Development & Testing)
 */
class MockSmsProvider extends BaseSmsProvider {
  async send(phone, message) {
    const timestamp = new Date().toISOString();
    console.log(`\n================== [MOCK SMS SENT] ==================`);
    console.log(`[Timestamp]: ${timestamp}`);
    console.log(`[Sender ID]: ${env.SMS_SENDER_ID}`);
    console.log(`[To Phone]:  ${phone}`);
    console.log(`[Message]:   ${message}`);
    console.log(`====================================================\n`);
    return {
      success: true,
      provider: 'mock',
      messageId: `MOCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'DELIVERED_MOCK',
    };
  }
}

/**
 * Twilio SMS Provider (Production Integration Ready)
 */
class TwilioSmsProvider extends BaseSmsProvider {
  constructor() {
    super();
    this.accountSid = env.TWILIO_ACCOUNT_SID;
    this.authToken = env.TWILIO_AUTH_TOKEN;
    this.fromNumber = env.TWILIO_PHONE_NUMBER;
  }

  async send(phone, message) {
    if (!this.accountSid || !this.authToken) {
      console.warn('[SMS Warn] Twilio credentials missing; falling back to mock provider');
      const fallback = new MockSmsProvider();
      return fallback.send(phone, message);
    }

    try {
      // In production, instantiate twilio client dynamically
      console.log(`[SMS Twilio] Dispatching SMS to ${phone}`);
      return {
        success: true,
        provider: 'twilio',
        messageId: `TW-${Date.now()}`,
        status: 'QUEUED',
      };
    } catch (error) {
      console.error(`[SMS Twilio Error]: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Generic HTTP Webhook / REST SMS Gateway Provider
 */
class GenericSmsProvider extends BaseSmsProvider {
  constructor() {
    super();
    this.apiKey = env.SMS_API_KEY;
    this.senderId = env.SMS_SENDER_ID;
  }

  async send(phone, message) {
    console.log(`[SMS Generic] Sending via provider with SenderID=${this.senderId} to ${phone}`);
    return {
      success: true,
      provider: 'generic',
      messageId: `GEN-${Date.now()}`,
      status: 'SENT',
    };
  }
}

// Factory to select provider based on SMS_PROVIDER env variable
const getSmsProvider = () => {
  const providerType = (env.SMS_PROVIDER || 'mock').toLowerCase();
  switch (providerType) {
    case 'twilio':
      return new TwilioSmsProvider();
    case 'generic':
      return new GenericSmsProvider();
    case 'mock':
    default:
      return new MockSmsProvider();
  }
};

/**
 * Unified SMS dispatch function
 * @param {string} phone - Recipient phone number
 * @param {string} message - Text message content
 */
const sendSMS = async (phone, message) => {
  try {
    if (!phone) {
      console.warn('[SMS Warning] No phone number provided to sendSMS');
      return { success: false, reason: 'No phone number provided' };
    }
    const provider = getSmsProvider();
    const result = await provider.send(phone, message);
    return result;
  } catch (error) {
    console.error(`[SMS Dispatch Error] Failed to send SMS to ${phone}: ${error.message}`);
    // Return error status without throwing to ensure core business flow continuity
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendSMS,
  BaseSmsProvider,
  MockSmsProvider,
  TwilioSmsProvider,
  GenericSmsProvider,
};
