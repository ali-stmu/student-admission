import { BASE_URL } from "../../config";
import React, { useRef, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../Style/feereceived.css";
import {
  Mail,
  Home,
  Package,
  cros,
  Check,
  XCircle,
  CheckCircle,
  Save,
  Download,
} from "react-feather";

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

const ApplicationRejected = () => {
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
  const getApplicationRejectedExcel = () => {
    fetch(`${BASE_URL}getapplicationrejected/${selectedProgram}`)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "feereceivedapplicants.xlsx"; // You can specify the file name here
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      });
  };

  const getFeeRejectedApplicants = (programId) => {
    fetch(`${BASE_URL}getrejectedapplicants/${programId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicantsData);
        setFilteredApplicants(data.applicantsData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleRemarksCell = (remarks) => {
    return (
      <div
        style={{
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
        }}
      >
        {remarks}
      </div>
    );
  };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    if (programId) {
      getFeeRejectedApplicants(programId);
    }
  };
  useEffect(() => {
    // Initialize the original applicants list when the component mounts
    setOriginalApplicants(applicants);
  }, [applicants]);
  console.log(selectedProgram);
  console.log(selectedProgram);
  return (
    <div>
      <div className="centered-container">
        <Row>
          <Button
            title="Save Excel"
            outline
            color="info"
            onClick={getApplicationRejectedExcel}
            style={{ marginRight: "10px" }} // Add this style for spacing
          >
            Excel<br></br>
            <Download></Download>
          </Button>
          {/* <Button outline color="secondary" onClick={getFeePaidApplicantPdf}>
            PDF<br></br>
            <Download></Download>
          </Button> */}
        </Row>
      </div>
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
        title="Rejected Applicants"
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
            name: "CNIC",
            selector: "cnic",
            sortable: true,
          },
          {
            name: "Contact No",
            selector: "contact_no",
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
          {
            name: "Date",
            selector: "date",
            sortable: true,
          },
          {
            name: "Voucher ID",
            selector: "voucherId",
            sortable: true,
          },
          {
            name: "Remarks",
            selector: "remarks",
            sortable: true,
            cell: (row) => handleRemarksCell(row.remarks),
          },
        ]}
        data={filteredApplicants.map((applicant, index) => {
          // Check if the middle name is equal to "abc"
          const middleName =
            applicant.student_information.middle_name === "null"
              ? ""
              : applicant.student_information.middle_name;

          return {
            sr: index + 1,
            name: `${applicant.student_information.first_name} ${middleName} ${applicant.student_information.last_name}`,
            father_name: applicant.student_information.father_name,
            contact_no: applicant.student_information.phone_number,
            intermediate_percentage: `${applicant.intermediate_percentage.percentage_criteria}%`,
            test_percentage: `${applicant.test_score_percentage.percentage}%`,
            remarks: `${applicant.remarks}`,
            date: `${applicant.date}`,
            voucherId: `${applicant.voucherId}`,
            cnic: `${applicant.cnic.cnic}`,
          };
        })}
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
                        item.voucherId.includes(searchText) ||
                        item.cnic.cnic.includes(searchText)
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

export default ApplicationRejected;
