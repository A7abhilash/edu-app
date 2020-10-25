import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { renderUserProfile } from "../../hooks/useUserDB";
import UserProfile from "../containers/UserProfile";
import Loader from "../containers/Loader";
import SelectOptions from "./SelectOptions";
import Questions from "./Questions";
import Answers from "./Answers";
import Articles from "./Articles";

function ProfileVisit(props) {
  const [loading, setLoading] = useState(true);
  const { LOGGEDINUSER } = props;
  const [userDetails, setUserDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState("questions");

  const fetchUser = async () => {
    let data = await renderUserProfile(props.match.params.id);
    if (data.message) {
      return alert(data.message);
    }
    setUserDetails({
      profile: data.user.data(),
      questions: data.questions,
      articles: data.articles,
      answers: data.answers,
    });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      props.match.params.id !== LOGGEDINUSER.UID && fetchUser();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, []);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const selectOptions = () => {
    switch (selectedOption) {
      case "questions":
        return (
          <Questions
            questions={userDetails.questions}
            LOGGEDINUSER={LOGGEDINUSER}
          />
        );
      case "answers":
        return (
          <Answers answers={userDetails.answers} LOGGEDINUSER={LOGGEDINUSER} />
        );
      case "articles":
        return <Articles articles={userDetails.articles} />;
      default:
        return (
          <Questions
            questions={userDetails.questions}
            LOGGEDINUSER={LOGGEDINUSER}
          />
        );
    }
  };

  return props.match.params.id === LOGGEDINUSER.UID ? (
    <Redirect to="/dashboard" />
  ) : (
    <React.Fragment>
      {loading ? (
        <Loader height={30} />
      ) : (
        userDetails.profile && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 my-3 border-secondary border-right">
                <h3 className="text-secondary mb-3">Profile</h3>
                <UserProfile user={userDetails.profile} />
                {userDetails.profile.about && (
                  <p className="text-secondary mb-3">
                    - {userDetails.profile.about}
                  </p>
                )}
              </div>
              <div className="col-md-8 mx-auto my-3">
                <SelectOptions
                  handleSelectOption={handleSelectOption}
                  selectedOption={selectedOption}
                />
                {selectOptions()}
              </div>
            </div>
          </div>
        )
      )}
    </React.Fragment>
  );
}

export default ProfileVisit;
