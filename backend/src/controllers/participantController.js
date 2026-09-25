const Team = require('../models/Team');
const Event = require('../models/Event');
const Theme = require('../models/Theme');
const Round1Submission = require('../models/Round1Submission');
const Round2Submission = require('../models/Round2Submission');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get Participant Dashboard Summary & Stage Access Status
 * @route   GET /api/participants/dashboard
 * @access  Private (Participant only)
 */
const getParticipantDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find team
    const team = await Team.findOne({
      $or: [{ leader: userId }, { 'members.email': req.user.email }],
    })
      .populate('theme', 'name description')
      .populate('leader', 'name email phone');

    const eventConfig = await Event.getEventConfig();

    let round1Submission = null;
    let round2Submission = null;
    let finalistSchedule = null;

    if (team) {
      [round1Submission, round2Submission] = await Promise.all([
        Round1Submission.findOne({ teamId: team._id }),
        Round2Submission.findOne({ teamId: team._id }),
      ]);

      if (team.finalStatus === 'FINALIST') {
        finalistSchedule = eventConfig.finalists.find(
          (f) => f.teamId.toString() === team._id.toString()
        );
      }
    }

    const unreadNotificationsCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    const isRound2Unlocked = team ? team.round1Status === 'SELECTED' : false;
    const isFinalRoundUnlocked = team ? team.finalStatus === 'FINALIST' : false;

    const dashboard = {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      team: team || null,
      stageAccess: {
        isRegistered: true,
        hasTeam: Boolean(team),
        isTeamLeader: team ? team.leader._id.toString() === userId.toString() : false,
        round1: {
          isOpen: eventConfig.round1.status === 'OPEN',
          status: team ? team.round1Status : 'NOT_SUBMITTED',
          deadline: eventConfig.round1.deadline,
          submitted: Boolean(round1Submission && round1Submission.status === 'SUBMITTED'),
        },
        round2: {
          isUnlocked: isRound2Unlocked,
          isOpen: eventConfig.round2.status === 'OPEN',
          status: team ? team.round2Status : 'LOCKED',
          deadline: eventConfig.round2.deadline,
          submitted: Boolean(round2Submission && round2Submission.status === 'SUBMITTED'),
        },
        finalRound: {
          isUnlocked: isFinalRoundUnlocked,
          status: team ? team.finalStatus : 'NOT_QUALIFIED',
          eventDate: eventConfig.finalRound.eventDate,
          schedule: finalistSchedule || null,
        },
      },
      submissions: {
        round1: round1Submission || null,
        round2: round2Submission || null,
      },
      unreadNotificationsCount,
    };

    return sendSuccess(res, 'Participant dashboard overview retrieved.', dashboard);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public event / round statuses and active themes
 * @route   GET /api/participants/event-status
 * @access  Public / Authenticated
 */
const getEventStatus = async (req, res, next) => {
  try {
    const [eventConfig, activeThemes] = await Promise.all([
      Event.getEventConfig(),
      Theme.find({ isActive: true }).select('name description'),
    ]);

    return sendSuccess(res, 'Ideathon event status retrieved.', {
      eventName: eventConfig.eventName,
      isRegistrationOpen: eventConfig.isRegistrationOpen,
      round1Status: eventConfig.round1.status,
      round2Status: eventConfig.round2.status,
      finalRoundStatus: eventConfig.finalRound.status,
      activeThemes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParticipantDashboard,
  getEventStatus,
};
