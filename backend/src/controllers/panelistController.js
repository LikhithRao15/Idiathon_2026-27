const Team = require('../models/Team');
const Round1Submission = require('../models/Round1Submission');
const Round2Submission = require('../models/Round2Submission');
const Evaluation = require('../models/Evaluation');
const notificationService = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all teams assigned to the logged-in panelist
 * @route   GET /api/panelists/assigned-teams
 * @access  Private (Panelist only)
 */
const getAssignedTeams = async (req, res, next) => {
  try {
    const panelistId = req.user._id;

    // Fetch teams explicitly assigned to panelist OR submitted teams in open pool (assignedPanelists is empty)
    const assignedTeams = await Team.find({
      $or: [
        { assignedPanelists: panelistId },
        { assignedPanelists: { $size: 0 }, round1Status: { $in: ['SUBMITTED', 'SELECTED', 'REJECTED'] } },
        { assignedPanelists: { $exists: false }, round1Status: { $in: ['SUBMITTED', 'SELECTED', 'REJECTED'] } },
      ],
    })
      .populate('leader', 'name email phone')
      .populate('theme', 'name description')
      .sort({ createdAt: -1 });

    // Enrich with submission and evaluation status for each team
    const enrichedTeams = await Promise.all(
      assignedTeams.map(async (team) => {
        const [r1Submission, r2Submission, r1Eval, r2Eval, finalEval] = await Promise.all([
          Round1Submission.findOne({ teamId: team._id }).select('status submittedAt problemStatement proposedSolution'),
          Round2Submission.findOne({ teamId: team._id }).select('status submittedAt detailedConcept valuePropositionAndCircularity feasibilityPlan90Days resourceRequirements'),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 1 }),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 2 }),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 3 }),
        ]);

        const isDirectlyAssigned = team.assignedPanelists && team.assignedPanelists.some(
          (p) => p.toString() === panelistId.toString()
        );

        return {
          ...team.toObject(),
          isDirectlyAssigned: !!isDirectlyAssigned,
          submissions: {
            round1: r1Submission || null,
            round2: r2Submission || null,
          },
          myEvaluations: {
            round1: r1Eval || null,
            round2: r2Eval || null,
            finalRound: finalEval || null,
          },
        };
      })
    );

    return sendSuccess(res, 'Assigned teams retrieved successfully.', enrichedTeams);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of an assigned team
 * @route   GET /api/panelists/assigned-teams/:teamId
 * @access  Private (Panelist only)
 */
const getAssignedTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const panelistId = req.user._id;

    const team = await Team.findById(teamId)
      .populate('leader', 'name email phone')
      .populate('theme', 'name description');

    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    const [r1Submission, r2Submission, myEvals] = await Promise.all([
      Round1Submission.findOne({ teamId: team._id }),
      Round2Submission.findOne({ teamId: team._id }),
      Evaluation.find({ teamId: team._id, panelistId }),
    ]);

    return sendSuccess(res, 'Team details retrieved successfully.', {
      team,
      round1Submission: r1Submission,
      round2Submission: r2Submission,
      evaluations: myEvals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Panelist Dashboard Overview
 * @route   GET /api/panelists/dashboard
 * @access  Private (Panelist only)
 */
const getPanelistDashboard = async (req, res, next) => {
  try {
    const panelistId = req.user._id;

    const totalAssigned = await Team.countDocuments({
      $or: [
        { assignedPanelists: panelistId },
        { round1Status: { $in: ['SUBMITTED', 'SELECTED', 'REJECTED'] } },
      ],
    });
    const evaluationsDone = await Evaluation.countDocuments({ panelistId });
    const round1Pending = await Team.countDocuments({
      round1Status: 'SUBMITTED',
      _id: {
        $nin: await Evaluation.find({ panelistId, round: 1 }).distinct('teamId'),
      },
    });

    return sendSuccess(res, 'Panelist dashboard summary retrieved.', {
      totalAssignedTeams: totalAssigned,
      totalEvaluationsCompleted: evaluationsDone,
      round1PendingEvaluations: round1Pending,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Panelist advances assigned team to Round 2
 * @route   PUT /api/panelists/teams/:teamId/select-round1
 * @access  Private (Panelist or Admin)
 */
const selectTeamForRound2 = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const panelistId = req.user._id;

    const team = await Team.findById(teamId).populate('leader');
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    if (req.user.role === 'panelist') {
      const isAssigned = team.assignedPanelists && team.assignedPanelists.some(
        (p) => p.toString() === panelistId.toString()
      );
      if (!isAssigned) {
        team.assignedPanelists.push(panelistId);
      }
    }

    team.round1Status = 'SELECTED';
    team.round2Status = 'DRAFT';
    await team.save();

    await Round1Submission.findOneAndUpdate(
      { teamId: team._id },
      { status: 'SELECTED' }
    );

    // Trigger multi-channel notifications & SMS
    notificationService.notifyRound1Selected(team.leader, team).catch((err) => {
      console.error('[Notification Error on Panelist Round 1 Selection]:', err.message);
    });

    return sendSuccess(
      res,
      `Team '${team.teamName}' has been SELECTED for Round 2 by Panelist evaluation!`,
      team
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedTeams,
  getAssignedTeamDetails,
  getPanelistDashboard,
  selectTeamForRound2,
};

