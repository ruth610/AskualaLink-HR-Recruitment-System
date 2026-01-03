import { transporter } from '../workers/emailTransporter.js';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: 'ruthambaw610@gmail.com',
      to,
      subject,
      html
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};
