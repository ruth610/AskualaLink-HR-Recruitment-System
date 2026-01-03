import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/test', (req, res) => {
    const { subject, body } = req.body;
    sendEmail({
        to: 'rutham9519@gmail.com',
        subject: subject,
        html: body
    })
    .then(() => {
        console.log(subject);
        return res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
    });
});

export { router };