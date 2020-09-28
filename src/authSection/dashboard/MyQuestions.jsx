import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import {
  deleteQuestion,
  editQuestion,
  getSelectedQuestion,
  postQuestion,
} from "../../hooks/useQuestionDB";
const firebase = require("firebase");

function MyQuestions({ LOGGEDINUSER }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editID, seteditID] = useState("");

  //Get realtime update of questions when posted
  useEffect(() => {
    try {
      firebase
        .firestore()
        .collection("questions")
        .where("userId", "==", LOGGEDINUSER.UID)
        .onSnapshot((snapshot) => {
          let questions = [];
          snapshot.docs.forEach((doc) => {
            // console.log(
            //   new Date(doc.data().createdAt.toMillis()).toDateString()
            // );
            let question = doc.data();
            question["QID"] = doc.id;
            questions.push(question);
          });
          setAllQuestions(questions);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const question_category_ref = useRef();
  const question_subject_ref = useRef();
  const question_question_ref = useRef();

  //post a question
  const handlePost = () => {
    setIsEdit(false);
    question_question_ref.current.value = "";
    question_category_ref.current.value = "";
    question_subject_ref.current.value = "";
  };
  const handleQuestionPost = async (event) => {
    event.preventDefault();
    let question = {
      question: question_question_ref.current.value,
      category: question_category_ref.current.value,
      subject: question_subject_ref.current.value,
      userId: LOGGEDINUSER.UID,
      answers: [],
      createdAt: "",
    };
    let response = await postQuestion(question);
    alert(response.message);

    question_question_ref.current.value = "";
    question_category_ref.current.value = "";
    question_subject_ref.current.value = "";
  };

  //delete a question
  const handleQuestionDelete = async (QID, userId) => {
    if (userId === LOGGEDINUSER.UID) {
      if (window.confirm("Are you sure to delete this question?")) {
        // console.log(QID);
        let response = await deleteQuestion(QID);
        alert(response.message);
      }
    } else {
      alert("Nice Try!");
    }
  };

  //Edit a question
  const handleEdit = async (QID, userId) => {
    if (userId === LOGGEDINUSER.UID) {
      setIsEdit(true);
      let response = await getSelectedQuestion(QID);

      if (!response) {
        setIsEdit(false);
        return alert("Question not found!");
      }
      seteditID(QID);
      question_question_ref.current.value = response.question;
      question_category_ref.current.value = response.category;
      question_subject_ref.current.value = response.subject;
    } else {
      alert("Nice try!");
    }
  };
  const handleQuestionEdit = async (event) => {
    event.preventDefault();
    let response = await getSelectedQuestion(editID);

    if (!response) {
      return "";
    }

    response.question = question_question_ref.current.value;
    response.category = question_category_ref.current.value;
    response.subject = question_subject_ref.current.value;
    let data = await editQuestion(editID, response);
    alert(data.message);
  };

  return (
    <React.Fragment>
      <div className="d-block d-md-flex align-items-start">
        <h2>My Questions</h2>
        <button
          onClick={handlePost}
          className="btn btn-info btn-sm ml-auto mt-1"
          data-toggle="modal"
          data-target="#modal-question"
        >
          Post a Question
        </button>
      </div>
      {allQuestions.length ? (
        allQuestions.map((element) => (
          <div
            key={element.QID}
            className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
          >
            <div className="d-block mb-2 mb-md-0">
              <p className="lead">{element.question}</p>
              <button className="btn btn-sm btn-outline-success">
                Read Answers<i className="fas fa-book-open ml-1"></i>
              </button>{" "}
              <button
                onClick={() => handleEdit(element.QID, element.userId)}
                className="ml-2 btn border-0 text-info"
                data-toggle="modal"
                data-target="#modal-question"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  handleQuestionDelete(element.QID, element.userId)
                }
                className="ml-2 btn border-0 text-danger"
              >
                Delete
              </button>
            </div>
            <div className="text-muted ml-auto">
              <h6 className="text-muted">Category: {element.category} </h6>
              <h6 className="text-muted">Subject: {element.subject}</h6>
              <p style={{ fontSize: "0.8rem" }}>
                Posted on:{" "}
                {element.createdAt &&
                  new Date(element.createdAt.toMillis()).toDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">You haven't posted any questions...</p>
      )}

      {/* Modal for editing and posting a question... */}
      <div
        className="modal fade"
        id="modal-question"
        tabIndex="-1"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header align-items-center">
              <h4 className="modal-title text-warning" id="staticBackdropLabel">
                {!isEdit ? "Post a Question" : "Edit your Question"}
              </h4>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">
              <form
                onSubmit={!isEdit ? handleQuestionPost : handleQuestionEdit}
              >
                <div className="form-group">
                  <label htmlFor="question-category">Enter the Category:</label>
                  <input
                    type="text"
                    id="question-category"
                    ref={question_category_ref}
                    className="form-control"
                    placeholder="NEET, JEE, UPSC..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-category">Enter the Subject:</label>
                  <input
                    type="text"
                    id="questions-category"
                    ref={question_subject_ref}
                    className="form-control"
                    placeholder="Physics, Chemistry, history, Computer Science..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-category">Enter the Question:</label>
                  <textarea
                    type="text"
                    id="settings-category"
                    ref={question_question_ref}
                    className="form-control"
                    placeholder="What's your doubt?"
                    rows="2"
                    required
                  ></textarea>
                </div>
                <div className="form-group pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success float-right">
                    <strong> {!isEdit ? "Post" : "Edit"}</strong>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MyQuestions;
