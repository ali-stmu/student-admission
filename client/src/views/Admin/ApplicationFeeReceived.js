import { BASE_URL } from "../../config";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  Input, // Import Input from reactstrap
  Label,
  Row,
  Col,
  CustomInput,
  FormFeedback,
  Table,
} from "reactstrap";

const ApplicationFeeReceived = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");

  const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
  };

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
  console.log(responseData);

  return (
    <div>
      <FormGroup>
        <Label for="programDropdown">Select a Program:</Label>
        {/* Use Input with type="select" for the select input */}
        <Input
          type="select"
          id="programDropdown"
          value={selectedProgram}
          onChange={handleProgramChange}
        >
          <option value="">Select a program</option>
          {responseData &&
            responseData.programs.map((program) => (
              <option key={program.program_id} value={program.program_name}>
                {program.program_name}
              </option>
            ))}
        </Input>
      </FormGroup>
    </div>
  );
};

export default ApplicationFeeReceived;
