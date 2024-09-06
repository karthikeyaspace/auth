import { MailOptions } from "."
import nodemailer from "nodemailer";
import config from "../config";

const sendMail = async (mail: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: config.MAIL_SERVICE,
    auth: {
      user: config.FROM_MAIL,
      pass: config.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail(mail);
};

export { sendMail };