const firebase = require("firebase");

//desc    POST an article
export async function postArticle(article) {
  try {
    const { serverTimestamp } = firebase.firestore.FieldValue;
    article.createdAt = serverTimestamp();
    let data = await firebase.firestore().collection("articles").add(article);

    if (data.id) {
      return {
        type: "success",
        message: "Your article has been posted successfully!",
      };
    }
  } catch (error) {
    console.error(error);
    return { type: "fail", message: error.message };
  }
}

//desc    GET all the articles to render on public route    //PENDING...
export async function getPublicArticles() {
  try {
    let articles = [];
    let data = await firebase.firestore().collection("articles").get();
    data.docs.map((doc) => {
      let article = doc.data();
      article["QID"] = doc.id;
      articles.push(article);
    });
    return articles;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

//desc    GET an article with unique id    //PENDING...
export async function getSelectedArticle(id) {
  try {
    // id = "jaksdhji";
    let details = await firebase
      .firestore()
      .collection("articles")
      .doc(id)
      .get();
    return details.data();
  } catch (error) {
    console.error(error);
  }
}

//desc    DELETE an article
export async function deleteArticle(AID) {
  try {
    await firebase.firestore().collection("articles").doc(AID).delete();
    return {
      type: "success",
      message: "Article has been deleted!",
    };
  } catch (error) {
    console.error(error);
    return {
      type: "fail",
      message: error.message,
    };
  }
}
