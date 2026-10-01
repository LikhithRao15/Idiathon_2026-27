const User = require('../models/User');
const Theme = require('../models/Theme');
const Event = require('../models/Event');

/**
 * Ensures system baseline exists without wiping any database records:
 * 1. Global Event singleton configuration
 * 2. Default Ideathon themes if none exist
 * 3. Primary Administrator account if no admin exists
 */
const initBaseline = async () => {
  try {
    // 1. Ensure Event configuration singleton exists
    if (typeof Event.getEventConfig === 'function') {
      await Event.getEventConfig();
    }

    // 2. Ensure official Themes exist
    const themeCount = await Theme.countDocuments();
    if (themeCount === 0) {
      console.log('[System Init] Initializing default Ideathon themes...');
      await Theme.create([
        {
          name: 'Waste Management',
          description: 'Comprehensive systems, recycling pipelines, organic and inorganic segregation, and circular reuse strategies.',
          isActive: true,
        },
        {
          name: 'Handling Waste',
          description: 'Safe collection, hazardous material handling, worker safety, smart transport, and automated sorting technologies.',
          isActive: true,
        },
        {
          name: 'Waste Disposal',
          description: 'Eco-friendly disposal, zero-landfill solutions, waste-to-energy conversion, and sustainable incineration alternatives.',
          isActive: true,
        },
      ]);
      console.log('[System Init] Themes initialized.');
    }

    // 3. Ensure Admin user exists
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@123').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_123';
    const adminName = process.env.ADMIN_NAME || 'Ideathon Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+919876543210';

    const existingAdmin = await User.findOne({
      $or: [
        { role: 'admin' },
        { email: adminEmail },
      ],
    });

    if (!existingAdmin) {
      console.log(`[System Init] No admin found. Creating primary admin (${adminEmail})...`);
      await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: adminPassword,
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      });
      console.log('[System Init] Primary admin created successfully.');
    }
  } catch (error) {
    console.error('[System Init Warning] Error checking or initializing baseline:', error.message);
  }
};

module.exports = { initBaseline };
