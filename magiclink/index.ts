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
    expiresIn: "10m",
  });

  const mail: MailOptions = {
    from: config.FROM_MAIL,
    to: user.email,
    subject: "Login to Your Account",
    text: `Hello ${user.name || "User"},\n\nWe received a request to log in to your account. Click the link below to log in:\n\n${config.BASE_URL}/magiclink/${token}\n\nIf you didn't request this login, you can safely ignore this email.\n\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333333;">Login to Your Account</h2>
        <p style="font-size: 16px; color: #555555;">Hello ${
          user.name || "User"
        },</p>
        <p style="font-size: 16px; color: #555555;">We received a request to log in to your account. Click the button below to log in:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.BASE_URL}/magiclink/${token}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 18px;">
            Login to Your Account
          </a>
        </div>
        <p style="font-size: 14px; color: #999999;">If you didn't request this login, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999999; text-align: center;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await sendMail(mail);
  } catch (err) {
    return { status: false, message: "Error sending mail", user: null };
  }

  return { status: true, message: "Mail sent", user };
};

const validateToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { email: string };
    const user = await db.findUserByEmail(decoded.email);
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export { login, validateToken };
