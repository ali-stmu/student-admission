import { BASE_URL } from "../../config";
import React, { useRef, useState, useEffect } from "react";
import DataTable from "react-data-table-component";

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

const ApplicationFeePending = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [originalApplicants, setOriginalApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
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

  const getFeeUnPaidApplicants = (programId) => {
    fetch(`${BASE_URL}getfeependingapplicants/${programId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicantsData);
        setFilteredApplicants(data.applicantsData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    if (programId) {
      getFeeUnPaidApplicants(programId);
    }
  };

  console.log(selectedProgram);
  useEffect(() => {
    // Initialize the original applicants list when the component mounts
    setOriginalApplicants(applicants);
  }, [applicants]);
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

      <DataTable
        title="Fee Pending Applicants"
        columns={[
          {
            name: "Sr#",
            selector: "sr",
            sortable: true,
          },
          {
            name: "Name",
            selector: "name",
            sortable: true,
          },
          {
            name: "Father Name",
            selector: "father_name",
            sortable: true,
          },
          {
            name: "Contact No",
            selector: "contact_no",
            sortable: true,
          },
          {
            name: "CNIC",
            selector: "cnic",
            sortable: true,
          },
          {
            name: "Intermediate %",
            selector: "intermediate_percentage",
            sortable: true,
          },
          {
            name: "Test %",
            selector: "test_percentage",
            sortable: true,
          },
        ]}
        data={filteredApplicants.map((applicant, index) => ({
          sr: index + 1,
          name: `${applicant.student_information.first_name} ${applicant.student_information.last_name}`,
          father_name: applicant.student_information.father_name,
          contact_no: applicant.student_information.phone_number,
          intermediate_percentage: `${applicant.intermediate_percentage.percentage_criteria}%`,
          test_percentage: `${applicant.test_score_percentage.percentage}%`,
          cnic: `${applicant.cnic.cnic}`,
        }))}
        pagination
        responsive
        subHeader
        subHeaderComponent={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                const searchText = e.target.value.toLowerCase();

                // Check if search input is empty
                if (searchText === "12345") {
                  console.log("if chal gya");
                  console.log(searchText);
                  // Display all original applicants when the search box is empty
                  setApplicants(originalApplicants);
                } else {
                  console.log("else chal gya");
                  console.log(searchText);

                  // Filter the applicants based on the search input
                  setFilteredApplicants(
                    originalApplicants.filter(
                      (item) =>
                        item.student_information.first_name
                          .toLowerCase()
                          .includes(searchText) ||
                        item.student_information.last_name
                          .toLowerCase()
                          .includes(searchText) ||
                        item.student_information.father_name
                          .toLowerCase()
                          .includes(searchText) ||
                        item.student_information.phone_number.includes(
                          searchText
                        ) ||
                        item.cnic.includes(searchText)
                    )
                  );
                }
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default ApplicationFeePending;
