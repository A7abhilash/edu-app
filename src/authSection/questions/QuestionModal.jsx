import React, { useEffect, useState, useRef } from "react";
import { deleteAnswer, editAnswer, postAnswer } from "../../hooks/useAnswerDB";
import { getSelectedQuestion } from "../../hooks/useQuestionDB";
import { addBookmark, reportUser } from "../../hooks/useUserDB";
import Loader from "../containers/Loader";

function QuestionModal({ QID, closeModal, LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const fetchQuestion = async () => {
    if (QID) {
      let data = await getSelectedQuestion(QID);
      setQuestion(data);
      setAnswers(data.answers);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchQuestion();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, [QID]);

  const question_answer_ref = useRef();

  //Post an answer
  const handleAnswerPost = async (event) => {
    event.preventDefault();

    let answer = {
      id: new Date().getTime().toString(),
      content: question_answer_ref.current.value,
      answeredBy: LOGGEDINUSER.displayName,
      userId: LOGGEDINUSER.UID,
    };
    let response = await postAnswer(QID, answer);
    alert(response.message);
    setAnswers((prev) => [...prev, answer]);
    question_answer_ref.current.value = "";
  };

  //config edit
  const handleEdit = (id, content) => {
    question_answer_ref.current.value = content;
    setIsEdit(true);
    setEditId(id);
  };
  //edit an answer
  const handleEditAnswer = async (event) => {
    event.preventDefault();

    let response = await editAnswer(
      editId,
      QID,
      question_answer_ref.current.value
    );
    alert(response.message);

    let newAnswers = answers.map((answer) => {
      if (answer.id === editId) {
        answer.content = question_answer_ref.current.value;
      }
      return answer;
    });

    setAnswers(newAnswers);
    setIsEdit(false);
    setEditId("");
    question_answer_ref.current.value = "";
  };

  //delete and answer
  const handleDeleteAnswer = async (id, userId) => {
    if (userId === LOGGEDINUSER.UID) {
      if (window.confirm("Are you sure to delete this answer?")) {
        let response = await deleteAnswer(id, QID);
        alert(response.message);

        let newAnswers = answers.filter((answer) => answer.id !== id);
        setAnswers(newAnswers);
      }
    } else {
      alert("Not Permitted!");
    }
  };

  //add to bookmark
  const addToBookmark = async (id) => {
    let bookmark = {
      type: "answers",
      QID,
      id,
    };
    let response = await addBookmark(bookmark, LOGGEDINUSER.UID);
    alert(response.message);
  };

  //report
  const report = async (type, reportingContent) => {
    if (reportingContent) {
      let comment = window.prompt(`Why do you want to report this ${type}?`);
      // console.log(comment);
      if (comment) {
        let content = {
          title: reportingContent.question || reportingContent.content,
          userId: reportingContent.userId,
        };
        let response = await reportUser(type, content, comment);
        alert(response.message);
      }
    }
  };

  return question && answers ? (
    <div
      className="modal fade"
      id="modal-question-read"
      tabIndex="-1"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered  modal-dialog-scrollable">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header align-items-center">
            <h4 className="modal-title text-warning" id="staticBackdropLabel">
              Question
            </h4>
            <button
              type="button"
              className="close text-white"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-left">
            {loading ? (
              <Loader height={30} />
            ) : (
              <div className="container-fluid">
                <div className="row align-items-start">
                  <div className="col-md-8 mx-auto my-2">
                    <h4>{question.question}</h4>
                    <div className="text-muted">
                      <h6>
                        Category: {question.category} | Subject:{" "}
                        {question.subject}
                      </h6>
                      <p style={{ fontSize: "0.8rem" }}>
                        <i className="fas fa-user"></i> {question.postedBy}
                        <br />
                        <i className="far fa-clock"></i>{" "}
                        {question.createdAt &&
                          new Date(
                            question.createdAt.toMillis()
                          ).toDateString()}
                      </p>
                      {question.userId !== LOGGEDINUSER.UID && (
                        <button
                          className="btn btn-sm text-primary"
                          onClick={() => report("question", question)}
                        >
                          Report
                        </button>
                      )}
                    </div>
                    <div className="border-top border-light py-1">
                      <p className="lead text-warning">
                        <strong>Answers:</strong>
                      </p>
                      {answers.length ? (
                        answers.map((element) => (
                          <div
                            key={element.id}
                            className="border-left border-secondary my-2 pl-3"
                          >
                            <h6>{element.content}</h6>
                            <p
                              className="text-muted"
                              style={{ fontSize: "0.8em" }}
                            >
                              <i className="fas fa-user"></i>{" "}
                              {element.answeredBy}
                            </p>
                            {element.userId === LOGGEDINUSER.UID && (
                              <div className="pt-0">
                                <button
                                  className="btn btn-sm border-0 text-info"
                                  onClick={() =>
                                    handleEdit(element.id, element.content)
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm border-0 text-danger"
                                  onClick={() =>
                                    handleDeleteAnswer(
                                      element.id,
                                      element.userId
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                            {element.userId !== LOGGEDINUSER.UID && (
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => addToBookmark(element.id)}
                                >
                                  <i className="far fa-bookmark mr-2"></i>
                                  Bookmark
                                </button>{" "}
                                <br />
                                <button
                                  className="btn btn-sm text-primary"
                                  onClick={() => report("answer", element)}
                                >
                                  Report
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">
                          No answers found for this question...
                        </p>
                      )}
                    </div>
                  </div>
                  {question.userId !== LOGGEDINUSER.UID && (
                    <div className="col-md-4 mx-auto my-2 border-left border-warning">
                      <h6>Post an Answer</h6>
                      <form
                        onSubmit={!isEdit ? handleAnswerPost : handleEditAnswer}
                      >
                        <textarea
                          rows="10"
                          className="form-control"
                          placeholder="Your Answer..."
                          ref={question_answer_ref}
                        ></textarea>
                        <button className="float-right btn btn-success my-2">
                          {isEdit ? "EDIT your Answer" : "POST your Answer"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="ml-auto mr-2 mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No question found!</p>
  );
}

export default QuestionModal;
