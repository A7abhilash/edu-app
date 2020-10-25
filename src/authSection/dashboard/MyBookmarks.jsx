import React, { useState, useEffect } from "react";
import { getLoggedInUserInfo, removeBookmark } from "../../hooks/useUserDB";
import ArticleModal from "../articles/ArticleModal";
import Loader from "../containers/Loader";
import QuestionModal from "../questions/QuestionModal";

function MyBookmarks({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState({});
  const [modalQID, setModalQID] = useState("");
  const [modalAID, setModalAID] = useState("");

  async function fetchBookmarks() {
    let user = await getLoggedInUserInfo(LOGGEDINUSER.UID);
    setBookmarks(user.bookmarks);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    try {
      fetchBookmarks();
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

  //open the modal to read an article
  const openArticleModal = (AID) => {
    setModalAID(AID);
  };
  //close the modal
  const closeArticleModal = () => {
    setModalAID("");
  };

  const removeFromBookmark = async (BID, type) => {
    if (window.confirm("Are you sure to delete this bookmark?")) {
      let bookmark = { type, BID };
      let response = await removeBookmark(bookmark, LOGGEDINUSER.UID);
      alert(response.message);
      fetchBookmarks();
    }
  };

  return (
    <React.Fragment>
      <h2>My Bookmarks</h2>
      {loading ? (
        <Loader height={30} />
      ) : (
        <div className="pt-2">
          <h5>Answers</h5>
          {bookmarks.answers.length ? (
            bookmarks.answers.map((element) => (
              <div
                key={element.BID}
                className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
              >
                <div className="d-block mb-2 mb-md-0">
                  <p className="lead">{element.question}</p>
                  <p className="border-left border-warning text-white pl-2">
                    {element.answer}
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    className="btn btn-sm btn-outline-success"
                    data-target="#modal-question-read"
                    data-toggle="modal"
                    onClick={() => openQuestionModal(element.QID)}
                  >
                    Read Answers<i className="fas fa-book-open ml-1"></i>
                  </button>{" "}
                  <br />
                  <button
                    className="btn btn-warning btn-sm my-1"
                    onClick={() => removeFromBookmark(element.BID, "answers")}
                  >
                    <i className="far fa-bookmark mr-2"></i>Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No bookmarks yet...</p>
          )}
          <h5>Articles</h5>
          {bookmarks.articles.length ? (
            bookmarks.articles.map((element) => (
              <div
                key={element.BID}
                className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
              >
                <div className="mb-2 mb-md-0">
                  <p className="lead">{element.title}</p>
                </div>
                <div className="ml-auto">
                  <button
                    className="btn btn-sm btn-outline-success"
                    data-target="#modal-article-read"
                    data-toggle="modal"
                    onClick={() => openArticleModal(element.AID)}
                  >
                    Read Article<i className="fas fa-book-open ml-1"></i>
                  </button>{" "}
                  <br />
                  <button
                    className="btn btn-warning btn-sm my-1"
                    onClick={() => removeFromBookmark(element.BID, "articles")}
                  >
                    <i className="far fa-bookmark mr-2"></i>Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No bookmarks yet...</p>
          )}
        </div>
      )}

      {/* Modal for reading question and answers */}
      <QuestionModal
        QID={modalQID}
        closeModal={closeQuestionModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
      {/* Modal for reading an article */}
      <ArticleModal
        AID={modalAID}
        closeModal={closeArticleModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
    </React.Fragment>
  );
}

export default MyBookmarks;
