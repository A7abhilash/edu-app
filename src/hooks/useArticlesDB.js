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
    
    return { type: "fail", message: error.message };
  }
}

//desc    EDIT an article
export async function editArticle(AID, article) {
  try {
    await firebase.firestore().collection("articles").doc(AID).update({
      category: article.category,
      subject: article.subject,
      title: article.title,
      body: article.body,
    });
    return {
      type: "success",
      message: "Article has been edit!",
    };
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}

//desc    GET all the articles to render on public route
export async function getPublicArticles() {
  try {
    let articles = [];
    let data = await firebase.firestore().collection("articles").get();
    data.docs.map((doc) => {
      let article = doc.data();
      article["AID"] = doc.id;
      articles.push(article);
    });
    return articles;
  } catch (error) {
    
    alert(error.message);
  }
}

//desc    GET an article with unique id
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
    
    return { type: "fail", message: error.message };
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
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}

//desc    GET all the articles of user when visited
export async function getArticlesOfUser(userId) {
  try {
    let snapshot = await firebase
      .firestore()
      .collection("articles")
      .where("userId", "==", userId)
      .get();

    let articles = [];
    snapshot.docs.forEach((doc) => {
      let article = doc.data();
      article["AID"] = doc.id;
      articles.push(article);
    });
    return articles;
  } catch (error) {
    
    return {
      type: "fail",
      message: error.message,
    };
  }
}
