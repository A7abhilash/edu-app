import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicQuestions } from "../../hooks/useQuestionDB";
import Loader from "../containers/Loader";
import QuestionModal from "./QuestionModal";

function PublicQuestions({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState({});
  const [modalQID, setModalQID] = useState("");

  const fetchQuestions = async () => {
    const questions = await getPublicQuestions();
    setAllQuestions(questions);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchQuestions();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, []);

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
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8 mx-1 mx-md-auto mt-2">
            <h2 className="mb-2">Public QnA</h2>
            {loading ? (
              <Loader height={50} />
            ) : (
              allQuestions.length &&
              allQuestions.map((element) => (
                <div
                  key={element.QID}
                  className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
                >
                  <div className="d-block mb-2 mb-md-0">
                    <p className="lead mb-0">{element.question}</p>
                    <h6 className="text-muted">
                      Category: {element.category} | Subject: {element.subject}
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-success"
                      data-target="#modal-question-read"
                      data-toggle="modal"
                      onClick={() => openQuestionModal(element.QID)}
                    >
                      Read Answers<i className="fas fa-book-open ml-1"></i>
                    </button>
                  </div>
                  <div className="text-muted ml-auto my-auto">
                    <p style={{ fontSize: "0.8rem" }}>
                      <Link to={`users/${element.userId}`}>
                        <i className="fas fa-user"></i> {element.postedBy}{" "}
                      </Link>
                      <br />
                      <i className="far fa-clock"></i>{" "}
                      {element.createdAt &&
                        new Date(element.createdAt.toMillis()).toDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
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

export default PublicQuestions;
