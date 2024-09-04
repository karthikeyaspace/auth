// This is a mock database to simulate this boilerplate code,
// in a real world scenario, you must user sql or nosql databases such as mongodb or postgresql
import { UserTypes } from "./index";

const users: UserTypes[] = [];

// db operations to simulate a real world scenario

const findUserByEmail = (email: string) => {
  const user = users.find((user) => user.email === email);
  return { status: true, message: "User found", user };
};

const createUser = (user: UserTypes) => {
  users.push(user);
  return { status: true, message: "User created successfully", user };
};

const updateUser = (id: string, user: UserTypes) => {
  const index = users.findIndex((user) => user.id === id);
  users[index] = user;
  return { status: true, message: "User updated successfully", user };
};

const deleteUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  return { status: true, message: "User deleted successfully" };
};

const verifyUser = (email: string) => {
  const user = users.find((user) => user.email === email);
  if (user) user.emailVerified = true;
  return { status: true, message: "User verified successfully", user };
};

export {
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  verifyUser,
};
