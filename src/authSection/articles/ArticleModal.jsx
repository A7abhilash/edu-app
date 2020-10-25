import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getSelectedArticle } from "../../hooks/useArticlesDB";
import { addBookmark, reportUser } from "../../hooks/useUserDB";
import Loader from "../containers/Loader";

function ArticleModal({ AID, closeModal, LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({});

  const fetchArticle = async () => {
    if (AID) {
      let data = await getSelectedArticle(AID);
      setArticle(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchArticle();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, [AID]);

  //add to bookmark
  const addToBookmark = async (id) => {
    let bookmark = {
      type: "articles",
      AID,
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
          title: reportingContent.title,
          userId: reportingContent.userId,
        };
        let response = await reportUser(type, content, comment);
        alert(response.message);
      }
    }
  };

  return article ? (
    <div
      className="modal fade"
      id="modal-article-read"
      tabIndex="-1"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header align-items-center">
            <h4 className="modal-title text-warning" id="staticBackdropLabel">
              Article
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
                  <div className="col-md-5 my-2">
                    <h4>{article.title}</h4>
                    <div className="text-muted">
                      <h6>
                        Category: {article.category} | Subject:{" "}
                        {article.subject}
                      </h6>
                      <p style={{ fontSize: "0.8rem" }}>
                        <i className="fas fa-user"></i> {article.postedBy}{" "}
                        <br />
                        <i className="far fa-clock"></i>{" "}
                        {article.createdAt &&
                          new Date(article.createdAt.toMillis()).toDateString()}
                      </p>
                    </div>
                    {article.userId !== LOGGEDINUSER.UID && (
                      <div>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => addToBookmark(article.AID)}
                        >
                          <i className="far fa-bookmark mr-2"></i>Bookmark
                        </button>
                        <br />
                        <button
                          className="btn btn-sm text-primary"
                          onClick={() => report("article", article)}
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mx-auto my-2 border-left border-warning">
                    <p>{article.body}</p>
                  </div>
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
    <p>No article found!</p>
  );
}

export default ArticleModal;
