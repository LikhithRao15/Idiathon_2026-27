const Notification = require('../models/Notification');
const emailService = require('./emailService');
const smsService = require('./smsService');

/**
 * Dispatch Multi-Channel Notification to a User or Team
 */
class NotificationService {
  /**
   * Helper to collect all unique phone numbers for a team (Leader + Members)
   */
  _extractTeamPhones(user, team) {
    const phones = new Set();
    if (user && user.phone) {
      phones.add(user.phone.trim());
    }
    if (team && Array.isArray(team.members)) {
      team.members.forEach((member) => {
        if (member && member.phone) {
          phones.add(member.phone.trim());
        }
      });
    }
    return Array.from(phones);
  }

  /**
   * Create an in-app notification record
   */
  async createInAppNotification({ userId, teamId, title, message, type, channel = 'IN_APP' }) {
    try {
      const notification = await Notification.create({
        userId,
        teamId,
        title,
        message,
        type,
        channel,
      });
      return notification;
    } catch (error) {
      console.error(`[Notification Service] Failed to create in-app notification: ${error.message}`);
      return null;
    }
  }

  /**
   * Trigger full multi-channel notification for Registration
   */
  async notifyRegistration(user) {
    try {
      // 1. In-app notification
      await this.createInAppNotification({
        userId: user._id,
        title: 'Welcome to Ideathon 2026!',
        message: 'Your registration was successful. Create your team and select a theme.',
        type: 'REGISTRATION',
        channel: 'ALL',
      });

      // 2. Email notification
      await emailService.sendRegistrationEmail(user);

      // 3. SMS for registration
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Welcome to Hasiru Samvadha Ideathon 2026, ${user.name}! Your registration is confirmed. Team creation is now open.`
        );
      }
    } catch (error) {
      console.error(`[Notification Service Error on Registration]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Round 1 Selection
   */
  async notifyRound1Selected(user, team) {
    try {
      const title = 'Congratulations! Round 1 Selected';
      const message = `Your team ${team.teamName} has been selected for Round 2 – Idea Elaboration.`;

      // 1. In-app notification for leader
      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'ROUND1_SELECTED',
          channel: 'ALL',
        });
      }

      // 2. Email
      await emailService.sendRound1SelectedEmail(user, team);

      // 3. SMS to Leader & All Team Members
      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `🎉 CONGRATULATIONS! Team ${team.teamName} has been SELECTED for Round 2 in Hasiru Samvadha Ideathon 2026! Log in to your portal to submit Round 2 elaboration.`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Round 1 Selection]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Round 1 Rejection
   */
  async notifyRound1Rejected(user, team) {
    try {
      const title = 'Round 1 Submission Status Update';
      const message = `Thank you for participating. Team ${team.teamName} was not selected for Round 2.`;

      // 1. In-app
      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'ROUND1_REJECTED',
          channel: 'ALL',
        });
      }

      // 2. Email
      await emailService.sendRound1RejectedEmail(user, team);

      // 3. SMS to Leader & All Team Members
      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `Hasiru Samvadha Ideathon 2026: Team ${team.teamName} Round 1 results have been published. Check your dashboard for feedback. Thank you for participating!`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Round 1 Rejection]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Round 2 Selection / Finalist Promotion
   */
  async notifyRound2Selected(user, team) {
    try {
      const title = 'Congratulations! Finalist Selected';
      const message = `Your team ${team.teamName} has been selected as a Grand Finalist for Hasiru Samvadha Ideathon 2026!`;

      // 1. In-app
      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'FINALIST_SELECTED',
          channel: 'ALL',
        });
      }

      // 2. Email
      await emailService.sendRound2SelectedEmail(user, team);

      // 3. SMS to Leader & All Team Members
      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `🏆 GRAND FINALIST: Team ${team.teamName} has advanced to the Grand Finale of Hasiru Samvadha Ideathon 2026! Check dashboard for your schedule & venue details.`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Finalist Selection]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Round 2 Rejection
   */
  async notifyRound2Rejected(user, team) {
    try {
      const title = 'Round 2 Submission Status Update';
      const message = `Thank you for your effort. Team ${team.teamName} was not selected for the Grand Finale.`;

      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'ROUND2_REJECTED',
          channel: 'ALL',
        });
      }

      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `Hasiru Samvadha Ideathon 2026: Team ${team.teamName} Round 2 evaluation results are published. Thank you for your innovative submission!`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Round 2 Rejection]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Finalist Event Schedule update
   */
  async notifyFinalistSchedule(user, team, eventSchedule) {
    try {
      const formattedDate = eventSchedule.eventDate ? new Date(eventSchedule.eventDate).toLocaleDateString() : 'TBD';
      const title = 'Grand Finale Schedule Published';
      const message = `Venue: ${eventSchedule.venue}, Date: ${formattedDate}, Time: ${eventSchedule.startTime}.`;

      // 1. In-app
      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'FINAL_EVENT_REMINDER',
          channel: 'ALL',
        });
      }

      // 2. Email
      await emailService.sendFinalistEmail(user, team, eventSchedule);

      // 3. SMS to Leader & All Team Members
      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `Ideathon Finale Presentation for Team ${team.teamName}: Date ${formattedDate}, Time ${eventSchedule.startTime} at ${eventSchedule.venue}.`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Finalist Schedule]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for final result published
   */
  async notifyFinalResult(user, team, standing) {
    try {
      const title = 'Ideathon 2026 Final Results Announced';
      const message = `Team ${team.teamName} standing: ${standing}`;

      if (user && user._id) {
        await this.createInAppNotification({
          userId: user._id,
          teamId: team._id,
          title,
          message,
          type: 'RESULT_PUBLISHED',
          channel: 'ALL',
        });
      }

      await emailService.sendResultEmail(user, team, standing);

      const phoneNumbers = this._extractTeamPhones(user, team);
      const smsMessage = `🏆 Hasiru Samvadha Ideathon Final Results: Team ${team.teamName} has secured ${standing}! Congratulations on your performance.`;

      for (const phone of phoneNumbers) {
        await smsService.sendSMS(phone, smsMessage);
      }
    } catch (error) {
      console.error(`[Notification Error on Final Result]: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();
