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

    // 3. Retrieve and synchronize Admin user from environment variables (Render Dashboard)
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@123').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_123';
    const adminName = process.env.ADMIN_NAME || 'Ideathon Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+919876543210';

    let admin = await User.findOne({
      $or: [
        { role: 'admin' },
        { email: adminEmail },
      ],
    }).select('+password');

    if (!admin) {
      console.log(`[System Init] No admin found. Creating primary admin from Render environment (${adminEmail})...`);
      admin = await User.create({
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
    } else {
      // Synchronize existing admin with Render Dashboard environment variables
      let modified = false;

      if (admin.email !== adminEmail) {
        console.log(`[System Init] Updating admin identifier to Render environment value: ${adminEmail}`);
        admin.email = adminEmail;
        modified = true;
      }

      if (process.env.ADMIN_PASSWORD) {
        const isMatch = await admin.comparePassword(adminPassword);
        if (!isMatch) {
          console.log('[System Init] Updating admin password to match Render environment variable...');
          admin.password = adminPassword;
          modified = true;
        }
      }

      if (admin.role !== 'admin') {
        admin.role = 'admin';
        modified = true;
      }

      if (!admin.isActive) {
        admin.isActive = true;
        modified = true;
      }

      if (modified) {
        await admin.save();
        console.log('[System Init] Admin credentials successfully synchronized from Render environment.');
      } else {
        console.log(`[System Init] Admin account active and up to date (${admin.email}).`);
      }
    }
  } catch (error) {
    console.error('[System Init Warning] Error checking or initializing baseline:', error.message);
  }
};

module.exports = { initBaseline };
