import { getPublicQuestions, getSelectedQuestion } from "./useQuestionDB";

const firebase = require("firebase");

//desc      POST an answer to specific question
export async function postAnswer(QID, postedAnswer) {
  try {
    let question = await getSelectedQuestion(QID);

    if (question) {
      question.answers = [...question.answers, postedAnswer];
      // console.log(question);
      await firebase.firestore().collection("questions").doc(QID).update({
        answers: question.answers,
      });
      return {
        type: "success",
        message: "Your answer has been posted successfully!",
      };
    }
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc    DELETE an answer of specific question
export async function deleteAnswer(id, QID) {
  try {
    let question = await getSelectedQuestion(QID);

    if (question) {
      question.answers = question.answers.filter((answer) => answer.id !== id);
      // console.log(question);
      await firebase.firestore().collection("questions").doc(QID).update({
        answers: question.answers,
      });
      return {
        type: "success",
        message: "Your answer has been deleted successfully!",
      };
    }
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc      EDIT an answer of specific answer
export async function editAnswer(id, QID, newAnswer) {
  try {
    let question = await getSelectedQuestion(QID);

    if (question) {
      question.answers.forEach((answer) => {
        if (answer.id === id) {
          answer.content = newAnswer;
        }
      });
      // console.log(question);
      await firebase.firestore().collection("questions").doc(QID).update({
        answers: question.answers,
      });
      return {
        type: "success",
        message: "Your answer has been edited successfully!",
      };
    }
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}

//desc    GET all the answers of user when visited
export async function getAnswersOfUser(userId) {
  try {
    let answers = [];
    let questions = await getPublicQuestions();

    questions.forEach((question) => {
      question.answers.forEach((element) => {
        if (element.userId === userId) {
          let answer = {
            question: question.question,
            QID: question.QID,
            postedBy: question.postedBy,
            userId: question.userId,
            category: question.category,
            subject: question.subject,
            answer: element.content,
            id: element.id,
            createdAt: question.createdAt,
          };
          answers = [...answers, answer];
        }
      });
    });

    return answers;
  } catch (error) {
    
    return { type: "fail", message: error.message };
  }
}
