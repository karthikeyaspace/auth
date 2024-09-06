// flow
// user enters mail -> generate jwt -> send mail -> user clicks link /mail+jwt -> is token valid -> login

import jwt from "jsonwebtoken";
import * as db from "../jwt/db";
import config from "../config";
import { UserTypes } from "../jwt";
import { sendMail } from "./email";

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const login = async (
  email: string
): Promise<{ status: boolean; message: string; user: UserTypes | null }> => {
  const user = await db.findUserByEmail(email);
  if (!user) {
    return { status: false, message: "User not found", user: null };
  }

  const token = jwt.sign({ email: user.email }, config.JWT_SECRET, {
    expiresIn: "5m",
  });

  console.log("User:", user);
  console.log("Token:", token);

  const mail: MailOptions = {
    from: config.FROM_MAIL,
    to: user.email,
    subject: "Login to your account",
    text: `Click on the link to login: ${config.BASE_URL}/magiclink/${token}`,
    html: `<p>Click on the link to login: <a href="${config.BASE_URL}/magiclink/${token}">Login</a></p>`,
  };

  try {
    await sendMail(mail);
  } catch (err) {
    return { status: false, message: "Error sending mail", user: null };
  }

  return { status: true, message: "Mail sent", user };
};

const validateToken = async (
  token: string
): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { email: string };
    const user = await db.findUserByEmail(decoded.email);
    if(user) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export { login, validateToken };
