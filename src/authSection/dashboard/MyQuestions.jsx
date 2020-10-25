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
import Loader from "../containers/Loader";
import QuestionModal from "../questions/QuestionModal";
const firebase = require("firebase");

function MyQuestions({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editID, seteditID] = useState("");
  const [modalQID, setModalQID] = useState("");

  //Get realtime update of questions when posted
  useEffect(() => {
    setLoading(true);
    try {
      firebase
        .firestore()
        .collection("questions")
        .where("userId", "==", LOGGEDINUSER.UID)
        .onSnapshot((snapshot) => {
          let questions = [];
          snapshot.docs.forEach((doc) => {
            let question = doc.data();
            question["QID"] = doc.id;
            questions.push(question);
          });
          setAllQuestions(questions);
          setLoading(false);
        });
    } catch (error) {
      alert(error.message);
      setLoading(false);
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
      postedBy: LOGGEDINUSER.displayName,
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
        let response = await deleteQuestion(QID);
        alert(response.message);
      }
    } else {
      alert("Not Permitted!");
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
      alert("Not Permitted!");
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

  //open the modal to read an article
  const openQuestionModal = (QID) => {
    setModalQID(QID);
  };
  //close the modal
  const closeQuestionModal = () => {
    setModalQID("");
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
          <i className="fas fa-question"></i> Post a Question
        </button>
      </div>
      {loading ? (
        <Loader height={30} />
      ) : allQuestions.length ? (
        allQuestions.map((element) => (
          <div
            key={element.QID}
            className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
          >
            <div className="d-block mb-2 mb-md-0">
              <p className="lead">{element.question}</p>
              <button
                className="btn btn-sm btn-outline-success"
                data-target="#modal-question-read"
                data-toggle="modal"
                onClick={() => openQuestionModal(element.QID)}
              >
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
                <i className="far fa-clock"></i>{" "}
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
                    <strong> {!isEdit ? "POST" : "EDIT"}</strong>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for reading question and answers */}
      <QuestionModal
        QID={modalQID}
        closeModal={closeQuestionModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
    </React.Fragment>
  );
}

export default MyQuestions;
