import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email sending failed");
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Email sending failed");
  }
};

// Send Appointment Confirmation Email
export const sendAppointmentConfirmationEmail = async (email, { doctorName, date, time }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Appointment Confirmation",
    html: `<p>Your appointment with Dr. ${doctorName} is confirmed for:</p>
           <p><strong>Date:</strong> ${date}</p>
           <p><strong>Time:</strong> ${time}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appointment confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    throw new Error("Email sending failed");
  }
};
