const mongoose = require('mongoose');
const env = require('./config/env');
const User = require('./models/User');
const Theme = require('./models/Theme');
const Team = require('./models/Team');
const Round1Submission = require('./models/Round1Submission');
const Round2Submission = require('./models/Round2Submission');
const Evaluation = require('./models/Evaluation');
const Notification = require('./models/Notification');
const Event = require('./models/Event');

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || 'Password@123';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing collections
    console.log('[Seed] Cleaning old database records...');
    await Promise.all([
      User.deleteMany({}),
      Theme.deleteMany({}),
      Team.deleteMany({}),
      Round1Submission.deleteMany({}),
      Round2Submission.deleteMany({}),
      Evaluation.deleteMany({}),
      Notification.deleteMany({}),
      Event.deleteMany({}),
    ]);

    console.log('[Seed] Creating 1 Admin user...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@ideathon.org',
      phone: '+919876543210',
      password: defaultPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    console.log('[Seed] Creating 2 Panelist users...');
    const [panelist1, panelist2] = await Promise.all([
      User.create({
        name: 'Dr. Ananya Sharma',
        email: 'panelist1@ideathon.org',
        phone: '+919876543211',
        password: defaultPassword,
        role: 'panelist',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      }),
      User.create({
        name: 'Prof. Rajesh Kumar',
        email: 'panelist2@ideathon.org',
        phone: '+919876543212',
        password: defaultPassword,
        role: 'panelist',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      }),
    ]);

    console.log('[Seed] Creating 3 Ideathon Themes...');
    const [theme1, theme2, theme3] = await Promise.all([
      Theme.create({
        name: 'Waste Management',
        description: 'Comprehensive systems, recycling pipelines, organic and inorganic segregation, and circular reuse strategies.',
        isActive: true,
      }),
      Theme.create({
        name: 'Handling Waste',
        description: 'Safe collection, hazardous material handling, worker safety, smart transport, and automated sorting technologies.',
        isActive: true,
      }),
      Theme.create({
        name: 'Waste Disposal',
        description: 'Eco-friendly disposal, zero-landfill solutions, waste-to-energy conversion, and sustainable incineration alternatives.',
        isActive: true,
      }),
    ]);

    // Create Event Configuration
    console.log('[Seed] Setting up Event / Round configuration...');
    const round1Deadline = new Date('2026-11-01T23:59:59.999Z');
    const round2Deadline = new Date('2026-12-01T23:59:59.999Z');
    const finaleDate = new Date('2026-12-15T10:00:00.000Z');

    await Event.create({
      eventName: 'Hasiru Samvadha Ideathon 2026',
      isRegistrationOpen: true,
      registrationDeadline: round1Deadline,
      round1: {
        status: 'OPEN',
        deadline: round1Deadline,
        instructions: 'Round 1 Idea Pitch (Oct 2 - Nov 1): Submit your problem statement and proposed solution for Waste Management, Handling Waste, or Waste Disposal.',
      },
      round2: {
        status: 'OPEN',
        deadline: round2Deadline,
        instructions: 'Round 2 Idea Elaboration (Nov 2 - Dec 1): Provide detailed concept, circularity value proposition, 90-day implementation plan, and resource requirements.',
      },
      finalRound: {
        status: 'UPCOMING',
        eventDate: finaleDate,
        venue: 'Grand Innovation Auditorium, Bangalore',
        instructions: 'Deliver a 10-minute presentation followed by 5 minutes of Q&A with the jury.',
      },
      finalists: [],
    });

    console.log('\n======================================================');
    console.log('✅ Clean Database Initialization Complete!');
    console.log('======================================================');
    console.log('Admin Account:');
    console.log('  Email:    admin@ideathon.org');
    console.log(`  Password: ${defaultPassword}`);
    console.log('------------------------------------------------------');
    console.log('Panelist Accounts:');
    console.log('  1. Email: panelist1@ideathon.org');
    console.log(`     Password: ${defaultPassword}`);
    console.log('  2. Email: panelist2@ideathon.org');
    console.log(`     Password: ${defaultPassword}`);
    console.log('======================================================');
    console.log('✨ No dummy participants or teams created.');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
