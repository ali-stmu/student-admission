import React, { useRef, useState, useEffect } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BASE_URL } from "../../config";

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
      .get(`${BASE_URL}download-receipt/${fileName}`, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl);
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
        // Number of rows per page
      />
    </div>
  );
};

export default ApplicationFeeReceived;
