import React from "react";
import { useState } from "react";
import MyProfile from "./dashboard/MyProfile";
import MyQuestions from "./dashboard/MyQuestions";
import MyAnswers from "./dashboard/MyAnswers";
import MyArticles from "./dashboard/MyArticles";
import MyBookmarks from "./dashboard/MyBookmarks";
import UserProfile from "./containers/UserProfile";
import ReportSection from "./dashboard/ReportSection";
import SelectOptions from "./dashboard/SelectOptions";

function Dashboard({ LOGGEDINUSER }) {
  const [selectedOption, setSelectedOption] = useState("profile");

  const handleSelectOption = (option) => {
    // console.log(option);
    setSelectedOption(option);
  };

  const selectOptions = () => {
    switch (selectedOption) {
      case "profile":
        return <MyProfile LOGGEDINUSER={LOGGEDINUSER} />;
      case "questions":
        return <MyQuestions LOGGEDINUSER={LOGGEDINUSER} />;
      case "answers":
        return <MyAnswers LOGGEDINUSER={LOGGEDINUSER} />;
      case "articles":
        return <MyArticles LOGGEDINUSER={LOGGEDINUSER} />;
      case "bookmarks":
        return <MyBookmarks LOGGEDINUSER={LOGGEDINUSER} />;
      case "reports":
        return <ReportSection LOGGEDINUSER={LOGGEDINUSER} />;
      default:
        return <MyProfile LOGGEDINUSER={LOGGEDINUSER} />;
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 my-3 border-secondary border-right">
            <h3 className="text-secondary mb-3">Dashboard</h3>
            <UserProfile user={LOGGEDINUSER} />
            <SelectOptions
              handleSelectOption={handleSelectOption}
              selectedOption={selectedOption}
            />
          </div>
          <div className="col-md-8 my-3 mx-auto m-1">{selectOptions()}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
