import { MongoClient, ObjectId } from "mongodb";
import { UserTypes } from "./index";

const uri = "mongodb://localhost:27017";
if (!uri) throw new Error("MongoDB connection string is missing");
const client = new MongoClient(uri);
const connect = async (): Promise<void> => {
  try {
    await client.connect();
    console.log("Connected to the MongoDB database");
  } catch (error) {
    console.error("Error connecting to the MongoDB database:", error);
    process.exit(1);
  }
};

// to roll mongodb using docker
// docker run -d --name mongodb -p 27017:27017 mongo:latest
// and then uncomment this

connect();


const mdb = client.db("users");
const usersCollection = mdb.collection<UserTypes>("users");

const findUserByEmail = async (email: string) => {
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
};

const getAllUsers = async () => {
  try {
    const users = await usersCollection.find().toArray();
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

const createUser = async (user: UserTypes) => {
  try {
    await usersCollection.insertOne(user);
    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

const updateUser = async (id: string, user: UserTypes) => {
  try {
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: user },
      { returnDocument: "after" }
    );

    if (!result) return false;

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

const deleteUser = async (id: string) => {
  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

const verifyUser = async (email: string) => {
  try {
    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true } },
      { returnDocument: "after" }
    );

    if (!result) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
};

export {
  connect,
  findUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  verifyUser,
};
