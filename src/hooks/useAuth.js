import { saveUser } from "./useUserDB";

const firebase = require("firebase");

export function userSignIn() {
  //Providing Google Strategy
  const provider = new firebase.auth.GoogleAuthProvider();

  //Popups a 'sign in with google' window
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((credentials) => {
      saveUser(credentials.user);
    })
    .catch((error) => {
      // console.log(error);
      setTimeout(() => {
        alert(error.message);
      }, 1000);
    });
}

export async function userSignOut() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.log(error);
    setTimeout(() => {
      alert(error.message);
    }, 1000);
  }
}
