import React from "react";

function Loader({ height }) {
  const styleLoader = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: `${height}vh`,
  };
  return (
    <div style={styleLoader}>
      <div className="spinner-border text-warning" role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  );
}

export default Loader;
