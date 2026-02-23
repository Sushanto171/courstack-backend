import nodemailer from "nodemailer";
import config from ".";
import { otpTemplate } from "../utils/otpTemplate";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: config.node_env === "development" ? 465 : 587,
  secure: config.node_env === "development", // true for 465, false for other ports
  auth: {
    user: config.nodeMailer.APP_USER,
    pass: config.nodeMailer.APP_PASS,
  },
});

interface ISendEmail {
  subject: string;
  text?: string;
  html?: string;
  email: string;
  otp?: string;
  senderEmail: string;
  purpose: "Security" | "info"
}

export const sendEmail = async (payload: ISendEmail) => {
  const { email, subject, text, html, otp, purpose, senderEmail } = payload;

  if (!email || !subject) {
    throw new Error("Email and Subject are required");
  }

  console.log("email sending start....");

  const info = await transporter.sendMail({
    from: `"Courstack ${purpose === "Security" ? "Security" : "Info"}" <${senderEmail}>`,
    to: email,
    subject,

    text:text ??(otp? `Your OTP Code is ${otp}. This code will expire in 5 minutes.`
        : undefined),

    html: html ?? (otp ? otpTemplate(otp) : undefined),
  });

  console.log("Message send: ", info.messageId);

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
};
