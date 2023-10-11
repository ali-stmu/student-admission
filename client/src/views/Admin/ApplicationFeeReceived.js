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

  const handleRejectApplicationClick = (studentId, programId) => {
    setLoading(true);

    const requestData = {
      studentId: studentId,
      programId: programId,
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
        `${row.student_information.first_name} ${row.student_information.last_name}`,
      sortable: true,
    },
    {
      name: "Father Name",
      selector: "student_information.father_name",
      sortable: true,
    },
    {
      name: "Contact No",
      selector: "student_information.phone_number",
      sortable: true,
    },
    {
      name: "Intermediate %",
      selector: "intermediate_percentage.percentage_criteria",
      sortable: true,
    },
    {
      name: "Test %",
      selector: "test_score_percentage.percentage",
      sortable: true,
    },
    {
      name: "Paid Receipt",
      cell: (row) => (
        <Button
          color="primary"
          onClick={() => handlePaidReceiptClick(row.file_name)}
        >
          Download Voucher
        </Button>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            color="success"
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
        title="Fee Paid Applicants"
        className="react-dataTable"
        columns={columns}
        data={applicants}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
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
          <div className="success-message">{successMessage}</div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ApplicationFeeReceived;
