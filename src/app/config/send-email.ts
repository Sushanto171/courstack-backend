import { SendEmailSDK } from "@sushantokumar/email-sdk";
import config from ".";

const gmailSender = SendEmailSDK.createGmail({
  user: config.nodeMailer.APP_USER,
  pass: config.nodeMailer.APP_PASS,
})

export interface ISendEmail {
  subject: string;
  text?: string;
  html?: string;
  to: string;
  from: string;
  purpose: "Security" | "info"
}

export const sendEmail = async (payload: ISendEmail) => {
  const { to, subject, text, html, purpose, from } = payload;

  if (!to || !subject) {
    throw new Error("Email and Subject are required");
  }

  const info = await gmailSender.send({
    from: `"Courstack ${purpose === "Security" ? "Security" : "Info"}" <${from}>`,
    to,
    subject,
    text,
    html
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
};
