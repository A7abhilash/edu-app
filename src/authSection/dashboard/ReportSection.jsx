import React, { useState } from "react";
import { useEffect } from "react";
import Loader from "../containers/Loader";

const firebase = require("firebase");
function ReportSection({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    let data = await firebase
      .firestore()
      .collection("reports")
      .where("reportedUID", "==", LOGGEDINUSER.UID)
      .get();
    let report = data.docs.map((eachDoc) => eachDoc.data());
    setReports(report);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchReports();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }, []);

  return (
    <React.Fragment>
      <h2>Reports</h2>
      <p className="text-muted">
        This section displays what other users has reported about you and it
        can't be deleted. Make sure you don't do any spam post and don't go
        against our policies.
      </p>
      <h3 className="text-warning">
        Your Reports <i className="fas fa-exclamation-triangle"></i>
      </h3>
      {loading ? (
        <Loader height={30} />
      ) : reports.length ? (
        reports.map((element, index) => (
          <div key={index} className="my-2 bg-dark rounded p-2">
            <h6 className="text-primary">
              You were reported by one of our app's user for the following{" "}
              {element.type}.
            </h6>
            <p className="lead">{element.content.title}</p>
            <p className="border-secondary border-left p-2 text-danger">
              <u>Comment:</u> {element.comment}
            </p>
            <p className="text-muted" style={{ fontSize: "0.8rem" }}>
              <i className="far fa-clock"></i>{" "}
              {element.reportedOn &&
                new Date(element.reportedOn.toMillis()).toDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-muted">No reports so far.</p>
      )}
    </React.Fragment>
  );
}

export default ReportSection;
