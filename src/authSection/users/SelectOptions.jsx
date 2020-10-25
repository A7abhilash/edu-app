import React from "react";

function SelectOptions({ handleSelectOption, selectedOption }) {
  const options = [
    {
      id: "questions",
      title: "Questions",
    },
    {
      id: "answers",
      title: "Answers",
    },
    {
      id: "articles",
      title: "Articles",
    },
  ];
  //   , padding: "8px 0 4px 7px"
  return (
    <div className="py-3 pl-3 text-muted d-flex justify-content-between">
      {options.map((option) =>
        option.id === selectedOption ? (
          <div
            key={option.id}
            style={{ cursor: "pointer" }}
            className="bg-dark text-white rounded border-bottom border-warning py-2 px-4"
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
