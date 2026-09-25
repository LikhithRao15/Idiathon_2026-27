const Notification = require('../models/Notification');
const emailService = require('./emailService');
const smsService = require('./smsService');

/**
 * Dispatch Multi-Channel Notification to a User or Team
 */
class NotificationService {
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

      // SMS for registration (optional)
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Welcome to Hasiru Samvadha Ideathon 2026, ${user.name}! Your registration is confirmed.`
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

      // 1. In-app
      await this.createInAppNotification({
        userId: user._id,
        teamId: team._id,
        title,
        message,
        type: 'ROUND1_SELECTED',
        channel: 'ALL',
      });

      // 2. Email
      await emailService.sendRound1SelectedEmail(user, team);

      // 3. SMS (Important notification)
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Congratulations! Team ${team.teamName} has been SELECTED for Round 2 in Hasiru Samvadha Ideathon 2026. Log in to submit Round 2.`
        );
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
      await this.createInAppNotification({
        userId: user._id,
        teamId: team._id,
        title,
        message,
        type: 'ROUND1_REJECTED',
        channel: 'ALL',
      });

      // 2. Email
      await emailService.sendRound1RejectedEmail(user, team);

      // 3. SMS
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Hasiru Samvadha Ideathon 2026: Team ${team.teamName} status updated. Check your email/dashboard for details.`
        );
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
      await this.createInAppNotification({
        userId: user._id,
        teamId: team._id,
        title,
        message,
        type: 'FINALIST_SELECTED',
        channel: 'ALL',
      });

      // 2. Email
      await emailService.sendRound2SelectedEmail(user, team);

      // 3. SMS (Important notification)
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `🏆 GRAND FINALIST: Team ${team.teamName} has advanced to the Grand Finale! Check dashboard for event details.`
        );
      }
    } catch (error) {
      console.error(`[Notification Error on Finalist Selection]: ${error.message}`);
    }
  }

  /**
   * Trigger notification for Finalist Event Schedule update
   */
  async notifyFinalistSchedule(user, team, eventSchedule) {
    try {
      const title = 'Grand Finale Schedule Published';
      const message = `Venue: ${eventSchedule.venue}, Date: ${new Date(eventSchedule.eventDate).toDateString()}, Time: ${eventSchedule.startTime}.`;

      // 1. In-app
      await this.createInAppNotification({
        userId: user._id,
        teamId: team._id,
        title,
        message,
        type: 'FINAL_EVENT_REMINDER',
        channel: 'ALL',
      });

      // 2. Email
      await emailService.sendFinalistEmail(user, team, eventSchedule);

      // 3. SMS
      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Ideathon Finale Schedule for Team ${team.teamName}: Date ${new Date(eventSchedule.eventDate).toLocaleDateString()}, Time ${eventSchedule.startTime} at ${eventSchedule.venue}.`
        );
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

      await this.createInAppNotification({
        userId: user._id,
        teamId: team._id,
        title,
        message,
        type: 'RESULT_PUBLISHED',
        channel: 'ALL',
      });

      await emailService.sendResultEmail(user, team, standing);

      if (user.phone) {
        await smsService.sendSMS(
          user.phone,
          `Hasiru Samvadha Ideathon: Results are out! Team ${team.teamName} - ${standing}. Thank you for participating!`
        );
      }
    } catch (error) {
      console.error(`[Notification Error on Final Result]: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();
