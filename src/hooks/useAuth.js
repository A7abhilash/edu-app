import { saveUser } from "./useUserDB";

const firebase = require("firebase");

//SIGN IN
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
      setTimeout(() => {
        alert(error.message);
      }, 1000);
    });
}

//SIGN OUT
export async function userSignOut() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    setTimeout(() => {
      alert(error.message);
    }, 1000);
  }
}
