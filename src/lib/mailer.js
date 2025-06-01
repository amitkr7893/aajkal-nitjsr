// “Here is lib/mailer.js ⬇️”
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use your college SMTP server
  auth: {
    user: process.env.EMAIL_USER,       // e.g., your Gmail or SMTP email
    pass: process.env.EMAIL_PASS,       // App password or SMTP password
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for aajkal@nitjsr',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

