import { BASE_URL } from "../../config";
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
  Table, // Import Table from reactstrap
  // ... other imports
} from "reactstrap";
import axios from "axios";

const ApplicationFeeReceived = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [voucherAttachment, setVoucherAttachment] = useState(null);
  useEffect(() => {
    const studentInfo = JSON.parse(localStorage.getItem("StudentInfo"));
    const userId = studentInfo ? studentInfo.user_id : null;

    if (userId) {
      fetch(`${BASE_URL}feeapplicationreceived/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setResponseData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  const handlePaidReceiptClick = (fileName) => {
    // Make an API call with the fileName
    axios
      .get(`${BASE_URL}download-receipt/${fileName}`, { responseType: "blob" }) // Specify the response type as 'blob' to receive binary data
      .then((response) => {
        // Create a Blob object from the response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a URL for the Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Open the Blob URL in a new tab
        window.open(blobUrl);

        // Release the Blob URL when it's no longer needed
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getFeePaidApplicants = (programId) => {
    fetch(`${BASE_URL}getfeepaidapplicants/${programId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicantsData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    if (programId) {
      getFeePaidApplicants(programId);
    }
  };

  console.log(selectedProgram);

  return (
    <div>
      <FormGroup>
        <Label for="programDropdown">Select a Program:</Label>
        <Input
          type="select"
          id="programDropdown"
          value={selectedProgram}
          onChange={handleProgramChange}
        >
          <option value="">Select a program</option>
          {responseData &&
            responseData.programs.map((program) => (
              <option key={program.program_id} value={program.program_id}>
                {program.program_name}
              </option>
            ))}
        </Input>
      </FormGroup>

      <Table>
        <thead>
          <tr>
            <th>Sr#</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Contact No</th>
            <th>Intermediate %</th>
            <th>Test %</th>
            <th>Paid Receipt</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${applicant.student_information.first_name} ${applicant.student_information.last_name}`}</td>
              <td>{applicant.student_information.father_name}</td>
              <td>{applicant.student_information.phone_number}</td>
              <td>{applicant.intermediate_percentage.percentage_criteria}%</td>
              <td>{applicant.test_score_percentage.percentage}%</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => handlePaidReceiptClick(applicant.file_name)}
                >
                  {applicant.file_name}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApplicationFeeReceived;
