const firebase = require("firebase");

//desc    POST a question
export async function postQuestion(question) {
  try {
    const { serverTimestamp } = firebase.firestore.FieldValue;
    question.createdAt = serverTimestamp();
    let data = await firebase.firestore().collection("questions").add(question);

    if (data.id) {
      return {
        type: "success",
        message: "Your question has been posted successfully!",
      };
    }
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc    EDIT a question
export async function editQuestion(QID, question) {
  try {
    await firebase.firestore().collection("questions").doc(QID).update({
      category: question.category,
      subject: question.subject,
      question: question.question,
    });
    return {
      type: "success",
      message: "Question has been edit!",
    };
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}

//desc    GET all the questions of user when visited
export async function getQuestionsOfUser(userId) {
  try {
    let snapshot = await firebase
      .firestore()
      .collection("questions")
      .where("userId", "==", userId)
      .get();

    let questions = [];
    snapshot.docs.forEach((doc) => {
      let question = doc.data();
      question["QID"] = doc.id;
      questions.push(question);
    });
    return questions;
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc    GET all the questions to render on public route
export async function getPublicQuestions() {
  try {
    let questions = [];
    let data = await firebase.firestore().collection("questions").get();
    data.docs.forEach((doc) => {
      let question = doc.data();
      question["QID"] = doc.id;
      questions.push(question);
    });
    return questions;
  } catch (error) {
    
    alert(error.message);
  }
}

//desc    GET a question with unique id
export async function getSelectedQuestion(id) {
  try {
    // id = "jaksdhji";
    let details = await firebase
      .firestore()
      .collection("questions")
      .doc(id)
      .get();
    return details.data();
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc    DELETE a question
export async function deleteQuestion(QID) {
  try {
    await firebase.firestore().collection("questions").doc(QID).delete();
    return {
      type: "success",
      message: "Question has been deleted!",
    };
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}
