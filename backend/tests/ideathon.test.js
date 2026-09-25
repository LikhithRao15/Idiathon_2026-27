const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Theme = require('../src/models/Theme');
const Team = require('../src/models/Team');
const Event = require('../src/models/Event');
const Notification = require('../src/models/Notification');

let mongoServer;
let adminToken;
let panelistToken;
let unassignedPanelistToken;
let participantToken;
let selectedParticipantToken;
let themeId;
let participantUser;
let selectedParticipantUser;
let panelistUser;
let unassignedPanelistUser;
let adminUser;
let team1Id;
let team2Id;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Initialize Event config
  await Event.create({
    eventName: 'Hasiru Samvadha Ideathon Test',
    isRegistrationOpen: true,
    round1: { status: 'OPEN' },
    round2: { status: 'OPEN' },
    finalRound: { status: 'UPCOMING' },
  });

  // Create Theme
  const theme = await Theme.create({
    name: 'Sustainable Smart Cities',
    description: 'Smart green urban infrastructure and energy conservation.',
    isActive: true,
  });
  themeId = theme._id.toString();

  // Create Admin User
  adminUser = await User.create({
    name: 'Admin Test',
    email: 'admin.test@ideathon.org',
    phone: '+919999900001',
    password: 'Password@123',
    role: 'admin',
  });

  // Create Panelists
  panelistUser = await User.create({
    name: 'Panelist One',
    email: 'panelist1.test@ideathon.org',
    phone: '+919999900002',
    password: 'Password@123',
    role: 'panelist',
  });

  unassignedPanelistUser = await User.create({
    name: 'Panelist Two (Unassigned)',
    email: 'panelist2.test@ideathon.org',
    phone: '+919999900003',
    password: 'Password@123',
    role: 'panelist',
  });

  // Log in Admin to get token
  const adminLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin.test@ideathon.org', password: 'Password@123' });
  adminToken = adminLoginRes.body.data.token;

  // Log in Panelist
  const panelistLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'panelist1.test@ideathon.org', password: 'Password@123' });
  panelistToken = panelistLoginRes.body.data.token;

  const unassignedLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'panelist2.test@ideathon.org', password: 'Password@123' });
  unassignedPanelistToken = unassignedLoginRes.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('1. Authentication Tests', () => {
  it('should register a new participant successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Arjun Das',
        email: 'arjun.participant@example.com',
        phone: '+919876500001',
        password: 'Password@123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('arjun.participant@example.com');
    expect(res.body.data.token).toBeDefined();
    participantToken = res.body.data.token;
    participantUser = res.body.data.user;
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Arjun Duplicate',
        email: 'arjun.participant@example.com',
        phone: '+919876500099',
        password: 'Password@123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'arjun.participant@example.com',
        password: 'Password@123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('participant');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'arjun.participant@example.com',
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fetch profile with GET /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe('arjun.participant@example.com');
  });
});

describe('2. Team Management Tests', () => {
  it('should create a new team for the participant', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        teamName: 'GreenTech Innovators',
        theme: themeId,
        members: [
          { name: 'Member A', email: 'memberA@example.com', phone: '+919876500010' },
          { name: 'Member B', email: 'memberB@example.com', phone: '+919876500011' },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.teamName).toBe('GreenTech Innovators');
    expect(res.body.data.teamId).toMatch(/^TEAM-\d{4}-\d{3}$/);
    expect(res.body.data.round1Status).toBe('NOT_SUBMITTED');
    expect(res.body.data.round2Status).toBe('LOCKED');
    team1Id = res.body.data._id;
  });

  it('should prevent creating a second team for the same leader', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        teamName: 'GreenTech Second Team',
        theme: themeId,
        members: [],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should retrieve my team details via GET /api/teams/my-team', async () => {
    const res = await request(app)
      .get('/api/teams/my-team')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.teamName).toBe('GreenTech Innovators');
  });
});

describe('3. Round 1 Submission & Access Control', () => {
  it('should submit Round 1 idea pitch proposal', async () => {
    const res = await request(app)
      .post('/api/round1/submit')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        problemStatement: 'Heavy energy consumption in streetlighting during non-peak midnight hours.',
        proposedSolution: 'AI-driven dynamic luminaire dimming grid based on real-time pedestrian and vehicle sensors.',
        isDraft: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
  });

  it('should fetch Round 1 submission', async () => {
    const res = await request(app)
      .get('/api/round1/submission')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.problemStatement).toContain('streetlighting');
  });
});

describe('4. Strict Round 2 Access Control', () => {
  it('should reject Round 2 access with 403 Forbidden when round1Status !== SELECTED', async () => {
    const res = await request(app)
      .post('/api/round2/submit')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        detailedConcept: 'Comprehensive AI dimming grid system architecture.',
        problemAnalysis: 'Energy wastage analysis across 10 municipal wards.',
        proposedSolution: 'Edge sensor gateways with mesh networking.',
        valueProposition: '45% reduction in municipal lighting power costs.',
        feasibilityPlan90Days: 'Phase 1 prototype, Phase 2 field pilot, Phase 3 certification.',
        resourceRequirements: 'Microcontrollers, light sensors, cloud server.',
        expectedImpact: 'Save 1.2 GWh power annually per zone.',
        scalability: 'Deployable across all tier 1 and tier 2 cities.',
        isDraft: false,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Round 2 is available only for teams selected in Round 1.');
  });
});

describe('5. Panelist Assignment and Evaluation', () => {
  it('should allow admin to assign a panelist to the team', async () => {
    const res = await request(app)
      .post('/api/admin/assign-panelist')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        panelistId: panelistUser._id.toString(),
        teamId: team1Id,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should prevent an unassigned panelist from evaluating the team', async () => {
    const res = await request(app)
      .post('/api/evaluations/round1')
      .set('Authorization', `Bearer ${unassignedPanelistToken}`)
      .send({
        teamId: team1Id,
        scores: {
          problemUnderstanding: 8,
          innovation: 9,
          proposedSolution: 8,
          feasibility: 7,
          expectedImpact: 8,
        },
        comments: 'Great concept from unassigned evaluator',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow the assigned panelist to evaluate the team with auto total score calculation', async () => {
    const res = await request(app)
      .post('/api/evaluations/round1')
      .set('Authorization', `Bearer ${panelistToken}`)
      .send({
        teamId: team1Id,
        scores: {
          problemUnderstanding: 9,
          innovation: 8,
          proposedSolution: 9,
          feasibility: 8,
          expectedImpact: 9,
        },
        comments: 'Strong proposal with clear environmental impact.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalScore).toBe(43); // 9+8+9+8+9
  });
});

describe('6. Admin Selection & Round 2 Access Unlocking', () => {
  it('should allow admin to select the team in Round 1', async () => {
    const res = await request(app)
      .put(`/api/admin/teams/${team1Id}/round1/select`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.round1Status).toBe('SELECTED');
    expect(res.body.data.round2Status).toBe('DRAFT');
  });

  it('should allow Round 2 submission after Round 1 selection', async () => {
    const res = await request(app)
      .post('/api/round2/submit')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        detailedConcept: 'Comprehensive AI dimming grid system architecture.',
        problemAnalysis: 'Energy wastage analysis across 10 municipal wards.',
        proposedSolution: 'Edge sensor gateways with mesh networking.',
        valueProposition: '45% reduction in municipal lighting power costs.',
        feasibilityPlan90Days: 'Phase 1 prototype, Phase 2 field pilot, Phase 3 certification.',
        resourceRequirements: 'Microcontrollers, light sensors, cloud server.',
        expectedImpact: 'Save 1.2 GWh power annually per zone.',
        scalability: 'Deployable across all tier 1 and tier 2 cities.',
        isDraft: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
  });
});

describe('7. Finalist Promotion, Scheduling & In-App Notifications', () => {
  it('should allow admin to select team in Round 2 and promote to Finalist', async () => {
    const res = await request(app)
      .put(`/api/admin/teams/${team1Id}/round2/select`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.round2Status).toBe('SELECTED');
    expect(res.body.data.finalStatus).toBe('FINALIST');
  });

  it('should allow admin to schedule finalist presentation slot', async () => {
    const res = await request(app)
      .post('/api/admin/finalists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        teamId: team1Id,
        venue: 'Grand Innovation Stage - Hall 1',
        eventDate: new Date(),
        startTime: '11:00 AM',
        presentationDuration: '15 minutes',
        instructions: 'Bring your working prototype and slides on USB.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should allow finalist team member to access finalist event details', async () => {
    const res = await request(app)
      .get(`/api/finalists/${team1Id}`)
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.team.finalStatus).toBe('FINALIST');
    expect(res.body.data.schedule.venue).toContain('Grand Innovation Stage');
  });

  it('should fetch in-app notifications generated for the participant', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.notifications.length).toBeGreaterThan(0);
    expect(res.body.data.unreadCount).toBeGreaterThan(0);
  });

  it('should mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('8. Admin Dashboard & Metrics', () => {
  it('should return admin dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalParticipants).toBeGreaterThanOrEqual(1);
    expect(res.body.data.totalTeams).toBeGreaterThanOrEqual(1);
    expect(res.body.data.finalists).toBeGreaterThanOrEqual(1);
  });
});
