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
  const handleDownloadVoucher = (voucherPath) => {
    // Open the voucher attachment in a new tab/window
    window.open(`${BASE_URL}${voucherPath}`, "_blank");
  };

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
                  onClick={() =>
                    handleDownloadVoucher(applicant.voucher_full_path)
                  }
                >
                  Download Voucher
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
