export const interviewInviteTemplate = ({ name, role, startHour, endHour, interviewDay, meetingLink }) => `
  <h3>Interview Invitation</h3>
  <p>Dear ${name},</p>
  <p>You have been shortlisted for the <b>${role}</b> position.</p>
  <p>Interview Date: <b>on ${interviewDay} ${startHour}</b> to <b>${endHour}</b></p>
  <p>Meeting Link: <a href="${meetingLink}">${meetingLink}</a></p>
  <p>Best regards,<br/>HR Team</p>
`;