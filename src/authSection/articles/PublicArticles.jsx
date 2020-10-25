import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles } from "../../hooks/useArticlesDB";
import Loader from "../containers/Loader";
import ArticleModal from "./ArticleModal";

function PublicArticles({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState({});
  const [modalAID, setModalAID] = useState("");

  const fetchArticles = async () => {
    const getArticles = await getPublicArticles();
    setAllArticles(getArticles);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchArticles();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, []);

  //open the modal to read an article
  const openArticleModal = (AID) => {
    setModalAID(AID);
  };
  //open the modal to read an article
  const closeArticleModal = () => {
    setModalAID("");
  };

  return (
    <React.Fragment>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8 mx-1 mx-md-auto mt-2">
            <h2 className="mb-2">Public Articles</h2>
            {loading ? (
              <Loader height={50} />
            ) : (
              allArticles.length &&
              allArticles.map((element) => (
                <div
                  key={element.AID}
                  className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
                >
                  <div className="d-block mb-2 mb-md-0">
                    <p className="lead mb-0">{element.title}</p>
                    <h6 className="text-muted">
                      Category: {element.category} | Subject: {element.subject}
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-success"
                      data-toggle="modal"
                      data-target="#modal-article-read"
                      onClick={() => openArticleModal(element.AID)}
                    >
                      Read Article<i className="fas fa-book-open ml-1"></i>
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

      {/* Modal for reading an article */}
      <ArticleModal
        AID={modalAID}
        closeModal={closeArticleModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
    </React.Fragment>
  );
}

export default PublicArticles;
