import React, { useEffect, useRef, useState } from "react";
import {
  deleteArticle,
  editArticle,
  getSelectedArticle,
  postArticle,
} from "../../hooks/useArticlesDB";
import ArticleModal from "../articles/ArticleModal";
import Loader from "../containers/Loader";

const firebase = require("firebase");

function MyArticles({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState("");
  const [modalAID, setModalAID] = useState("");

  //get realtime updates on articles when posted
  useEffect(() => {
    setLoading(true);
    try {
      firebase
        .firestore()
        .collection("articles")
        .where("userId", "==", LOGGEDINUSER.UID)
        .onSnapshot((snapshot) => {
          let articles = [];
          snapshot.docs.forEach((doc) => {
            let article = doc.data();
            article["AID"] = doc.id;
            articles.push(article);
          });
          setAllArticles(articles);
          setLoading(false);
        });
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, []);

  const article_category_ref = useRef();
  const article_subject_ref = useRef();
  const article_title_ref = useRef();
  const article_body_ref = useRef();

  //post an article
  const handlePost = () => {
    article_category_ref.current.value = "";
    article_subject_ref.current.value = "";
    article_title_ref.current.value = "";
    article_body_ref.current.value = "";
  };
  const handleArticlePost = async (event) => {
    event.preventDefault();

    let article = {
      title: article_title_ref.current.value,
      body: article_body_ref.current.value,
      category: article_category_ref.current.value,
      subject: article_subject_ref.current.value,
      userId: LOGGEDINUSER.UID,
      postedBy: LOGGEDINUSER.displayName,
      createdAt: "",
    };

    let response = await postArticle(article);
    alert(response.message);

    article_category_ref.current.value = "";
    article_subject_ref.current.value = "";
    article_title_ref.current.value = "";
    article_body_ref.current.value = "";
  };

  //delete an article
  const handleQuestionDelete = async (AID, userId) => {
    if (userId === LOGGEDINUSER.UID) {
      if (window.confirm("Are you sure to delete this article?")) {
        let response = await deleteArticle(AID);
        alert(response.message);
      }
    } else {
      alert("Not Permitted!");
    }
  };

  //Edit a question
  const handleEdit = async (AID, userId) => {
    if (userId === LOGGEDINUSER.UID) {
      setIsEdit(true);
      let response = await getSelectedArticle(AID);

      if (!response) {
        setIsEdit(false);
        return alert("Question not found!");
      }
      setEditID(AID);
      article_title_ref.current.value = response.title;
      article_body_ref.current.value = response.body;
      article_category_ref.current.value = response.category;
      article_subject_ref.current.value = response.subject;
    } else {
      alert("Not Permitted!");
    }
  };
  const handleArticleEdit = async (event) => {
    event.preventDefault();
    let response = await getSelectedArticle(editID);

    if (!response) {
      return "";
    }

    response.title = article_title_ref.current.value;
    response.body = article_body_ref.current.value;
    response.category = article_category_ref.current.value;
    response.subject = article_subject_ref.current.value;
    let data = await editArticle(editID, response);
    alert(data.message);
  };

  //open the modal to read an article
  const openArticleModal = (AID) => {
    setModalAID(AID);
  };
  //close the modal
  const closeArticleModal = () => {
    setModalAID("");
  };

  return (
    <React.Fragment>
      <div className="d-block d-md-flex align-items-start">
        <h2>My Articles</h2>
        <button
          onClick={handlePost}
          className="btn btn-info btn-sm ml-auto mt-1"
          data-toggle="modal"
          data-target="#modal-article"
        >
          <i className="fas fa-pen"></i> Post an Article
        </button>
      </div>
      {loading ? (
        <Loader height={30} />
      ) : allArticles.length ? (
        allArticles.map((element) => (
          <div
            key={element.AID}
            className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
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
              <button
                // onClick={() => handleEdit(element.AID, element.userId)}
                className="ml-2 btn border-0 text-info"
                data-toggle="modal"
                data-target="#modal-article"
                onClick={() => handleEdit(element.AID, element.userId)}
              >
                Edit
              </button>
              <button
                onClick={() =>
                  handleQuestionDelete(element.AID, element.userId)
                }
                className="ml-2 btn border-0 text-danger"
              >
                Delete
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
        <p className="text-muted">You haven't posted any articles...</p>
      )}

      {/* Modal for posting an article */}
      <div
        className="modal fade"
        id="modal-article"
        tabIndex="-1"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header align-items-center">
              <h4 className="modal-title text-warning" id="staticBackdropLabel">
                {!isEdit ? "Post an Article" : "Edit your Article"}
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
              <form onSubmit={!isEdit ? handleArticlePost : handleArticleEdit}>
                <div className="form-group">
                  <label htmlFor="settings-category">Enter the Category:</label>
                  <input
                    type="text"
                    id="article-category"
                    ref={article_category_ref}
                    className="form-control"
                    placeholder="NEET, JEE, UPSC..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="article-about">Enter the Subject:</label>
                  <input
                    type="text"
                    id="article-about"
                    ref={article_subject_ref}
                    className="form-control"
                    placeholder="Physics, Chemistry, history, Computer Science..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="settings-category">Enter the Title:</label>
                  <input
                    type="text"
                    id="settings-category"
                    ref={article_title_ref}
                    className="form-control"
                    placeholder="What's your topic?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-category">
                    Body of your Article:
                  </label>
                  <textarea
                    type="text"
                    id="settings-category"
                    ref={article_body_ref}
                    className="form-control"
                    placeholder="Body of your Article"
                    rows="7"
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
                    <strong>{!isEdit ? "POST" : "EDIT"}</strong>
                  </button>
                </div>
              </form>
            </div>
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

export default MyArticles;
