import React from "react";

function SelectOptions({ handleSelectOption, selectedOption }) {
  const options = [
    {
      id: "profile",
      title: "Profile",
    },
    {
      id: "questions",
      title: "My Questions",
    },
    {
      id: "answers",
      title: "My Answers",
    },
    {
      id: "articles",
      title: "My Articles",
    },
    {
      id: "bookmarks",
      title: "My Bookmarks",
    },
  ];

  return (
    <div className="py-3 pl-3 text-muted">
      {options.map((option) =>
        option.id === selectedOption ? (
          <div
            key={option.id}
            style={{ cursor: "pointer", padding: "8px 0 4px 7px" }}
            className="bg-dark text-white rounded border-left border-warning"
          >
            <h5>{option.title}</h5>
          </div>
        ) : (
          <div
            key={option.id}
            onClick={() => handleSelectOption(option.id)}
            style={{ cursor: "pointer" }}
            className="py-1  options"
          >
            <h5>{option.title}</h5>
          </div>
        )
      )}
    </div>
  );
}

export default SelectOptions;
