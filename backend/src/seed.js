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
        name: 'Sustainable Smart Cities & Clean Energy',
        description: 'Decarbonization, urban mobility, circular waste management, and renewable microgrids.',
        isActive: true,
      }),
      Theme.create({
        name: 'AI & Healthcare Innovations',
        description: 'Predictive diagnostics, affordable medical devices, and accessible telemedicine.',
        isActive: true,
      }),
      Theme.create({
        name: 'Agritech & Rural Empowerment',
        description: 'Smart irrigation, precision farming, post-harvest loss reduction, and fair-price market linkages.',
        isActive: true,
      }),
    ]);

    console.log('[Seed] Creating Sample Participants...');
    const [participant1, participant2, participant3] = await Promise.all([
      User.create({
        name: 'Rohan Mehta',
        email: 'rohan@example.com',
        phone: '+919876543220',
        password: defaultPassword,
        role: 'participant',
        isActive: true,
      }),
      User.create({
        name: 'Priya Nair',
        email: 'priya@example.com',
        phone: '+919876543221',
        password: defaultPassword,
        role: 'participant',
        isActive: true,
      }),
      User.create({
        name: 'Kavya Reddy',
        email: 'kavya@example.com',
        phone: '+919876543222',
        password: defaultPassword,
        role: 'participant',
        isActive: true,
      }),
    ]);

    console.log('[Seed] Creating Sample Teams & Submissions...');
    // Team 1: Round 1 Submitted
    const team1 = await Team.create({
      teamId: 'TEAM-2026-001',
      teamName: 'EcoTransformers',
      leader: participant1._id,
      theme: theme1._id,
      createdBy: participant1._id,
      members: [
        { name: 'Sameer Verma', email: 'sameer@example.com', phone: '+919876543231', roleInTeam: 'Hardware Dev' },
        { name: 'Neha Gupta', email: 'neha@example.com', phone: '+919876543232', roleInTeam: 'UI/UX' },
      ],
      round1Status: 'SUBMITTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
      assignedPanelists: [panelist1._id],
    });

    await Round1Submission.create({
      teamId: team1._id,
      themeId: theme1._id,
      problemStatement: 'Rapid urban organic waste generation causing landfill methane emissions and local pollution.',
      proposedSolution: 'Automated decentralised aerobic biomethanation compost pods connected via IoT sensors for real-time monitoring.',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 24 * 3600 * 1000),
    });

    // Team 2: Round 1 Selected & Round 2 Submitted
    const team2 = await Team.create({
      teamId: 'TEAM-2026-002',
      teamName: 'HealthAI Diagnostics',
      leader: participant2._id,
      theme: theme2._id,
      createdBy: participant2._id,
      members: [
        { name: 'Amit Joshi', email: 'amit@example.com', phone: '+919876543233', roleInTeam: 'ML Engineer' },
      ],
      round1Status: 'SELECTED',
      round2Status: 'SUBMITTED',
      finalStatus: 'NOT_QUALIFIED',
      assignedPanelists: [panelist1._id, panelist2._id],
    });

    await Round1Submission.create({
      teamId: team2._id,
      themeId: theme2._id,
      problemStatement: 'Delayed screening for diabetic retinopathy in rural primary healthcare centers.',
      proposedSolution: 'Smartphone-attachable optical lens paired with offline edge AI model for instant retinal screening.',
      status: 'SELECTED',
      submittedAt: new Date(Date.now() - 48 * 3600 * 1000),
    });

    await Round2Submission.create({
      teamId: team2._id,
      detailedConcept: 'Edge AI device running quantized mobile-net vision architecture trained on verified fundus photography.',
      problemAnalysis: 'Over 70 million diabetic patients in India with less than 20,000 ophthalmologists.',
      proposedSolution: 'Handheld 3D-printed attachment with integrated optical lens and offline Android inference app.',
      valueProposition: 'Screening cost under $0.50 per patient with 94.8% sensitivity and 96.2% specificity.',
      feasibilityPlan90Days: 'Day 1-30: Pilot testing at 5 PHCs. Day 31-60: Clinical validation. Day 61-90: CE compliance certification.',
      resourceRequirements: 'Optical engineers, ophthalmologist validation advisory, edge GPU cloud for fine-tuning.',
      expectedImpact: 'Prevent vision loss for over 100,000 rural citizens annually.',
      scalability: 'SaaS licensing to state health departments and non-profit health missions.',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 12 * 3600 * 1000),
    });

    // Team 3: Grand Finalist
    const team3 = await Team.create({
      teamId: 'TEAM-2026-003',
      teamName: 'AgriVision IoT',
      leader: participant3._id,
      theme: theme3._id,
      createdBy: participant3._id,
      members: [
        { name: 'Vikas Rao', email: 'vikas@example.com', phone: '+919876543234', roleInTeam: 'Embedded Systems' },
      ],
      round1Status: 'SELECTED',
      round2Status: 'SELECTED',
      finalStatus: 'FINALIST',
      assignedPanelists: [panelist2._id],
    });

    // Create Event Configuration
    console.log('[Seed] Setting up Event / Round configuration & finalist slots...');
    const finaleDate = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days from now
    await Event.create({
      eventName: 'Hasiru Samvadha Ideathon 2026',
      isRegistrationOpen: true,
      round1: {
        status: 'OPEN',
        deadline: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        instructions: 'Submit your problem definition and proposed technical solution.',
      },
      round2: {
        status: 'OPEN',
        deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        instructions: 'Provide a comprehensive 90-day implementation roadmap, scalability, and financial model.',
      },
      finalRound: {
        status: 'UPCOMING',
        eventDate: finaleDate,
        venue: 'Grand Innovation Auditorium, Tech Park Bangalore',
        instructions: 'Deliver a 10-minute presentation followed by 5 minutes of Q&A with the jury.',
      },
      finalists: [
        {
          teamId: team3._id,
          venue: 'Grand Innovation Auditorium - Hall A',
          eventDate: finaleDate,
          startTime: '10:30 AM',
          presentationDuration: '15 minutes',
          instructions: 'Please bring your working prototype and slides on USB.',
          status: 'SCHEDULED',
        },
      ],
    });

    // Initial notifications
    await Promise.all([
      Notification.create({
        userId: participant1._id,
        teamId: team1._id,
        title: 'Round 1 Submission Received',
        message: 'Your Round 1 proposal for EcoTransformers is under evaluation.',
        type: 'ROUND1_SUBMITTED',
      }),
      Notification.create({
        userId: participant2._id,
        teamId: team2._id,
        title: 'Round 1 Selected!',
        message: 'Congratulations! Your team HealthAI Diagnostics has been selected for Round 2.',
        type: 'ROUND1_SELECTED',
      }),
      Notification.create({
        userId: participant3._id,
        teamId: team3._id,
        title: '🏆 Grand Finalist Selection',
        message: 'Your team AgriVision IoT is selected as a Grand Finalist!',
        type: 'FINALIST_SELECTED',
      }),
    ]);

    console.log('\n======================================================');
    console.log('✅ Database seeded successfully!');
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
    console.log('------------------------------------------------------');
    console.log('Participant Accounts:');
    console.log('  1. Email: rohan@example.com (EcoTransformers - R1 Submitted)');
    console.log('  2. Email: priya@example.com (HealthAI - R1 Selected, R2 Submitted)');
    console.log('  3. Email: kavya@example.com (AgriVision - Grand Finalist)');
    console.log(`     Password for all: ${defaultPassword}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
