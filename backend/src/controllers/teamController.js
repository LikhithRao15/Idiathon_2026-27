const Team = require('../models/Team');
const Theme = require('../models/Theme');
const User = require('../models/User');
const Event = require('../models/Event');
const generateTeamId = require('../utils/generateTeamId');
const { sendSuccess, sendError } = require('../utils/response');
const env = require('../config/env');

/**
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Private (Participant only)
 */
const createTeam = async (req, res, next) => {
  try {
    const { teamName, theme: themeId, members = [] } = req.body;
    const leaderId = req.user._id;

    // Check if registration is open
    const eventConfig = await Event.getEventConfig();
    if (!eventConfig.isRegistrationOpen) {
      return sendError(res, 'Team registration is currently closed.', 400);
    }

    // Check if leader is already leading or part of an existing team
    const existingLeaderTeam = await Team.findOne({
      $or: [
        { leader: leaderId },
        { createdBy: leaderId },
        { 'members.email': req.user.email },
      ],
    });

    if (existingLeaderTeam) {
      return sendError(
        res,
        `You are already associated with team '${existingLeaderTeam.teamName}' (${existingLeaderTeam.teamId}). A participant can only belong to one team.`,
        400
      );
    }

    // Check if team name is taken
    const existingName = await Team.findOne({
      teamName: { $regex: new RegExp(`^${teamName.trim()}$`, 'i') },
    });
    if (existingName) {
      return sendError(res, 'A team with this name already exists. Please choose a different name.', 400);
    }

    // Verify Theme exists and is active
    const theme = await Theme.findById(themeId);
    if (!theme || !theme.isActive) {
      return sendError(
        res,
        'Selected theme is invalid or not currently active for participation.',
        400
      );
    }

    // Validate members limit
    if (members.length + 1 > env.MAX_TEAM_SIZE) {
      return sendError(
        res,
        `Maximum team size is ${env.MAX_TEAM_SIZE} members (including the leader).`,
        400
      );
    }

    // Check duplicate members within the submitted team
    const memberEmails = new Set();
    const memberPhones = new Set();

    // Include leader's own contact in check
    memberEmails.add(req.user.email.toLowerCase());
    memberPhones.add(req.user.phone);

    for (const member of members) {
      const email = member.email.toLowerCase();
      const phone = member.phone;

      if (memberEmails.has(email)) {
        return sendError(
          res,
          `Duplicate member email '${email}' detected in team submission.`,
          400
        );
      }
      if (memberPhones.has(phone)) {
        return sendError(
          res,
          `Duplicate member phone '${phone}' detected in team submission.`,
          400
        );
      }

      // Check if this member is already in another team in database
      const memberInOtherTeam = await Team.findOne({
        $or: [
          { 'members.email': email },
          { 'members.phone': phone },
          { leader: await User.findOne({ email }).select('_id') },
        ],
      });

      if (memberInOtherTeam) {
        return sendError(
          res,
          `Member with email ${email} or phone ${phone} is already registered in team '${memberInOtherTeam.teamName}'.`,
          400
        );
      }

      memberEmails.add(email);
      memberPhones.add(phone);
    }

    // Generate unique formatted Team ID (e.g. TEAM-2026-001)
    const teamId = await generateTeamId();

    const newTeam = await Team.create({
      teamId,
      teamName: teamName.trim(),
      leader: leaderId,
      members,
      theme: theme._id,
      createdBy: leaderId,
      round1Status: 'NOT_SUBMITTED',
      round2Status: 'LOCKED',
      finalStatus: 'NOT_QUALIFIED',
    });

    const populatedTeam = await Team.findById(newTeam._id)
      .populate('leader', 'name email phone role')
      .populate('theme', 'name description');

    return sendSuccess(
      res,
      'Team created successfully.',
      populatedTeam,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in participant's team
 * @route   GET /api/teams/my-team
 * @access  Private (Participant only)
 */
const getMyTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      $or: [{ leader: req.user._id }, { 'members.email': req.user.email }],
    })
      .populate('leader', 'name email phone role')
      .populate('theme', 'name description')
      .populate('assignedPanelists', 'name email');

    if (!team) {
      return sendError(res, 'No team found for the current user. Please create a team first.', 404);
    }

    return sendSuccess(res, 'Team details retrieved successfully.', team);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single team by ID
 * @route   GET /api/teams/:id
 * @access  Private
 */
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email phone role')
      .populate('theme', 'name description')
      .populate('assignedPanelists', 'name email');

    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    // Check authorization: participant can only view their own team unless admin/panelist
    if (
      req.user.role === 'participant' &&
      team.leader._id.toString() !== req.user._id.toString() &&
      !team.members.some((m) => m.email === req.user.email)
    ) {
      return sendError(res, 'Access denied. You can only view your own team details.', 403);
    }

    return sendSuccess(res, 'Team details retrieved successfully.', team);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update team information (members/name)
 * @route   PUT /api/teams/my-team
 * @access  Private (Participant / Leader only)
 */
const updateMyTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({ leader: req.user._id });
    if (!team) {
      return sendError(res, 'Only the team leader can update team details.', 403);
    }

    if (team.round1Status === 'SUBMITTED' || team.round1Status === 'SELECTED') {
      return sendError(
        res,
        'Team details cannot be modified after submitting Round 1.',
        400
      );
    }

    const { teamName, members } = req.body;

    if (teamName) {
      const existingName = await Team.findOne({
        _id: { $ne: team._id },
        teamName: { $regex: new RegExp(`^${teamName.trim()}$`, 'i') },
      });
      if (existingName) {
        return sendError(res, 'A team with this name already exists.', 400);
      }
      team.teamName = teamName.trim();
    }

    if (members && Array.isArray(members)) {
      if (members.length + 1 > env.MAX_TEAM_SIZE) {
        return sendError(res, `Max team size is ${env.MAX_TEAM_SIZE}`, 400);
      }
      team.members = members;
    }

    await team.save();
    return sendSuccess(res, 'Team updated successfully.', team);
  } catch (error) {
    next(error);
  }
};

const Evaluation = require('../models/Evaluation');

/**
 * @desc    Get all teams (Admin or Panelist view)
 * @route   GET /api/teams
 * @access  Private (Admin / Panelist)
 */
const getAllTeams = async (req, res, next) => {
  try {
    const { theme, round1Status, round2Status, finalStatus, search } = req.query;
    const filter = {};

    if (req.user.role === 'panelist') {
      filter.assignedPanelists = req.user._id;
    }

    if (theme) filter.theme = theme;
    if (round1Status) filter.round1Status = round1Status;
    if (round2Status) filter.round2Status = round2Status;
    if (finalStatus) filter.finalStatus = finalStatus;
    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { teamId: { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await Team.find(filter)
      .populate('leader', 'name email phone')
      .populate('theme', 'name description')
      .populate('assignedPanelists', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all evaluations for the fetched teams to enrich scoring insights for Admin & Panelists
    const teamIds = teams.map((t) => t._id);
    const allEvaluations = await Evaluation.find({ teamId: { $in: teamIds } })
      .populate('panelistId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Group evaluations by teamId and compute metrics
    const evalMap = {};
    for (const ev of allEvaluations) {
      const tIdStr = ev.teamId.toString();
      if (!evalMap[tIdStr]) {
        evalMap[tIdStr] = { r1: [], r2: [], final: [], all: [] };
      }
      evalMap[tIdStr].all.push(ev);
      if (ev.round === 1) evalMap[tIdStr].r1.push(ev);
      else if (ev.round === 2) evalMap[tIdStr].r2.push(ev);
      else if (ev.round === 3) evalMap[tIdStr].final.push(ev);
    }

    const enrichedTeams = teams.map((team) => {
      const evals = evalMap[team._id.toString()] || { r1: [], r2: [], final: [], all: [] };
      
      const r1Total = evals.r1.reduce((sum, e) => sum + (e.totalScore || 0), 0);
      const r1Avg = evals.r1.length > 0 ? Number((r1Total / evals.r1.length).toFixed(1)) : null;

      const r2Total = evals.r2.reduce((sum, e) => sum + (e.totalScore || 0), 0);
      const r2Avg = evals.r2.length > 0 ? Number((r2Total / evals.r2.length).toFixed(1)) : null;

      return {
        ...team,
        evaluations: evals.all,
        r1AvgScore: r1Avg,
        r1EvaluationsCount: evals.r1.length,
        r2AvgScore: r2Avg,
        r2EvaluationsCount: evals.r2.length,
        latestAvgScore: r2Avg !== null ? r2Avg : r1Avg,
      };
    });

    return sendSuccess(res, 'Teams retrieved successfully.', enrichedTeams);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getMyTeam,
  getTeamById,
  updateMyTeam,
  getAllTeams,
};
