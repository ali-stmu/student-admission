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

const ApplicationFeeReceived = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");

  const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
  };
  console.log(selectedProgram);

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
            <th>Email</th>
            <th>Contact No</th>
            <th>Intermediate %</th>
            <th>Test %</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
};

export default ApplicationFeeReceived;
