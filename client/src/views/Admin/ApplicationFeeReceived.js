import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const ApplicationFeeReceived = () => {
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const studentInfo = JSON.parse(localStorage.getItem("StudentInfo"));
    const userId = studentInfo ? studentInfo.user_id : null;

    if (userId) {
      fetch(`${BASE_URL}feeapplicationreceived/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          // Handle the API response data here
          console.log(data);
          setResponseData(data);
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch.
          console.error(error);
        });
    }
  }, []); // The empty dependency array [] ensures this effect runs once after initial render.

  return (
    <div>
      <h1>ApplicationFeeReceived</h1>
      <pre>{JSON.stringify(responseData, null, 2)}</pre>
    </div>
  );
};

export default ApplicationFeeReceived;
