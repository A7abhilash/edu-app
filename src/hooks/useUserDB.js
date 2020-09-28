const firebase = require("firebase");

//save the new users
export async function saveUser(newUser) {
  //   console.log(newUser);
  try {
    const user = await firebase
      .firestore()
      .collection("users")
      .where("UID", "==", newUser.uid)
      .get();
    if (!user.docs.length) {
      let { displayName, uid, photoURL, email } = newUser;
      await firebase.firestore().collection("users").doc(uid).set({
        UID: uid,
        displayName,
        email,
        profileImage: photoURL,
        category: "",
        about: "",
      });
    }
  } catch (error) {
    console.error(error);
  }
  // console.log("New user saved!");
}

//For login purpose
export async function getLoggedInUserInfo(userID) {
  try {
    let docs = await firebase.firestore().collection("users").doc(userID).get();
    //   console.log(docs.data());
    return docs.data();
  } catch (error) {
    console.error(error);
  }
}

//Save user profile settings.
export async function saveUserProfileSettings(userId, userDetails) {
  // console.log(userDetails);
  try {
    await firebase.firestore().collection("users").doc(userId).update({
      category: userDetails.category,
      about: userDetails.about,
    });
    return {
      type: "success",
      message: "Profile settings updated!",
    };
  } catch (error) {
    console.error(error);
    return { type: "fail", message: error.message };
  }
}

//Get info of other user's profile  //PENDING...
export async function renderUserProfile(userId) {
  console.log(userId);
}
