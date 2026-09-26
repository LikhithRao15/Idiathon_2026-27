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
    console.log('[Seed] Connecting to MongoDB Atlas...');
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

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ideathon.org';
    const adminPassword = process.env.ADMIN_PASSWORD || defaultPassword;

    console.log('[Seed] Creating Administrator account...');
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'System Administrator',
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || '+919876543210',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    console.log('[Seed] Creating 3 Jury Panelists...');
    const [panelist1, panelist2, panelist3] = await Promise.all([
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
      User.create({
        name: 'Dr. Priya Venkatesh',
        email: 'panelist3@ideathon.org',
        phone: '+919876543213',
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

    console.log('[Seed] Creating 6 Participant Leaders & Teams with submissions and evaluations...');

    // 1. Team: GreenCycle Innovators (Grand Finalist)
    const leader1 = await User.create({
      name: 'Maya Shankar',
      email: 'maya@greencycle.io',
      phone: '+919876500001',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team1 = await Team.create({
      teamId: 'TEAM-2026-001',
      teamName: 'GreenCycle Innovators',
      leader: leader1._id,
      createdBy: leader1._id,
      theme: theme1._id,
      members: [
        { name: 'Rohan Verma', email: 'rohan.v@greencycle.io', phone: '+919876500011', role: 'member' },
        { name: 'Sneha Patil', email: 'sneha.p@greencycle.io', phone: '+919876500012', role: 'member' },
      ],
      assignedPanelists: [panelist1._id, panelist2._id],
      round1Status: 'SELECTED',
      round2Status: 'SELECTED',
      finalStatus: 'FINALIST',
    });

    const r1Sub1 = await Round1Submission.create({
      teamId: team1._id,
      themeId: theme1._id,
      problemStatement: 'Urban commercial complexes generate over 45 tons of unsegregated plastic and organic waste daily, resulting in severe landfill contamination, methane emissions, and massive logistics overhead for local municipalities.',
      proposedSolution: 'Our AI-powered optical sorting bin module (SortSense) instantly detects and separates 14 types of polymers and organic matter at source with 99.2% accuracy, converting food waste directly into bio-methane feedstocks.',
      status: 'SELECTED',
      submittedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
    });

    const r2Sub1 = await Round2Submission.create({
      teamId: team1._id,
      detailedConcept: 'SortSense integrates high-speed hyperspectral computer vision, multi-chamber pneumatic sorting valves, and edge ML inference on Jetson Orin Nano modules. The unit processes up to 80 items per minute with automated density calibration.',
      valuePropositionAndCircularity: 'Delivers 92% purity in sorted recyclables, reducing commercial tipping fees by 40% while generating revenue through high-grade PET/HDPE recovery pellets sold directly to certified plastic recyclers.',
      feasibilityPlan90Days: 'Days 1-30: Complete CAD assembly and pneumatic manifold validation. Days 31-60: Deploy 5 pilot units across Orion Mall food courts. Days 61-90: Sensor telemetry calibration and cloud dashboard integration.',
      resourceRequirements: 'Estimated budget of ₹4,50,000 for 5 industrial-grade test rigs, NIR sensors, Jetson Orin compute nodes, and local municipality waste-handling compliance approvals.',
      status: 'SELECTED',
      submittedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    });

    // Evaluations for Team 1
    await Evaluation.create({
      teamId: team1._id,
      submissionId: r1Sub1._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist1._id,
      round: 1,
      scores: { problemUnderstanding: 19, innovation: 19, feasibility: 18, expectedImpact: 19, presentation: 17 },
      totalScore: 92,
      comments: 'Exceptional problem clarity and very well-thought-out computer vision pipeline. Commercial applicability is very high.',
      evaluatedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team1._id,
      submissionId: r1Sub1._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist2._id,
      round: 1,
      scores: { problemUnderstanding: 18, innovation: 18, feasibility: 17, expectedImpact: 18, presentation: 17 },
      totalScore: 88,
      comments: 'Solid technical feasibility and strong alignment with circular economy principles.',
      evaluatedAt: new Date(Date.now() - 11 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team1._id,
      submissionId: r2Sub1._id,
      submissionModel: 'Round2Submission',
      panelistId: panelist1._id,
      round: 2,
      scores: { conceptClarity: 19, technicalFeasibility: 19, valueProposition: 19, feasibilityPlan: 18, resourcePlanning: 18 },
      totalScore: 93,
      comments: 'Impressive 90-day execution roadmap and viable commercial unit economics. Strong contender for 1st place.',
      evaluatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    });

    // 2. Team: EcoSort AI (Round 2 In Progress)
    const leader2 = await User.create({
      name: 'Arjun Mehta',
      email: 'arjun@ecosort.ai',
      phone: '+919876500002',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team2 = await Team.create({
      teamId: 'TEAM-2026-002',
      teamName: 'EcoSort AI',
      leader: leader2._id,
      createdBy: leader2._id,
      theme: theme2._id,
      members: [
        { name: 'Kavya Nair', email: 'kavya@ecosort.ai', phone: '+919876500021', role: 'member' },
        { name: 'Rahul Joshi', email: 'rahul@ecosort.ai', phone: '+919876500022', role: 'member' },
      ],
      assignedPanelists: [panelist1._id, panelist3._id],
      round1Status: 'SELECTED',
      round2Status: 'DRAFT',
      finalStatus: 'NOT_QUALIFIED',
    });

    const r1Sub2 = await Round1Submission.create({
      teamId: team2._id,
      themeId: theme2._id,
      problemStatement: 'Sanitation personnel are routinely exposed to bio-hazardous medical and electronic waste during manual sorting, causing severe occupational health hazards and inefficient throughput.',
      proposedSolution: 'Robotic automated gripper arm equipped with thermal and RGB-D cameras that autonomously identifies and separates biohazards from conveyor belts before municipal processing.',
      status: 'SELECTED',
      submittedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team2._id,
      submissionId: r1Sub2._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist1._id,
      round: 1,
      scores: { problemUnderstanding: 18, innovation: 18, feasibility: 16, expectedImpact: 17, presentation: 15 },
      totalScore: 84,
      comments: 'Great emphasis on worker safety and automated robotics.',
      evaluatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team2._id,
      submissionId: r1Sub2._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist3._id,
      round: 1,
      scores: { problemUnderstanding: 17, innovation: 17, feasibility: 16, expectedImpact: 16, presentation: 16 },
      totalScore: 82,
      comments: 'Strong safety impact; needs clearer mechanical durability testing in harsh municipal environments.',
      evaluatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    });

    // 3. Team: AquaTerra Biofilter (High Score R1 Submitted - Ready for Batch Promotion)
    const leader3 = await User.create({
      name: 'Suresh Nayak',
      email: 'suresh@aquaterra.in',
      phone: '+919876500003',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team3 = await Team.create({
      teamId: 'TEAM-2026-003',
      teamName: 'AquaTerra Biofilter',
      leader: leader3._id,
      createdBy: leader3._id,
      theme: theme3._id,
      members: [
        { name: 'Divya Shenoy', email: 'divya@aquaterra.in', phone: '+919876500031', role: 'member' },
      ],
      assignedPanelists: [panelist2._id, panelist3._id],
      round1Status: 'SUBMITTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
    });

    const r1Sub3 = await Round1Submission.create({
      teamId: team3._id,
      themeId: theme3._id,
      problemStatement: 'Industrial effluent runoff from small-scale dyeing units pollutes river channels with heavy metals and toxic dyes, evading standard municipal disposal checks.',
      proposedSolution: 'Low-cost mycelium and activated coconut husk bio-filtration cartridges capable of absorbing 94% of synthetic dyes and chromium ions before wastewater enters water bodies.',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team3._id,
      submissionId: r1Sub3._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist3._id,
      round: 1,
      scores: { problemUnderstanding: 19, innovation: 19, feasibility: 18, expectedImpact: 18, presentation: 15 },
      totalScore: 89,
      comments: 'Brilliant bio-material application! Highly cost-effective and scalable for MSMEs.',
      evaluatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    });

    // 4. Team: BioEnergy Loop (R1 Submitted - 76.5 Score)
    const leader4 = await User.create({
      name: 'Deepa Rao',
      email: 'deepa@bioloop.tech',
      phone: '+919876500004',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team4 = await Team.create({
      teamId: 'TEAM-2026-004',
      teamName: 'BioEnergy Loop',
      leader: leader4._id,
      createdBy: leader4._id,
      theme: theme3._id,
      members: [
        { name: 'Harish Gowda', email: 'harish@bioloop.tech', phone: '+919876500041', role: 'member' },
      ],
      assignedPanelists: [panelist2._id],
      round1Status: 'SUBMITTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
    });

    const r1Sub4 = await Round1Submission.create({
      teamId: team4._id,
      themeId: theme3._id,
      problemStatement: 'Agricultural stubble and agro-processing biomass are burnt openly in rural districts, generating heavy seasonal smog and wasting high-calorie energy potential.',
      proposedSolution: 'Mobile compact torrefaction units that convert crop residue into smokeless bio-coal briquettes on-site for thermal power and brick kilns.',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team4._id,
      submissionId: r1Sub4._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist2._id,
      round: 1,
      scores: { problemUnderstanding: 16, innovation: 16, feasibility: 15, expectedImpact: 16, presentation: 14 },
      totalScore: 77,
      comments: 'Practical solution with good environmental value. Logistics of mobile units need deeper financial modelling.',
      evaluatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    });

    // 5. Team: SmartWaste IoT (Awaiting Review)
    const leader5 = await User.create({
      name: 'Neha Kulkarni',
      email: 'neha@smartwaste.in',
      phone: '+919876500005',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team5 = await Team.create({
      teamId: 'TEAM-2026-005',
      teamName: 'SmartWaste IoT',
      leader: leader5._id,
      createdBy: leader5._id,
      theme: theme2._id,
      members: [],
      assignedPanelists: [panelist1._id, panelist3._id],
      round1Status: 'SUBMITTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
    });

    await Round1Submission.create({
      teamId: team5._id,
      themeId: theme2._id,
      problemStatement: 'Municipal waste trucks follow rigid fixed-route schedules, resulting in overflowing dumpsters in commercial areas and wasted fuel for empty bins in suburbs.',
      proposedSolution: 'Ultrasonic fill-level IoT sensors retrofitted onto standard street dumpsters transmitting real-time fill data over LoRaWAN to optimize daily dynamic garbage truck routing.',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    });

    // 6. Team: Plastix Circular (Low score - Rejected)
    const leader6 = await User.create({
      name: 'Vikram Hegde',
      email: 'vikram@plastix.org',
      phone: '+919876500006',
      password: defaultPassword,
      role: 'participant',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const team6 = await Team.create({
      teamId: 'TEAM-2026-006',
      teamName: 'Plastix Circular',
      leader: leader6._id,
      createdBy: leader6._id,
      theme: theme1._id,
      members: [
        { name: 'Pooja Bhat', email: 'pooja@plastix.org', phone: '+919876500061', role: 'member' },
      ],
      assignedPanelists: [panelist2._id],
      round1Status: 'NOT_SELECTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
    });

    const r1Sub6 = await Round1Submission.create({
      teamId: team6._id,
      themeId: theme1._id,
      problemStatement: 'People throw plastic bags into common street bins without separating them.',
      proposedSolution: 'Put color stickers on plastic bags and ask citizens to drop them at special collection centers.',
      status: 'NOT_SELECTED',
      submittedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
    });

    await Evaluation.create({
      teamId: team6._id,
      submissionId: r1Sub6._id,
      submissionModel: 'Round1Submission',
      panelistId: panelist2._id,
      round: 1,
      scores: { problemUnderstanding: 10, innovation: 8, feasibility: 12, expectedImpact: 8, presentation: 10 },
      totalScore: 48,
      comments: 'Proposal lacks technical novelty and sustainable incentive model for citizen compliance.',
      evaluatedAt: new Date(Date.now() - 13 * 24 * 3600 * 1000),
    });

    // Create Event Configuration & Schedule Grand Finalist
    console.log('[Seed] Setting up Event / Round configuration and finalist pass...');
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
      finalists: [
        {
          teamId: team1._id,
          venue: 'Grand Innovation Stage - Hall A',
          startTime: '11:30 AM',
          presentationDuration: '15 minutes',
          eventDate: new Date('2026-12-15'),
          instructions: 'Bring working prototype demonstration and slides on backup USB.',
        },
      ],
    });

    console.log('\n========================================================================');
    console.log('🎉 TEST DATA SEEDING COMPLETE WITH RICH SCENARIOS!');
    console.log('========================================================================');
    console.log('👑 Admin Login:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('------------------------------------------------------------------------');
    console.log('⚖️ Judge / Panelist Logins:');
    console.log(`   1. Email: panelist1@ideathon.org  | Pass: ${defaultPassword} (Dr. Ananya Sharma)`);
    console.log(`   2. Email: panelist2@ideathon.org  | Pass: ${defaultPassword} (Prof. Rajesh Kumar)`);
    console.log(`   3. Email: panelist3@ideathon.org  | Pass: ${defaultPassword} (Dr. Priya Venkatesh)`);
    console.log('------------------------------------------------------------------------');
    console.log('🌱 Participant Team Leaders:');
    console.log(`   1. maya@greencycle.io   | Pass: ${defaultPassword} | [GreenCycle Innovators] -> Grand Finalist 🏆 (Score: 92)`);
    console.log(`   2. arjun@ecosort.ai     | Pass: ${defaultPassword} | [EcoSort AI] -> R2 Unlocked (Score: 83)`);
    console.log(`   3. suresh@aquaterra.in  | Pass: ${defaultPassword} | [AquaTerra Biofilter] -> R1 Submitted (Score: 89)`);
    console.log(`   4. deepa@bioloop.tech   | Pass: ${defaultPassword} | [BioEnergy Loop] -> R1 Submitted (Score: 77)`);
    console.log(`   5. neha@smartwaste.in   | Pass: ${defaultPassword} | [SmartWaste IoT] -> Awaiting Evaluation`);
    console.log(`   6. vikram@plastix.org   | Pass: ${defaultPassword} | [Plastix Circular] -> Not Selected (Score: 48)`);
    console.log('========================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
