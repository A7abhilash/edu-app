import React, { useState } from "react";
import QuestionModal from "../questions/QuestionModal";

function Answers({ answers, LOGGEDINUSER }) {
  const [modalQID, setModalQID] = useState("");

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
      {answers.length ? (
        answers.map((element) => (
          <div
            key={element.QID}
            className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
          >
            <div className="d-block mb-2 mb-md-0">
              <p className="lead">{element.question}</p>
              <p className="border-left border-warning text-white pl-2">
                {element.answer}
              </p>
              <button
                className="btn btn-sm btn-outline-success"
                data-target="#modal-question-read"
                data-toggle="modal"
                onClick={() => openQuestionModal(element.QID)}
              >
                Read Answers<i className="fas fa-book-open ml-1"></i>
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
        <p className="text-muted">You haven't posted any answers...</p>
      )}
      {/* Modal for reading question and answers */}
      <QuestionModal
        QID={modalQID}
        closeModal={closeQuestionModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
    </React.Fragment>
  );
}

export default Answers;
