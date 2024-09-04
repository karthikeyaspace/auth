import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";

import { auth } from "./firebaseinit";

const provider = new GoogleAuthProvider();

// Function to sign in with email and password, turn on the email and password sign in method in the firebase console

const emailandpass = async (email: string, pass: string) => {
  try {
    const usercred = await signInWithEmailAndPassword(auth, email, pass);
    const user = usercred.user;
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

// Function to sign in with google, turn on the google sign in method in the firebase console

const google = async () => {
  try {
    const usercred = await signInWithPopup(auth, provider);
    const user = usercred.user;
    const token =
      GoogleAuthProvider.credentialFromResult(usercred)?.accessToken;
    console.log(user);
    console.log(token);
  } catch (error) {
    console.log(error);
  }
};

// Function to sign out

const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

// Function to sign in anonymously

const anonymoussignin = async () => {
  try {
    const usercred = await signInAnonymously(auth);
    const user = usercred.user;
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

export { emailandpass, google, logout, anonymoussignin };
