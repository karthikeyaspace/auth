import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as db from "./db";
import config from "../config";

export interface UserTypes {
  id: string;
  email: string;
  name: string;
  hashpassword: string;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
}

const login = async (email: string, password: string) => {
  const user: UserTypes | undefined = db.findUserByEmail(email).user;
  if (!user) return { status: false, message: "User not found" };

  let status = await bcrypt.compare(password, user.hashpassword);
  if (!status) return { status: false, message: "Password incorrect" };

  const token = jwt.sign({ email: user.email }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { status: true, message: "User logged in", user, token };
};

const register = async (email: string, password: string, name: string) => {
  const user = db.findUserByEmail(email).user;
  if (user) return { status: false, message: "User already exists" };

  const hashpassword = await bcrypt.hash(password, 10);
  const newUser: UserTypes = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    hashpassword,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    emailVerified: false,
  };

  db.createUser(newUser);

  const token = jwt.sign({ email: newUser.email }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { status: true, message: "User registered", user: newUser, token };
};

const verify = async (email: string) => {
  const user = db.verifyUser(email).user;
  if (!user) return { status: false, message: "User not found" };

  return { status: true, message: "User verified", user };
};

const update = async (id: string, email: string, name: string) => {
  const user = db.findUserByEmail(email).user;
  if (!user) return { status: false, message: "User not found" };

  const newUser: UserTypes = {
    id,
    email,
    name,
    hashpassword: user.hashpassword,
    createdAt: user.createdAt,
    lastLogin: new Date().toISOString(),
    emailVerified: user.emailVerified,
  };

  db.updateUser(id, newUser);

  return { status: true, message: "User updated", user: newUser };
};

const removeUser = async (id: string) => {
  const user = db.findUserByEmail(id).user;
  if (!user) return { status: false, message: "User not found" };

  db.deleteUser(id);

  return { status: true, message: "User deleted" };
};

export { login, register, verify, update, removeUser };
