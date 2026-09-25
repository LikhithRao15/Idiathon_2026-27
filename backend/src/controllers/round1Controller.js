const Round1Submission = require('../models/Round1Submission');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Submit or save draft for Round 1
 * @route   POST /api/round1/submit
 * @access  Private (Participant / Team Leader only)
 */
const submitRound1 = async (req, res, next) => {
  try {
    const { problemStatement, proposedSolution, themeId, isDraft } = req.body;
    const userId = req.user._id;

    // 1. Check Event / Round 1 Status
    const eventConfig = await Event.getEventConfig();
    if (eventConfig.round1.status !== 'OPEN') {
      return sendError(
        res,
        `Round 1 submission is currently ${eventConfig.round1.status.toLowerCase()}. Submissions are only accepted when Round 1 is OPEN.`,
        400
      );
    }

    // 2. Find participant's team where user is LEADER
    const team = await Team.findOne({ leader: userId });
    if (!team) {
      return sendError(
        res,
        'You must be the designated team leader of an existing team to submit Round 1.',
        403
      );
    }

    // Check if team is already selected for Round 2 or submitted
    if (team.round1Status === 'SELECTED') {
      return sendError(
        res,
        'Round 1 problem statement is locked. Your team has been SELECTED for Round 2 and submissions can no longer be modified.',
        400
      );
    }

    // Check if already officially submitted
    let existingSubmission = await Round1Submission.findOne({ teamId: team._id });
    if (existingSubmission && (existingSubmission.status === 'SUBMITTED' || existingSubmission.status === 'SELECTED')) {
      return sendError(
        res,
        'Round 1 proposal has already been submitted for your team and is locked.',
        400
      );
    }

    const submissionStatus = isDraft === true || isDraft === 'true' ? 'DRAFT' : 'SUBMITTED';
    const activeThemeId = themeId || team.theme;

    let submission;
    if (existingSubmission) {
      existingSubmission.problemStatement = problemStatement || existingSubmission.problemStatement;
      existingSubmission.proposedSolution = proposedSolution || existingSubmission.proposedSolution;
      existingSubmission.themeId = activeThemeId;
      existingSubmission.status = submissionStatus;
      if (submissionStatus === 'SUBMITTED') {
        existingSubmission.submittedAt = new Date();
      }
      submission = await existingSubmission.save();
    } else {
      submission = await Round1Submission.create({
        teamId: team._id,
        themeId: activeThemeId,
        problemStatement: problemStatement || '',
        proposedSolution: proposedSolution || '',
        status: submissionStatus,
        submittedAt: submissionStatus === 'SUBMITTED' ? new Date() : null,
      });
    }

    // Update Team's round 1 status
    team.round1Status = submissionStatus;
    await team.save();

    // In-app notification for submission
    if (submissionStatus === 'SUBMITTED') {
      await Notification.create({
        userId,
        teamId: team._id,
        title: 'Round 1 Proposal Submitted',
        message: `Your Round 1 idea pitch for team '${team.teamName}' was submitted successfully and is awaiting review.`,
        type: 'ROUND1_SUBMITTED',
        channel: 'IN_APP',
      });
    }

    return sendSuccess(
      res,
      submissionStatus === 'SUBMITTED'
        ? 'Round 1 submitted successfully'
        : 'Round 1 draft saved successfully',
      submission,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get team's Round 1 submission
 * @route   GET /api/round1/submission
 * @access  Private (Participant / Leader / Assigned Panelist / Admin)
 */
const getRound1Submission = async (req, res, next) => {
  try {
    const { teamId } = req.query;
    let targetTeamId = teamId;

    if (req.user.role === 'participant') {
      const userTeam = await Team.findOne({
        $or: [{ leader: req.user._id }, { 'members.email': req.user.email }],
      });
      if (!userTeam) {
        return sendError(res, 'You are not part of any team.', 404);
      }
      targetTeamId = userTeam._id;
    }

    if (!targetTeamId) {
      return sendError(res, 'Team ID is required to fetch submission.', 400);
    }

    const submission = await Round1Submission.findOne({ teamId: targetTeamId })
      .populate('teamId', 'teamId teamName leader members round1Status')
      .populate('themeId', 'name description');

    if (!submission) {
      return sendError(res, 'No Round 1 submission found for this team.', 404);
    }

    return sendSuccess(res, 'Round 1 submission retrieved successfully.', submission);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Round 1 submission by ID
 * @route   PUT /api/round1/submission/:id
 * @access  Private (Leader or Admin/Panelist status update)
 */
const updateRound1Submission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { problemStatement, proposedSolution, status, isDraft } = req.body;

    const submission = await Round1Submission.findById(id).populate('teamId');
    if (!submission) {
      return sendError(res, 'Round 1 submission not found.', 404);
    }

    // Role-based editing rules
    if (req.user.role === 'participant') {
      // Must be team leader
      if (submission.teamId.leader.toString() !== req.user._id.toString()) {
        return sendError(res, 'Only the team leader can update the Round 1 submission.', 403);
      }

      // Cannot update if already submitted / under review
      if (submission.status === 'SUBMITTED' || submission.status === 'SELECTED') {
        return sendError(res, 'Cannot edit an already submitted or evaluated Round 1 proposal.', 400);
      }

      if (problemStatement) submission.problemStatement = problemStatement;
      if (proposedSolution) submission.proposedSolution = proposedSolution;

      const newStatus = isDraft === false || isDraft === 'false' ? 'SUBMITTED' : 'DRAFT';
      submission.status = newStatus;
      if (newStatus === 'SUBMITTED') {
        submission.submittedAt = new Date();
      }

      await submission.save();

      // Update team status
      await Team.findByIdAndUpdate(submission.teamId._id, { round1Status: newStatus });
    } else if (['admin', 'panelist'].includes(req.user.role)) {
      // Admin/Panelist can update workflow status e.g. UNDER_SCRUTINY
      if (status && ['UNDER_SCRUTINY', 'SUBMITTED', 'DRAFT'].includes(status)) {
        submission.status = status;
        await submission.save();
        await Team.findByIdAndUpdate(submission.teamId._id, { round1Status: status });
      }
    }

    return sendSuccess(res, 'Round 1 submission updated successfully.', submission);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRound1,
  getRound1Submission,
  updateRound1Submission,
};
