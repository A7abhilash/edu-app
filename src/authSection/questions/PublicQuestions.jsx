import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPublicQuestions } from "../../hooks/useQuestionDB";

function PublicQuestions() {
  const [allQuestions, setAllQuestions] = useState({});

  const fetchQuestions = async () => {
    const getQuestions = await getPublicQuestions();
    setAllQuestions(getQuestions);
  };

  useEffect(() => {
    try {
      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-8 mx-1 mx-md-auto mt-2">
          <h2 className="mb-2">Public QnA</h2>
          {allQuestions.length &&
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
                  <button className="btn btn-sm btn-outline-success">
                    Read Answers<i className="fas fa-book-open ml-1"></i>
                  </button>
                </div>
                <div className="text-muted ml-auto my-auto">
                  <p style={{ fontSize: "0.8rem" }}>
                    Posted on:{" "}
                    {element.createdAt &&
                      new Date(element.createdAt.toMillis()).toDateString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PublicQuestions;
