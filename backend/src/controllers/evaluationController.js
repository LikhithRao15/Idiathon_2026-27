const Evaluation = require('../models/Evaluation');
const Team = require('../models/Team');
const Round1Submission = require('../models/Round1Submission');
const Round2Submission = require('../models/Round2Submission');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Helper to calculate total score from criteria score object
 */
const calculateTotalScore = (scoresObj) => {
  let total = 0;
  for (const key of Object.keys(scoresObj)) {
    const val = Number(scoresObj[key]);
    if (!isNaN(val)) {
      total += val;
    }
  }
  return total;
};

/**
 * @desc    Submit Round 1 Evaluation
 * @route   POST /api/evaluations/round1
 * @access  Private (Panelist / Admin)
 */
const evaluateRound1 = async (req, res, next) => {
  try {
    const { teamId, scores, comments } = req.body;
    const panelistId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    // Panelist must be assigned to this team unless admin
    if (req.user.role === 'panelist') {
      const isAssigned = team.assignedPanelists && team.assignedPanelists.some(
        (p) => p.toString() === panelistId.toString()
      );
      if (!isAssigned) {
        return sendError(res, 'Access denied. You are not assigned to evaluate this team.', 403);
      }
    }

    // Verify Round 1 submission exists
    const submission = await Round1Submission.findOne({ teamId });
    if (!submission) {
      return sendError(res, 'No Round 1 submission found for this team to evaluate.', 400);
    }

    // Check duplicate evaluation
    const existingEval = await Evaluation.findOne({ teamId, panelistId, round: 1 });
    if (existingEval) {
      return sendError(res, 'You have already submitted an evaluation for this team in Round 1.', 400);
    }

    // Calculate total score automatically
    const totalScore = calculateTotalScore(scores);

    const evaluation = await Evaluation.create({
      teamId,
      submissionId: submission._id,
      submissionModel: 'Round1Submission',
      panelistId,
      round: 1,
      scores,
      totalScore,
      comments: comments || '',
      evaluatedAt: new Date(),
    });

    return sendSuccess(res, 'Round 1 evaluation submitted successfully.', evaluation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Round 1 Evaluations (Assigned for Panelist, all for Admin)
 * @route   GET /api/evaluations/round1
 * @access  Private (Panelist / Admin)
 */
const getRound1Evaluations = async (req, res, next) => {
  try {
    const filter = { round: 1 };
    if (req.user.role === 'panelist') {
      filter.panelistId = req.user._id;
    }
    if (req.query.teamId) {
      filter.teamId = req.query.teamId;
    }

    const evaluations = await Evaluation.find(filter)
      .populate('teamId', 'teamId teamName theme round1Status')
      .populate('panelistId', 'name email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Round 1 evaluations retrieved successfully.', evaluations);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit Round 2 Evaluation
 * @route   POST /api/evaluations/round2
 * @access  Private (Panelist / Admin)
 */
const evaluateRound2 = async (req, res, next) => {
  try {
    const { teamId, scores, comments } = req.body;
    const panelistId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    // Ensure team was selected in Round 1
    if (team.round1Status !== 'SELECTED') {
      return sendError(res, 'Cannot evaluate team in Round 2: Team was not selected in Round 1.', 400);
    }

    // Panelist assignment check
    if (req.user.role === 'panelist') {
      const isAssigned = team.assignedPanelists && team.assignedPanelists.some(
        (p) => p.toString() === panelistId.toString()
      );
      if (!isAssigned) {
        return sendError(res, 'Access denied. You are not assigned to evaluate this team.', 403);
      }
    }

    const submission = await Round2Submission.findOne({ teamId });
    if (!submission) {
      return sendError(res, 'No Round 2 submission found for this team to evaluate.', 400);
    }

    const existingEval = await Evaluation.findOne({ teamId, panelistId, round: 2 });
    if (existingEval) {
      return sendError(res, 'You have already submitted a Round 2 evaluation for this team.', 400);
    }

    const totalScore = calculateTotalScore(scores);

    const evaluation = await Evaluation.create({
      teamId,
      submissionId: submission._id,
      submissionModel: 'Round2Submission',
      panelistId,
      round: 2,
      scores,
      totalScore,
      comments: comments || '',
      evaluatedAt: new Date(),
    });

    return sendSuccess(res, 'Round 2 evaluation submitted successfully.', evaluation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Round 2 Evaluations
 * @route   GET /api/evaluations/round2
 * @access  Private (Panelist / Admin)
 */
const getRound2Evaluations = async (req, res, next) => {
  try {
    const filter = { round: 2 };
    if (req.user.role === 'panelist') {
      filter.panelistId = req.user._id;
    }
    if (req.query.teamId) {
      filter.teamId = req.query.teamId;
    }

    const evaluations = await Evaluation.find(filter)
      .populate('teamId', 'teamId teamName theme round2Status')
      .populate('panelistId', 'name email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Round 2 evaluations retrieved successfully.', evaluations);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit Final Round (Grand Finale) Evaluation
 * @route   POST /api/evaluations/final
 * @access  Private (Panelist / Admin)
 */
const evaluateFinalRound = async (req, res, next) => {
  try {
    const { teamId, scores, comments } = req.body;
    const panelistId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return sendError(res, 'Team not found.', 404);
    }

    if (team.finalStatus !== 'FINALIST') {
      return sendError(res, 'Team is not qualified as a Finalist.', 400);
    }

    const existingEval = await Evaluation.findOne({ teamId, panelistId, round: 3 });
    if (existingEval) {
      return sendError(res, 'You have already evaluated this finalist.', 400);
    }

    const totalScore = calculateTotalScore(scores);

    const evaluation = await Evaluation.create({
      teamId,
      panelistId,
      round: 3,
      scores,
      totalScore,
      comments: comments || '',
      evaluatedAt: new Date(),
    });

    return sendSuccess(res, 'Final round evaluation submitted successfully.', evaluation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get team evaluation summary / aggregate across all rounds
 * @route   GET /api/evaluations/team/:teamId
 * @access  Private (Admin / Panelist)
 */
const getTeamEvaluationSummary = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const evaluations = await Evaluation.find({ teamId })
      .populate('panelistId', 'name email')
      .sort({ round: 1, createdAt: -1 });

    return sendSuccess(res, 'Team evaluations retrieved.', evaluations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  evaluateRound1,
  getRound1Evaluations,
  evaluateRound2,
  getRound2Evaluations,
  evaluateFinalRound,
  getTeamEvaluationSummary,
};
