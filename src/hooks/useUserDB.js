import { getArticlesOfUser, getSelectedArticle } from "./useArticlesDB";
import { getQuestionsOfUser, getSelectedQuestion } from "./useQuestionDB";
import { getAnswersOfUser } from "./useAnswerDB";

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
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .set({
          UID: uid,
          displayName,
          email,
          profileImage: photoURL,
          category: "",
          about: "",
          bookmarks: {
            answers: [],
            articles: [],
          },
        });
      await firebase
        .firestore()
        .collection("reports")
        .doc(uid)
        .set({ report: [] });
    }
  } catch (error) {
    
  }
  // console.log("New user saved!");
}

//For login purpose
export async function getLoggedInUserInfo(userID) {
  try {
    let docs = await firebase.firestore().collection("users").doc(userID).get();
 
    return docs.data();
  } catch (error) {
    
  }
}

//Save user profile settings.
export async function saveUserProfileSettings(userId, userDetails) {
 
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
    return { type: "fail", message: error.message };
  }
}

//Get info of other user's profile
export async function renderUserProfile(userId) {
  try {
    let user = await firebase.firestore().collection("users").doc(userId).get();
    if (!user.id) {
      return { message: "User not Found" };
    }

    let questions = await getQuestionsOfUser(userId);
    let articles = await getArticlesOfUser(userId);
    let answers = await getAnswersOfUser(userId);

    return { user, questions, answers, articles };
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//add an answer/article to bookmark
export async function addBookmark(bookmark, userId) {
  try {
    const user = await getLoggedInUserInfo(userId);
    if (bookmark.type === "answers") {
      const question = await getSelectedQuestion(bookmark.QID);
      let findBookmark = user.bookmarks.answers.filter(
        (eachBookmark) => eachBookmark.BID === bookmark.id
      );
      if (findBookmark.length) {
        return {
          message:
            "Bookmark already exists. Checkout My Bookmarks in your Dashboard.",
          type: "success",
        };
      }

      question.answers.forEach((element) => {
        if (element.id === bookmark.id) {
          let newBookmark = {
            question: question.question,
            QID: bookmark.QID,
            answer: element.content,
            postedBy: question.postedBy,
            QUserId: question.userId,
            answeredBy: element.answeredBy,
            AUserId: element.userId,
            category: question.category,
            subject: question.subject,
            BID: element.id,
          };
          user.bookmarks.answers = [...user.bookmarks.answers, newBookmark];
        }
      });
    } else if (bookmark.type === "articles") {
      const article = await getSelectedArticle(bookmark.AID);

      let findBookmark = user.bookmarks.articles.filter(
        (eachBookmark) => eachBookmark.BID === bookmark.AID
      );
      if (findBookmark.length) {
        return {
          message:
            "Bookmark already exists. Checkout My Bookmarks in your Dashboard.",
          type: "success",
        };
      }

      let newBookmark = {
        title: article.title,
        AID: bookmark.AID,
        body: article.body,
        postedBy: article.postedBy,
        ArUserId: article.userId,
        category: article.category,
        subject: article.subject,
        BID: bookmark.AID,
      };
      user.bookmarks.articles = [...user.bookmarks.articles, newBookmark];
      console.log(user.bookmarks.articles);
      console.log(user.bookmarks);
    }
    await firebase.firestore().collection("users").doc(userId).update({
      bookmarks: user.bookmarks,
    });
    return {
      message:
        "Bookmark added successfully. Checkout My Bookmarks in your Dashboard.",
      type: "success",
    };
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}

//remove an answer/article to bookmark
export async function removeBookmark(bookmark, userId) {
  try {
    const user = await getLoggedInUserInfo(userId);
    if (bookmark.type === "answers") {
      user.bookmarks.answers = user.bookmarks.answers.filter(
        (eachBookmark) => eachBookmark.BID !== bookmark.BID
      );
    } else if (bookmark.type === "articles") {
      user.bookmarks.articles = user.bookmarks.articles.filter(
        (eachBookmark) => eachBookmark.BID !== bookmark.BID
      );
    }
    await firebase.firestore().collection("users").doc(userId).update({
      bookmarks: user.bookmarks,
    });
    return {
      message: "Bookmark removed successfully.",
      type: "success",
    };
  } catch (error) {
    return {
      type: "fail",
      message: error.message,
    };
  }
}

export async function reportUser(type, content, comment) {
  try {
    // await getLoggedInUserInfo(content.userId);
    const { serverTimestamp } = firebase.firestore.FieldValue;
    await firebase.firestore().collection("reports").add({
      reportedUID: content.userId,
      type,
      content,
      comment,
      reportedOn: serverTimestamp(),
    });
    return {
      message:
        "Thanks for your valuable feedback. User has been reported successfully.",
      type: "success",
    };
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}
