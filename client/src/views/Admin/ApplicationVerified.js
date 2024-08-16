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
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";

const ApplicationVerified = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [originalApplicants, setOriginalApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
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

  const getFeeVerifiedApplicants = (programId) => {
    fetch(`${BASE_URL}getverifiedapplicants/${programId}`)
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
  const getApplicationVerifiedExcel = () => {
    fetch(`${BASE_URL}getapplicationverified/${selectedProgram}`)
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
  const getApplicationVerifiedMeritList = () => {
    fetch(`${BASE_URL}getapplicationverifiedmeritlist/${selectedProgram}`)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "meritList.xlsx"; // You can specify the file name here
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      });
  };
  // const handleDownloadAdmitLetters = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}admit-letters/${selectedProgram}`,
  //       {
  //         responseType: "blob",
  //       }
  //     );

  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `Voucher.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleProgramChange = (event) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    if (programId) {
      getFeeVerifiedApplicants(programId);
    }
  };
  const handleSendAdmitLetters = (row) => {
    setLoading(true); // Set loading state to true while the request is in progress
    const { studentId } = row.studentId; // Extract studentId from the row object
    console.log(row.studentId);
    console.log();

    // Make the API call
    axios
      .post(`${BASE_URL}sendadmitletter`, {
        studentId: row.studentId,
        programId: selectedProgram,
      })
      .then((response) => {
        console.log("Admit letter sent successfully:", response);
        // Refresh the page after admit letter is sent successfully
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending admit letter:", error);
        // Handle error, you can update UI or show an error message
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false when the request is completed
      });
  };

  const handleNameClick = (row) => {
    console.log(row);
    const studentId = row.studentId;
    const programId = selectedProgram;

    window.open(`/StudentInformation/${studentId}/${programId}`, "_blank");
  };

  useEffect(() => {
    // Initialize the original applicants list when the component mounts
    setOriginalApplicants(applicants);
  }, [applicants]);
  console.log(selectedProgram);
  return (
    <div>
      <div className="centered-container">
        <Row>
          <Button
            title="Save Excel"
            outline
            color="info"
            onClick={getApplicationVerifiedExcel}
            style={{ marginRight: "10px" }} // Add this style for spacing
          >
            Excel<br></br>
            <Download></Download>
          </Button>
          <Button
            title="Save Merit List"
            outline
            color="success"
            onClick={getApplicationVerifiedMeritList}
            style={{ marginRight: "10px" }} // Add this style for spacing
          >
            Merit List<br></br>
            <Download></Download>
          </Button>
          {/* {selectedProgram === "8" && (
            <Button
              title="Download Admit Letters"
              outline
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={handleDownloadAdmitLetters}
              disabled={loading}
            >
              {loading ? "Downloading..." : "Admit Letters"}
              <br />
              <Download />
            </Button>
          )} */}
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
        title="Fee Verified Applicants"
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
            cell: (row) => (
              <div>
                <Button
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    fontSize: "14px",
                  }}
                  color="info"
                  onClick={() => handleNameClick(row)}
                >
                  {row.name}
                </Button>
              </div>
            ),
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
            name: "Action",
            cell: (row) => {
              // Check if programId is 8 and admit_card_status is not 1
              if (
                (selectedProgram === "8" || selectedProgram === "20") &&
                row.admit_card_status !== "1"
              ) {
                return (
                  <Button
                    outline
                    color="primary"
                    onClick={() => handleSendAdmitLetters(row)}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Admit Letter"}
                  </Button>
                );
              } else if (row.admit_card_status === "1") {
                return (
                  <Button outline color="danger" disabled>
                    Already Sent
                  </Button>
                );
              } else {
                return null; // Or any other desired content when programId is not 8
              }
            },
          },
        ]}
        data={filteredApplicants.map((applicant, index) => {
          // Check if the middle name is equal to "null"
          const middleName =
            applicant.student_information.middle_name === "null"
              ? "" // Replace 'MiddleNameModified' with your desired value
              : applicant.student_information.middle_name;

          // Handle null values for other fields
          const intermediatePercentage =
            applicant.intermediate_percentage !== null
              ? `${applicant.intermediate_percentage}%`
              : "";
          const testPercentage =
            applicant.test_score_percentage !== null
              ? `${applicant.test_score_percentage}%`
              : "";

          return {
            sr: index + 1,
            name: `${applicant.student_information.first_name} ${middleName} ${applicant.student_information.last_name}`,
            father_name: applicant.student_information.father_name || "", // Handle null for father_name
            contact_no: applicant.student_information.phone_number || "", // Handle null for phone_number
            intermediate_percentage: intermediatePercentage,
            test_percentage: testPercentage,
            date: `${applicant.date || ""}`,
            voucherId: `${applicant.voucherId || ""}`,
            admit_card_status: `${applicant.student_information.admit_card_status}`,
            cnic: `${applicant.cnic.cnic || ""}`,
            studentId: `${applicant.student_information.student_id || ""}`,
            programId: `${applicant.student_information.student_id || ""}`,
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

export default ApplicationVerified;
