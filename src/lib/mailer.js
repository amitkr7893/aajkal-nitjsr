import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"aajkal@nitjsr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your One-Time Password (OTP) - aajkal@nitjsr",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
        <h2 style="color: #2c3e50;">Hello,</h2>
        <p style="font-size: 16px;">
          Thank you for using <b>aajkal@nitjsr</b>. To complete your verification, please use the following One-Time Password (OTP):
        </p>
        <div style="margin: 20px 0; padding: 15px; background: #2c3e50; color: #fff; text-align: center; font-size: 24px; letter-spacing: 2px; border-radius: 8px;">
          <b>${otp}</b>
        </div>
        <p style="font-size: 14px; color: #555;">
          This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
        </p>
        <p style="margin-top: 30px; font-size: 13px; color: #888;">
          Regards,<br/>
          The aajkal@nitjsr Team
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;"/>
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
