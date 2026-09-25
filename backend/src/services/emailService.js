const nodemailer = require('nodemailer');
const env = require('../config/env');

// Create Nodemailer Transporter instance
const createTransporter = () => {
  if (
    !env.SMTP_USER ||
    env.SMTP_USER === 'your-email@gmail.com' ||
    env.SMTP_USER === 'test@ideathon.org' ||
    env.NODE_ENV === 'test'
  ) {
    // Return a mock transport in test/dummy development mode
    return {
      sendMail: async (options) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log(`\n================== [MOCK EMAIL SENT] ==================`);
          console.log(`[To]:      ${options.to}`);
          console.log(`[Subject]: ${options.subject}`);
          console.log(`[From]:    ${options.from}`);
          console.log(`======================================================\n`);
        }
        return { messageId: `MOCK-EMAIL-${Date.now()}` };
      },
    };
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Base email sending helper
 */
const sendMail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * HTML Template Wrapper with rich styling
 */
const baseTemplate = (title, headerText, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #333; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
    .body { padding: 30px; font-size: 15px; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin: 10px 0; }
    .badge-success { background-color: #d1fae5; color: #065f46; }
    .badge-danger { background-color: #fee2e2; color: #991b1b; }
    .button { display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${headerText}</h1>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Hasiru Samvadha Ideathon. All rights reserved.</p>
      <p>This is an automated system email. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. Send Registration Email
 */
const sendRegistrationEmail = async (user) => {
  const content = `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Welcome to <strong>Hasiru Samvadha Ideathon 2026</strong>! Your registration was successful.</p>
    <p>You can now log in, create or join your innovation team, and choose your preferred theme track for Round 1.</p>
    <p><strong>Registered Email:</strong> ${user.email}<br>
    <strong>Registered Role:</strong> ${user.role}</p>
    <p>We are thrilled to see the impactful solutions you will build for a greener, smarter future!</p>
  `;
  return sendMail({
    to: user.email,
    subject: 'Welcome to Hasiru Samvadha Ideathon 2026 - Registration Confirmed',
    html: baseTemplate('Welcome to Ideathon 2026', 'Registration Confirmed 🎉', content),
  });
};

/**
 * 2. Send Round 1 Selected Email
 */
const sendRound1SelectedEmail = async (user, team) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Congratulations! Your team <strong>${team.teamName}</strong> (ID: <code>${team.teamId}</code>) has been <span class="badge badge-success">SELECTED</span> in Round 1: Idea Pitching!</p>
    <p>The panel of judges was deeply impressed by your problem understanding and proposed innovation.</p>
    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>Round 2 (Idea Elaboration) has been unlocked for your team.</li>
      <li>Please prepare your detailed concept, 90-day feasibility plan, budget, and scalability breakdown.</li>
      <li>Log in to your dashboard to submit your Round 2 proposal before the deadline.</li>
    </ul>
  `;
  return sendMail({
    to: user.email,
    subject: `🎉 Congratulations! Team ${team.teamName} Selected for Round 2`,
    html: baseTemplate('Round 1 Results', 'Round 1 Selected! 🚀', content),
  });
};

/**
 * 3. Send Round 1 Rejected Email
 */
const sendRound1RejectedEmail = async (user, team) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Thank you for submitting your proposal for team <strong>${team.teamName}</strong> (ID: <code>${team.teamId}</code>) in Round 1 of Hasiru Samvadha Ideathon 2026.</p>
    <p>Due to the overwhelming number of high-quality submissions, your team was not selected for Round 2.</p>
    <p>We truly appreciate your effort, passion, and time. We encourage you to continue refining your idea and participating in future innovation challenges.</p>
  `;
  return sendMail({
    to: user.email,
    subject: `Update on your Hasiru Samvadha Ideathon Round 1 Submission`,
    html: baseTemplate('Round 1 Update', 'Round 1 Evaluation Update', content),
  });
};

/**
 * 4. Send Round 2 Opened Email
 */
const sendRound2OpenedEmail = async (user, team) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Round 2: <strong>Idea Elaboration</strong> is now officially OPEN for submissions!</p>
    <p>Please log in to the portal and submit your detailed concept, value proposition, and 90-day implementation roadmap for team <strong>${team.teamName}</strong>.</p>
  `;
  return sendMail({
    to: user.email,
    subject: `Round 2: Idea Elaboration is Now Open!`,
    html: baseTemplate('Round 2 Open', 'Round 2 Submission Window Open', content),
  });
};

/**
 * 5. Send Round 2 Selected Email
 */
const sendRound2SelectedEmail = async (user, team) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Outstanding news! Your team <strong>${team.teamName}</strong> has been <span class="badge badge-success">SELECTED AS A FINALIST</span> after Round 2 evaluations!</p>
    <p>You have qualified for the Grand Finale of Hasiru Samvadha Ideathon 2026.</p>
    <p>Final round instructions, slot timings, and venue details will be communicated shortly on your dashboard.</p>
  `;
  return sendMail({
    to: user.email,
    subject: `🏆 Grand Finale Finalist Selection - Team ${team.teamName}`,
    html: baseTemplate('Finalist Announcement', 'You Are a Grand Finalist! 🏆', content),
  });
};

/**
 * 6. Send Finalist Event Schedule Email
 */
const sendFinalistEmail = async (user, team, eventDetails) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Here are the official Grand Finale event details for your team <strong>${team.teamName}</strong>:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Venue:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${eventDetails.venue}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(eventDetails.eventDate).toDateString()}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Presentation Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${eventDetails.startTime}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Duration:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${eventDetails.presentationDuration}</td></tr>
    </table>
    <p><strong>Instructions:</strong></p>
    <p>${eventDetails.instructions}</p>
  `;
  return sendMail({
    to: user.email,
    subject: `Grand Finale Schedule & Pitch Instructions - Team ${team.teamName}`,
    html: baseTemplate('Finale Schedule', 'Grand Finale Details 🌟', content),
  });
};

/**
 * 7. Send Final Round Reminder Email
 */
const sendFinalRoundReminderEmail = async (user, team, eventDetails) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>This is a friendly reminder that the Grand Finale is happening on <strong>${new Date(eventDetails.eventDate).toDateString()}</strong> at <strong>${eventDetails.venue}</strong>.</p>
    <p>Your team <strong>${team.teamName}</strong> is scheduled for presentation at <strong>${eventDetails.startTime}</strong>.</p>
    <p>Good luck!</p>
  `;
  return sendMail({
    to: user.email,
    subject: `Reminder: Grand Finale Pitch Tomorrow - Team ${team.teamName}`,
    html: baseTemplate('Finale Reminder', 'Grand Finale Reminder ⏰', content),
  });
};

/**
 * 8. Send Final Result Email
 */
const sendResultEmail = async (user, team, resultStatus) => {
  const content = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>The final results for Hasiru Samvadha Ideathon 2026 have been officially published!</p>
    <p>Team <strong>${team.teamName}</strong> final standing: <span class="badge badge-success">${resultStatus}</span></p>
    <p>We thank you for your active participation and congratulate all winners and finalists!</p>
  `;
  return sendMail({
    to: user.email,
    subject: `Hasiru Samvadha Ideathon 2026 - Final Results Published`,
    html: baseTemplate('Final Results', 'Official Final Results 🏁', content),
  });
};

module.exports = {
  sendMail,
  sendRegistrationEmail,
  sendRound1SelectedEmail,
  sendRound1RejectedEmail,
  sendRound2OpenedEmail,
  sendRound2SelectedEmail,
  sendFinalistEmail,
  sendFinalRoundReminderEmail,
  sendResultEmail,
};
