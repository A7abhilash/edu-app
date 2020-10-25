import React, { useState } from "react";
import ArticleModal from "../articles/ArticleModal";

function Articles({ articles }) {
  const [modalAID, setModalAID] = useState("");
  function openArticleModal(AID) {
    setModalAID(AID);
  }
  //close the modal
  const closeArticleModal = () => {
    setModalAID("");
  };

  return (
    <React.Fragment>
      {articles.length ? (
        articles.map((element) => (
          <div
            key={element.AID}
            className="text-warning my-3 p-2 bg-dark rounded d-md-flex align-items-start"
          >
            <div className="d-block mb-2 mb-md-0">
              <p className="lead">{element.title}</p>
              <button
                className="btn btn-sm btn-outline-success"
                data-toggle="modal"
                data-target="#modal-article-read"
                onClick={() => openArticleModal(element.AID)}
              >
                Read Article<i className="fas fa-book-open ml-1"></i>
              </button>
            </div>
            <div className="text-muted ml-auto">
              <h6>Category: {element.category} </h6>
              <h6>Subject: {element.subject}</h6>
              <p style={{ fontSize: "0.8rem" }}>
                <i className="far fa-clock"></i>{" "}
                {element.createdAt &&
                  new Date(element.createdAt.toMillis()).toDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No articles has been posted...</p>
      )}

      {/* Modal for reading an article */}
      <ArticleModal AID={modalAID} closeModal={closeArticleModal} />
    </React.Fragment>
  );
}

export default Articles;
