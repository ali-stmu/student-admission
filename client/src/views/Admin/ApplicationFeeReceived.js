import React, { useRef, useState, useEffect } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BASE_URL } from "../../config";
import {
  Mail,
  Home,
  Package,
  cros,
  Check,
  XCircle,
  CheckCircle,
} from "react-feather";
//import { css } from "react-emotion";
import { ClipLoader } from "react-spinners";
import "../Style/feereceived.css";

const ApplicationFeeReceived = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handlePaidReceiptClick = (fileName) => {
    // Make an API call with the fileName
    axios
      .get(`${BASE_URL}download-receipt/${fileName}`, { responseType: "blob" }) // Specify the response type as 'blob' to receive binary data
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

  const getFeePaidApplicants = (programId) => {
    fetch(`${BASE_URL}getfeepaidapplicants/${programId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicantsData);
        setFilteredApplicants(data.applicantsData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleVerifyApplicationClick = (studentId, programId) => {
    // Set loading to true to show the loading spinner
    setLoading(true);

    const requestData = {
      studentId: studentId,
      programId: programId,
    };

    axios
      .post(`${BASE_URL}verify-application`, requestData)
      .then((response) => {
        // Set the success message in the state
        setSuccessMessage(response.data.message);
        setLoading(false);
        // Clear any previous error message
        setErrorMessage(null);
        // You can perform further actions here based on the response
        console.log("Verification API Response:", response.data);
        // Clear the success message and loading state after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
          setLoading(false);
        }, 5000);
      })
      .catch((error) => {
        // Set the error message in the state
        setErrorMessage("An error occurred while verifying the application.");
        // Clear any previous success message
        setSuccessMessage(null);
        console.error("Error:", error);
        // Clear the error message and loading state after 5 seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };
  const handleNameClick = (row) => {
    console.log(row.program_id);

    const studentId = row.student_information.student_id;
    const programId = row.program_id;

    window.open(`/StudentInformation/${studentId}/${programId}`, "_blank");
  };

  const handleRejectApplicationClick = (studentId, programId) => {
    const rejectRemarks = window.prompt("Enter remarks:");

    if (rejectRemarks !== null) {
      // Only proceed if the user entered remarks (not canceled)
      setLoading(true);

      const requestData = {
        studentId: studentId,
        programId: programId,
        rejectRemarks: rejectRemarks,
      };

      axios
        .post(`${BASE_URL}reject-application`, requestData)
        .then((response) => {
          // Set the success message in the state
          setSuccessMessage(response.data.message);
          setLoading(false);
          // Clear any previous error message
          setErrorMessage(null);
          // You can perform further actions here based on the response
          console.log("Rejection API Response:", response.data);
          // Clear the success message and loading state after 5 seconds
          setTimeout(() => {
            setSuccessMessage(null);
            setLoading(false);
          }, 5000);
        })
        .catch((error) => {
          // Set the error message in the state
          setErrorMessage("An error occurred while rejecting the application.");
          // Clear any previous success message
          setSuccessMessage(null);
          console.error("Error:", error);
          // Clear the error message and loading state after 5 seconds
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  console.log(applicants);
  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    if (programId) {
      getFeePaidApplicants(programId);
    }
  };

  console.log(selectedProgram);

  // Define columns for the DataTable
  const columns = [
    {
      name: "Sr#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) =>
        `${row.student_information.first_name ?? ""} ${
          row.student_information.last_name ?? ""
        }`,
      sortable: true,
      cell: (row) => (
        <div>
          <Button
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              fontSize: "14px",
            }}
            color="info"
            outline
            onClick={() => handleNameClick(row)}
          >
            {row.student_information.first_name ?? ""}{" "}
            {row.student_information.last_name ?? ""}
          </Button>
        </div>
      ),
    },
    {
      name: "Father Name",
      selector: "student_information.father_name",
      sortable: true,
      cell: (row) => <div>{row.student_information.father_name ?? ""}</div>,
    },
    {
      name: "CNIC",
      selector: "cnic.cnic",
      sortable: true,
      cell: (row) => <div>{row.cnic.cnic ?? ""}</div>,
    },
    {
      name: "Contact No",
      selector: "student_information.phone_number",
      sortable: true,
      cell: (row) => <div>{row.student_information.phone_number ?? ""}</div>,
    },
    {
      name: "Intermediate %",
      selector: "intermediate_percentage.percentage_criteria",
      sortable: true,
      cell: (row) => (
        <div>{row.intermediate_percentage.percentage_criteria ?? ""}</div>
      ),
    },
    {
      name: "Test %",
      selector: "test_score_percentage.percentage",
      sortable: true,
      cell: (row) => <div>{row.test_score_percentage?.percentage ?? ""}</div>,
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
      cell: (row) => <div>{row.voucherId ?? ""}</div>,
    },
    {
      name: "Paid Receipt",
      cell: (row) => (
        <Button
          color="primary"
          outline
          onClick={() => handlePaidReceiptClick(row.file_name)}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            fontSize: "14px",
          }}
        >
          Download
        </Button>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            color="success"
            outline
            onClick={() =>
              handleVerifyApplicationClick(
                row.student_information.student_id,
                selectedProgram
              )
            }
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              fontSize: "14px",
            }}
            title="Accept Application"
            disabled={loading === true}
          >
            <CheckCircle />
          </Button>
          <Button
            color="danger"
            outline
            onClick={() =>
              handleRejectApplicationClick(
                row.student_information.student_id,
                selectedProgram
              )
            }
            style={{ padding: "5px 10px", fontSize: "14px" }}
            title="Reject Application"
            disabled={loading === true}
          >
            <XCircle />
          </Button>
        </>
      ),
    },
  ];
  useEffect(() => {
    // Initialize the original applicants list when the component mounts
    setOriginalApplicants(applicants);
  }, [applicants]);
  useEffect(() => {
    // Initialize the original applicants list when the component mounts
    getFeePaidApplicants(selectedProgram);
  }, [successMessage, errorMessage]);
  console.log(applicants);
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
      <div className="centered-container">
        {/* Your existing code here */}

        {/* Display the loading spinner when loading is true */}
        {loading && (
          <div className="loading-spinner">
            <ClipLoader
              //css={override}
              size={150} // Customize the size as needed
              color={"#123abc"} // Customize the color
              loading={loading}
            />
          </div>
        )}

        {successMessage && (
          <b>
            <h4 className="success-message">{successMessage}</h4>
          </b>
        )}

        {errorMessage && <h5 className="error-message">{errorMessage}</h5>}
      </div>
      <DataTable
        title="Fee Paid Applicants"
        className="react-dataTable"
        columns={columns}
        data={filteredApplicants}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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

export default ApplicationFeeReceived;
