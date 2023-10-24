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

const ApplicationFeeRejected = () => {
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

  const getFeeRejectedApplicants = (programId) => {
    fetch(`${BASE_URL}getfeerejectedapplicants/${programId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicantsData);
        setFilteredApplicants(data.applicantsData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log(filteredApplicants);
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
  const handleReceiptCell = (fileName) => {
    const downloadReceipt = () => {
      axios
        .get(`${BASE_URL}download-receipt/${fileName}`, {
          responseType: "blob",
        }) // Specify the response type as 'blob' to receive binary data
        .then((response) => {
          // Determine the content type from the response headers
          const contentType = response.headers["content-type"];

          // Create a Blob object from the response data
          const blob = new Blob([response.data], { type: contentType });

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

    return (
      <div>
        <Button outline color="info" onClick={downloadReceipt}>
          Download Receipt
        </Button>
      </div>
    );
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

      <DataTable
        title="Fee Rejected Applicants"
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
            name: "Paid Receipt",
            selector: "file_name", // Adjust the data selector as needed
            sortable: true,
            cell: (row) => handleReceiptCell(row.file_name),
          },
          {
            name: "Remarks",
            selector: "remarks",
            sortable: true,
            cell: (row) => handleRemarksCell(row.remarks),
          },
        ]}
        data={filteredApplicants.map((applicant, index) => ({
          sr: index + 1,
          name: `${applicant.student_information?.first_name ?? ""} ${
            applicant.student_information?.last_name ?? ""
          }`,
          father_name: applicant.student_information?.father_name ?? "",
          contact_no: applicant.student_information?.phone_number ?? "",
          intermediate_percentage: `${
            applicant.intermediate_percentage?.percentage_criteria ?? ""
          }%`,
          test_percentage: `${
            applicant.test_score_percentage?.percentage ?? ""
          }%`,
          remarks: `${applicant.remarks ?? ""}`,
          date: `${applicant.date ?? ""}`,
          voucherId: `${applicant.voucherId ?? ""}`,
          cnic: `${applicant.cnic?.cnic ?? ""}`,
          file_name: `${applicant.file_name ?? ""}`,
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

export default ApplicationFeeRejected;
