const User = require('../models/User');
const Team = require('../models/Team');
const Theme = require('../models/Theme');
const Round1Submission = require('../models/Round1Submission');
const Round2Submission = require('../models/Round2Submission');
const Evaluation = require('../models/Evaluation');
const Event = require('../models/Event');
const notificationService = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get Admin Dashboard Statistics and Analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const { theme, dateFrom, dateTo } = req.query;
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    const teamFilter = { ...dateFilter };
    if (theme) {
      teamFilter.theme = theme;
    }

    const [
      totalParticipants,
      totalPanelists,
      totalTeams,
      round1Submissions,
      round1Selected,
      round1Rejected,
      round2Submissions,
      round2Selected,
      finalists,
      totalEvaluations,
      themesList,
    ] = await Promise.all([
      User.countDocuments({ role: 'participant', ...dateFilter }),
      User.countDocuments({ role: 'panelist', ...dateFilter }),
      Team.countDocuments(teamFilter),
      Round1Submission.countDocuments({ status: { $in: ['SUBMITTED', 'UNDER_SCRUTINY', 'SELECTED', 'NOT_SELECTED'] } }),
      Team.countDocuments({ ...teamFilter, round1Status: 'SELECTED' }),
      Team.countDocuments({ ...teamFilter, round1Status: 'NOT_SELECTED' }),
      Round2Submission.countDocuments({ status: { $in: ['SUBMITTED', 'UNDER_EVALUATION', 'SELECTED', 'NOT_SELECTED'] } }),
      Team.countDocuments({ ...teamFilter, round2Status: 'SELECTED' }),
      Team.countDocuments({ ...teamFilter, finalStatus: 'FINALIST' }),
      Evaluation.countDocuments(),
      Theme.find(),
    ]);

    // Pending evaluations = Assigned teams without an evaluation
    const teamsWithPanelists = await Team.find({ assignedPanelists: { $exists: true, $ne: [] } });
    let pendingEvaluations = 0;
    for (const t of teamsWithPanelists) {
      const evalCount = await Evaluation.countDocuments({ teamId: t._id });
      if (evalCount < (t.assignedPanelists || []).length) {
        pendingEvaluations += (t.assignedPanelists.length - evalCount);
      }
    }

    const stats = {
      totalParticipants,
      totalPanelists,
      totalTeams,
      round1Submissions,
      round1Selected,
      round1Rejected,
      round2Submissions,
      round2Selected,
      finalists,
      pendingEvaluations,
      totalEvaluations,
      themesCount: themesList.length,
    };

    return sendSuccess(res, 'Dashboard metrics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Selects Team in Round 1
 * @route   PUT /api/admin/teams/:teamId/round1/select
 * @access  Private (Admin only)
 */
const selectRound1Team = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    // Update team status
    team.round1Status = 'SELECTED';
    // Round 2 is automatically unlocked for the team
    team.round2Status = 'DRAFT';
    await team.save();

    // Update Round 1 submission if exists
    await Round1Submission.findOneAndUpdate(
      { teamId: team._id },
      { status: 'SELECTED' }
    );

    // Trigger multi-channel notification (In-app, Email, SMS)
    notificationService.notifyRound1Selected(team.leader, team).catch((err) => {
      console.error('[Notification Error on Round 1 Selection]', err.message);
    });

    return sendSuccess(
      res,
      `Team '${team.teamName}' (${team.teamId}) successfully selected for Round 2.`,
      team
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Rejects Team in Round 1
 * @route   PUT /api/admin/teams/:teamId/round1/reject
 * @access  Private (Admin only)
 */
const rejectRound1Team = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    team.round1Status = 'NOT_SELECTED';
    team.round2Status = 'LOCKED';
    await team.save();

    await Round1Submission.findOneAndUpdate(
      { teamId: team._id },
      { status: 'NOT_SELECTED' }
    );

    notificationService.notifyRound1Rejected(team.leader, team).catch((err) => {
      console.error('[Notification Error on Round 1 Rejection]', err.message);
    });

    return sendSuccess(
      res,
      `Team '${team.teamName}' has been marked as Not Selected in Round 1.`,
      team
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Selects Team in Round 2 (Promotes to Finalist)
 * @route   PUT /api/admin/teams/:teamId/round2/select
 * @access  Private (Admin only)
 */
const selectRound2Team = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    if (team.round1Status !== 'SELECTED') {
      return sendError(res, 'Cannot promote team: Must be selected in Round 1 first.', 400);
    }

    team.round2Status = 'SELECTED';
    team.finalStatus = 'FINALIST';
    await team.save();

    await Round2Submission.findOneAndUpdate(
      { teamId: team._id },
      { status: 'SELECTED' }
    );

    notificationService.notifyRound2Selected(team.leader, team).catch((err) => {
      console.error('[Notification Error on Round 2 Selection]', err.message);
    });

    return sendSuccess(
      res,
      `Team '${team.teamName}' successfully promoted to Grand Finalist.`,
      team
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Rejects Team in Round 2
 * @route   PUT /api/admin/teams/:teamId/round2/reject
 * @access  Private (Admin only)
 */
const rejectRound2Team = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    team.round2Status = 'NOT_SELECTED';
    team.finalStatus = 'NOT_QUALIFIED';
    await team.save();

    await Round2Submission.findOneAndUpdate(
      { teamId: team._id },
      { status: 'NOT_SELECTED' }
    );

    notificationService.notifyRound2Rejected(team.leader, team).catch((err) => {
      console.error('[Notification Error on Round 2 Rejection]', err.message);
    });

    return sendSuccess(
      res,
      `Team '${team.teamName}' marked as Not Selected in Round 2.`,
      team
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create / Update Finalist Event Schedule details
 * @route   POST /api/admin/finalists
 * @access  Private (Admin only)
 */
const scheduleFinalistEvent = async (req, res, next) => {
  try {
    const {
      teamId,
      venue,
      eventDate,
      startTime,
      presentationDuration,
      instructions,
    } = req.body;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    if (team.finalStatus !== 'FINALIST') {
      return sendError(res, 'Team must be designated as a FINALIST before scheduling finale presentation.', 400);
    }

    const eventConfig = await Event.getEventConfig();

    const scheduleData = {
      teamId: team._id,
      venue: venue || eventConfig.finalRound.venue || 'Main Stage',
      eventDate: eventDate ? new Date(eventDate) : (eventConfig.finalRound.eventDate || new Date()),
      startTime: startTime || '10:00 AM',
      presentationDuration: presentationDuration || '15 minutes',
      instructions: instructions || 'Please bring your slides on a USB drive.',
      status: 'SCHEDULED',
    };

    // Upsert into finalists array in Event model
    const existingIndex = eventConfig.finalists.findIndex(
      (f) => f.teamId.toString() === team._id.toString()
    );

    if (existingIndex > -1) {
      eventConfig.finalists[existingIndex] = {
        ...eventConfig.finalists[existingIndex].toObject(),
        ...scheduleData,
      };
    } else {
      eventConfig.finalists.push(scheduleData);
    }

    await eventConfig.save();

    // Notify team
    notificationService.notifyFinalistSchedule(team.leader, team, scheduleData).catch((err) => {
      console.error('[Notification Error on Finalist Schedule]', err.message);
    });

    return sendSuccess(
      res,
      `Finalist presentation scheduled successfully for team '${team.teamName}'.`,
      scheduleData,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Finalist Details for a Team
 * @route   GET /api/finalists/:teamId
 * @access  Private (Finalists / Assigned Panelist / Admin)
 */
const getFinalistDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('leader members');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    // Access control: Only finalists or admins/panelists can view
    if (req.user.role === 'participant') {
      const isLeader = team.leader._id.toString() === req.user._id.toString();
      const isMember = team.members.some((m) => m.email === req.user.email);
      if (!isLeader && !isMember) {
        return sendError(res, 'Access denied.', 403);
      }
      if (team.finalStatus !== 'FINALIST') {
        return sendError(res, 'Only finalists can access final-round information.', 403);
      }
    }

    const eventConfig = await Event.getEventConfig();
    const finalistEntry = eventConfig.finalists.find(
      (f) => f.teamId.toString() === team._id.toString()
    );

    return sendSuccess(res, 'Finalist event details retrieved.', {
      team: {
        id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        finalStatus: team.finalStatus,
      },
      schedule: finalistEntry || {
        venue: eventConfig.finalRound.venue,
        eventDate: eventConfig.finalRound.eventDate,
        startTime: 'TBD',
        presentationDuration: '15 minutes',
        instructions: eventConfig.finalRound.instructions,
      },
      finalRoundConfig: eventConfig.finalRound,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Event & Round Configurations
 * @route   GET /api/admin/rounds
 * @access  Private (Admin)
 */
const getRoundConfigs = async (req, res, next) => {
  try {
    const config = await Event.getEventConfig();
    return sendSuccess(res, 'Round configuration retrieved.', config);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Round Configuration (open/close rounds, deadlines)
 * @route   PUT /api/admin/rounds/:round/update
 * @access  Private (Admin only)
 */
const updateRoundConfig = async (req, res, next) => {
  try {
    const { round } = req.params; // 'registration', 'round1', 'round2', 'final'
    const { status, deadline, eventDate, venue, instructions, isRegistrationOpen } = req.body;

    const eventConfig = await Event.getEventConfig();

    if (round === 'registration') {
      if (isRegistrationOpen !== undefined) eventConfig.isRegistrationOpen = isRegistrationOpen;
      if (status) eventConfig.isRegistrationOpen = status === 'OPEN';
      if (deadline) eventConfig.registrationDeadline = new Date(deadline);
    } else if (round === 'round1') {
      if (status) eventConfig.round1.status = status;
      if (deadline) eventConfig.round1.deadline = new Date(deadline);
      if (instructions) eventConfig.round1.instructions = instructions;
    } else if (round === 'round2') {
      if (status) eventConfig.round2.status = status;
      if (deadline) eventConfig.round2.deadline = new Date(deadline);
      if (instructions) eventConfig.round2.instructions = instructions;
    } else if (round === 'final') {
      if (status) eventConfig.finalRound.status = status;
      if (eventDate) eventConfig.finalRound.eventDate = new Date(eventDate);
      if (venue) eventConfig.finalRound.venue = venue;
      if (instructions) eventConfig.finalRound.instructions = instructions;
    } else {
      return sendError(res, `Invalid round parameter '${round}'. Valid options: registration, round1, round2, final.`, 400);
    }

    await eventConfig.save();
    return sendSuccess(res, `Round '${round}' configuration updated successfully.`, eventConfig);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign Panelist to Team
 * @route   POST /api/admin/assign-panelist
 * @access  Private (Admin only)
 */
const assignPanelist = async (req, res, next) => {
  try {
    const { panelistId, teamId } = req.body;

    const [panelist, team] = await Promise.all([
      User.findOne({ _id: panelistId, role: 'panelist' }),
      Team.findById(teamId),
    ]);

    if (!panelist) {
      return sendError(res, 'Panelist not found or user is not a panelist.', 404);
    }
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    if (!team.assignedPanelists) {
      team.assignedPanelists = [];
    }

    if (!team.assignedPanelists.includes(panelist._id)) {
      team.assignedPanelists.push(panelist._id);
      await team.save();
    }

    return sendSuccess(
      res,
      `Panelist '${panelist.name}' successfully assigned to Team '${team.teamName}'.`,
      team
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Panelists List
 * @route   GET /api/admin/panelists
 * @access  Private (Admin only)
 */
const getPanelists = async (req, res, next) => {
  try {
    const panelists = await User.find({ role: 'panelist' }).select('-password');

    // Enrich with count of assigned teams
    const enriched = await Promise.all(
      panelists.map(async (p) => {
        const assignedTeamsCount = await Team.countDocuments({ assignedPanelists: p._id });
        const evaluatedCount = await Evaluation.countDocuments({ panelistId: p._id });
        return {
          ...p.toObject(),
          assignedTeamsCount,
          evaluatedCount,
        };
      })
    );

    return sendSuccess(res, 'Panelists retrieved successfully.', enriched);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new Panelist account
 * @route   POST /api/admin/panelists
 * @access  Private (Admin only)
 */
const createPanelist = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return sendError(res, 'User with this email or phone already exists.', 400);
    }

    const panelist = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: password || 'Panelist@2026',
      role: 'panelist',
    });

    return sendSuccess(res, 'Panelist account created successfully.', panelist, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a Panelist account
 * @route   PUT /api/admin/panelists/:id
 * @access  Private (Admin only)
 */
const updatePanelist = async (req, res, next) => {
  try {
    const { name, email, phone, isActive } = req.body;
    const panelist = await User.findOne({ _id: req.params.id, role: 'panelist' });

    if (!panelist) {
      return sendError(res, 'Panelist not found.', 404);
    }

    if (name) panelist.name = name;
    if (email) panelist.email = email.toLowerCase();
    if (phone) panelist.phone = phone;
    if (isActive !== undefined) panelist.isActive = isActive;

    await panelist.save();
    return sendSuccess(res, 'Panelist updated successfully.', panelist);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Panelist account
 * @route   DELETE /api/admin/panelists/:id
 * @access  Private (Admin only)
 */
const deletePanelist = async (req, res, next) => {
  try {
    const panelist = await User.findOne({ _id: req.params.id, role: 'panelist' });
    if (!panelist) {
      return sendError(res, 'Panelist not found.', 404);
    }

    // Remove assignments
    await Team.updateMany(
      { assignedPanelists: panelist._id },
      { $pull: { assignedPanelists: panelist._id } }
    );

    await User.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Panelist deleted successfully.', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  selectRound1Team,
  rejectRound1Team,
  selectRound2Team,
  rejectRound2Team,
  scheduleFinalistEvent,
  getFinalistDetails,
  getRoundConfigs,
  updateRoundConfig,
  assignPanelist,
  getPanelists,
  createPanelist,
  updatePanelist,
  deletePanelist,
};
