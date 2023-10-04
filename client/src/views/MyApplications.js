import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  CustomInput,
  FormFeedback,
  Table,
} from "reactstrap";
import { BASE_URL } from "../config";

const MyApplications = () => {
  const [userID, setUserId] = useState("");
  const [voucherDetails, setVoucherDetails] = useState(null);
  let serialNumber = 1;

  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    console.log(studentInfo.user_id);
    setUserId(studentInfo.user_id);

    // Create a URL with user_id as a query parameter
    const apiUrl = `${BASE_URL}voucherdetail?user_id=${studentInfo.user_id}`;

    // Make an API call to get voucher details
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setVoucherDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching voucher details:", error);
      });
  }, []);

  return (
    <div>
      <h3>My Submitted Applications</h3>
      {voucherDetails && (
        <div>
          <h4 className="mb0">Program Details</h4>
          <Table>
            <thead>
              <tr>
                <th>Sr.#</th>
                <th>Program Name</th>
                <th>Application Status</th>
              </tr>
            </thead>
            <tbody>
              {voucherDetails.program_names.map((program) => (
                <tr key={program.program_id}>
                  <td>{serialNumber++}</td>
                  <td>{program.program_name}</td>
                  <td>{program.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
