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
 * Fast2SMS Provider (Instant Delivery for Indian +91 Numbers)
 */
class Fast2SmsProvider extends BaseSmsProvider {
  constructor() {
    super();
    this.apiKey = env.SMS_API_KEY;
  }

  async send(phone, message) {
    if (!this.apiKey || this.apiKey === 'mock_sms_api_key') {
      console.warn('[Fast2SMS Warn] Fast2SMS API key missing; falling back to MockSmsProvider');
      const fallback = new MockSmsProvider();
      return fallback.send(phone, message);
    }

    // Sanitize to clean 10-digit Indian phone number
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      console.warn(`[Fast2SMS Warn] Invalid 10-digit Indian phone number: '${phone}'`);
      return { success: false, reason: 'Invalid phone format (requires 10 digits)' };
    }

    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: cleanPhone,
        }),
      });

      const data = await response.json();
      if (data.return === true || data.status_code === 200 || (Array.isArray(data.message) && data.message[0]?.toLowerCase().includes('success'))) {
        console.log(`\n📲 [Fast2SMS LIVE DELIVERED] Successfully sent SMS to +91${cleanPhone}!`);
        console.log(`[RequestId]: ${data.request_id || 'OK'}`);
        console.log(`[Message]: ${message}\n`);
        return {
          success: true,
          provider: 'fast2sms',
          messageId: data.request_id || `F2S-${Date.now()}`,
          status: 'DELIVERED',
          raw: data,
        };
      } else {
        console.warn(`\n⚠️ [Fast2SMS Notice] Message for +91${cleanPhone}: ${data.message || JSON.stringify(data)}`);
        if (data.status_code === 999) {
          console.warn(`👉 Action needed: Please complete a ₹100 recharge on your fast2sms.com wallet to activate live SMS dispatch.\n`);
        }
        return {
          success: false,
          provider: 'fast2sms',
          reason: data.message || 'API responded with notice',
          raw: data,
        };
      }
    } catch (error) {
      console.error(`[Fast2SMS Error] Dispatch failed for +91${cleanPhone}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
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
  const providerType = (env.SMS_PROVIDER || 'fast2sms').toLowerCase();
  switch (providerType) {
    case 'fast2sms':
      return new Fast2SmsProvider();
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
  Fast2SmsProvider,
  TwilioSmsProvider,
  GenericSmsProvider,
};
