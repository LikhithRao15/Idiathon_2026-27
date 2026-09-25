const Team = require('../models/Team');
const Round1Submission = require('../models/Round1Submission');
const Round2Submission = require('../models/Round2Submission');
const Evaluation = require('../models/Evaluation');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all teams assigned to the logged-in panelist
 * @route   GET /api/panelists/assigned-teams
 * @access  Private (Panelist only)
 */
const getAssignedTeams = async (req, res, next) => {
  try {
    const panelistId = req.user._id;

    const assignedTeams = await Team.find({ assignedPanelists: panelistId })
      .populate('leader', 'name email phone')
      .populate('theme', 'name description')
      .sort({ createdAt: -1 });

    // Enrich with submission and evaluation status for each team
    const enrichedTeams = await Promise.all(
      assignedTeams.map(async (team) => {
        const [r1Submission, r2Submission, r1Eval, r2Eval, finalEval] = await Promise.all([
          Round1Submission.findOne({ teamId: team._id }).select('status submittedAt'),
          Round2Submission.findOne({ teamId: team._id }).select('status submittedAt'),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 1 }),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 2 }),
          Evaluation.findOne({ teamId: team._id, panelistId, round: 3 }),
        ]);

        return {
          ...team.toObject(),
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

    const team = await Team.findOne({
      _id: teamId,
      assignedPanelists: panelistId,
    })
      .populate('leader', 'name email phone')
      .populate('theme', 'name description');

    if (!team) {
      return sendError(res, 'Team not found or not assigned to your panel.', 404);
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

    const totalAssigned = await Team.countDocuments({ assignedPanelists: panelistId });
    const evaluationsDone = await Evaluation.countDocuments({ panelistId });
    const round1Pending = await Team.countDocuments({
      assignedPanelists: panelistId,
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

module.exports = {
  getAssignedTeams,
  getAssignedTeamDetails,
  getPanelistDashboard,
};
