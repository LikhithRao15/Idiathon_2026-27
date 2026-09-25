const Round2Submission = require('../models/Round2Submission');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Submit or save draft for Round 2 (Idea Elaboration)
 * @route   POST /api/round2/submit
 * @access  Private (Participant / Team Leader only)
 */
const submitRound2 = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Find participant's team where user is leader
    const team = await Team.findOne({ leader: userId });
    if (!team) {
      return sendError(
        res,
        'You must be the designated team leader of an existing team to access Round 2.',
        403
      );
    }

    // 2. STRICT RULE: Check if team was SELECTED in Round 1
    if (team.round1Status !== 'SELECTED') {
      return sendError(
        res,
        'Round 2 is available only for teams selected in Round 1.',
        403
      );
    }

    // 3. Check if Round 2 is currently OPEN in event config
    const eventConfig = await Event.getEventConfig();
    if (eventConfig.round2.status !== 'OPEN') {
      return sendError(
        res,
        `Round 2 is currently ${eventConfig.round2.status.toLowerCase()}. Submissions are accepted only when Round 2 is OPEN.`,
        400
      );
    }

    const {
      detailedConcept,
      problemAnalysis,
      proposedSolution,
      valueProposition,
      feasibilityPlan90Days,
      resourceRequirements,
      expectedImpact,
      scalability,
      isDraft,
    } = req.body;

    let existingSubmission = await Round2Submission.findOne({ teamId: team._id });
    if (existingSubmission && existingSubmission.status === 'SUBMITTED') {
      return sendError(
        res,
        'Round 2 proposal has already been submitted for your team.',
        400
      );
    }

    const submissionStatus = isDraft === true || isDraft === 'true' ? 'DRAFT' : 'SUBMITTED';

    let submission;
    if (existingSubmission) {
      existingSubmission.detailedConcept = detailedConcept || existingSubmission.detailedConcept;
      existingSubmission.problemAnalysis = problemAnalysis || existingSubmission.problemAnalysis;
      existingSubmission.proposedSolution = proposedSolution || existingSubmission.proposedSolution;
      existingSubmission.valueProposition = valueProposition || existingSubmission.valueProposition;
      existingSubmission.feasibilityPlan90Days = feasibilityPlan90Days || existingSubmission.feasibilityPlan90Days;
      existingSubmission.resourceRequirements = resourceRequirements || existingSubmission.resourceRequirements;
      existingSubmission.expectedImpact = expectedImpact || existingSubmission.expectedImpact;
      existingSubmission.scalability = scalability || existingSubmission.scalability;
      existingSubmission.status = submissionStatus;
      if (submissionStatus === 'SUBMITTED') {
        existingSubmission.submittedAt = new Date();
      }
      submission = await existingSubmission.save();
    } else {
      submission = await Round2Submission.create({
        teamId: team._id,
        detailedConcept: detailedConcept || '',
        problemAnalysis: problemAnalysis || '',
        proposedSolution: proposedSolution || '',
        valueProposition: valueProposition || '',
        feasibilityPlan90Days: feasibilityPlan90Days || '',
        resourceRequirements: resourceRequirements || '',
        expectedImpact: expectedImpact || '',
        scalability: scalability || '',
        status: submissionStatus,
        submittedAt: submissionStatus === 'SUBMITTED' ? new Date() : null,
      });
    }

    // Update Team's round 2 status
    team.round2Status = submissionStatus;
    await team.save();

    // In-app notification
    if (submissionStatus === 'SUBMITTED') {
      await Notification.create({
        userId,
        teamId: team._id,
        title: 'Round 2 Proposal Submitted',
        message: `Your Round 2 Idea Elaboration for team '${team.teamName}' has been submitted for panel evaluation.`,
        type: 'SYSTEM_ANNOUNCEMENT',
        channel: 'IN_APP',
      });
    }

    return sendSuccess(
      res,
      submissionStatus === 'SUBMITTED'
        ? 'Round 2 submitted successfully'
        : 'Round 2 draft saved successfully',
      submission,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get team's Round 2 submission
 * @route   GET /api/round2/submission
 * @access  Private (Participant / Leader / Panelist / Admin)
 */
const getRound2Submission = async (req, res, next) => {
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

      // Check access permission
      if (userTeam.round1Status !== 'SELECTED') {
        return sendError(
          res,
          'Round 2 is available only for teams selected in Round 1.',
          403
        );
      }

      targetTeamId = userTeam._id;
    }

    if (!targetTeamId) {
      return sendError(res, 'Team ID is required to fetch Round 2 submission.', 400);
    }

    const submission = await Round2Submission.findOne({ teamId: targetTeamId })
      .populate('teamId', 'teamId teamName leader members round1Status round2Status');

    if (!submission) {
      return sendError(res, 'No Round 2 submission found for this team.', 404);
    }

    return sendSuccess(res, 'Round 2 submission retrieved successfully.', submission);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Round 2 submission by ID
 * @route   PUT /api/round2/submission/:id
 * @access  Private (Leader or Admin/Panelist status update)
 */
const updateRound2Submission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await Round2Submission.findById(id).populate('teamId');
    if (!submission) {
      return sendError(res, 'Round 2 submission not found.', 404);
    }

    if (req.user.role === 'participant') {
      if (submission.teamId.leader.toString() !== req.user._id.toString()) {
        return sendError(res, 'Only the team leader can update the Round 2 proposal.', 403);
      }

      if (submission.teamId.round1Status !== 'SELECTED') {
        return sendError(
          res,
          'Round 2 is available only for teams selected in Round 1.',
          403
        );
      }

      if (submission.status === 'SUBMITTED' || submission.status === 'SELECTED') {
        return sendError(res, 'Cannot edit an already submitted or evaluated Round 2 proposal.', 400);
      }

      const fields = [
        'detailedConcept',
        'problemAnalysis',
        'proposedSolution',
        'valueProposition',
        'feasibilityPlan90Days',
        'resourceRequirements',
        'expectedImpact',
        'scalability',
      ];

      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          submission[field] = req.body[field];
        }
      });

      const newStatus = req.body.isDraft === false || req.body.isDraft === 'false' ? 'SUBMITTED' : 'DRAFT';
      submission.status = newStatus;
      if (newStatus === 'SUBMITTED') {
        submission.submittedAt = new Date();
      }

      await submission.save();
      await Team.findByIdAndUpdate(submission.teamId._id, { round2Status: newStatus });
    } else if (['admin', 'panelist'].includes(req.user.role)) {
      if (req.body.status && ['UNDER_EVALUATION', 'SUBMITTED', 'DRAFT'].includes(req.body.status)) {
        submission.status = req.body.status;
        await submission.save();
        await Team.findByIdAndUpdate(submission.teamId._id, { round2Status: req.body.status });
      }
    }

    return sendSuccess(res, 'Round 2 submission updated successfully.', submission);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRound2,
  getRound2Submission,
  updateRound2Submission,
};
