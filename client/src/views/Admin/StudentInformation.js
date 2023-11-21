import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import {
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  Input,
  CustomInput,
  Table,
} from "reactstrap";
import axios from "axios";
import { XCircle, CheckCircle, Edit3, Save } from "react-feather";
import { ClipLoader } from "react-spinners";
import "../Style/feereceived.css";
import "../Style/StudentInformation.css";
const StudentInformation = (props) => {
  const { match } = props;
  const { studentId } = match.params;
  const { programId } = match.params;

  const [studentDetails, setStudentDetails] = useState(null);
  const [feeStatus, setFeeStatus] = useState(null);
  const [applicationStatus, setAppliationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTest, setIsEditingTest] = useState(false);

  const [editedMarks, setEditedMarks] = useState({
    totalMarks: 0,
    obtainedMarks: 0,
    passingYear: 0,
  });
  const [editedMarksTest, setEditedMarksTest] = useState({
    totalMarks: 0,
    obtainedMarks: 0,
  });
  const toggleEdit = (index) => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    const Tempemail = studentInfo.email;
    if (isEditing === index) {
      const degreeId = studentDetails.educationData[index].degree_id;
      const StudentId = studentDetails.studentData.student_id;

      console.log(editedMarks);
      console.log(StudentId);
      console.log(degreeId);

      // Save the changes here
      // For example, you can send a request to update the data
      // using the editedMarks state and degreeId

      const requestData = {
        userEmail: Tempemail,
        studentId: StudentId,
        degreeId: degreeId,
        totalMarks: editedMarks.totalMarks,
        obtainedMarks: editedMarks.obtainedMarks,
        passingYear: editedMarks.passingYear,
      };

      axios
        .post(`${BASE_URL}updateEducationData`, requestData)
        .then((response) => {
          // Handle the response as needed
          console.log("Update Education Data API Response:", response.data);
          setRefreshFlag(true);
        })
        .catch((error) => {
          console.error("Error updating education data:", error);
        });
      setRefreshFlag(false);

      // After saving, reset the state
      setIsEditing(false);
      setEditedMarks({ totalMarks: 0, obtainedMarks: 0, passingYear: 0 });
    } else {
      // Enter edit mode
      setIsEditing(index);
      setEditedMarks({
        totalMarks: studentDetails.educationData[index].total_marks,
        obtainedMarks: studentDetails.educationData[index].obtained_marks,
        passingYear: studentDetails.educationData[index].passing_year,
      });
    }
  };

  const toggleEditTest = (index) => {
    if (isEditingTest === index) {
      const rolesFromStorage = localStorage.getItem("StudentInfo");
      const studentInfo = JSON.parse(rolesFromStorage);
      const Tempemail = studentInfo.email;
      const testScoreId = studentDetails.testScoresData[index].test_score_id;
      const StudentId = studentDetails.studentData.student_id;
      console.log(testScoreId);
      console.log(StudentId);
      console.log(editedMarksTest);

      // Save the changes here
      // For example, you can send a request to update the data
      // using the editedMarks state and degreeId

      const requestData = {
        userEmail: Tempemail,
        studentId: StudentId,
        testScoreId: testScoreId,
        totalMarks: editedMarksTest.totalMarks,
        obtainedMarks: editedMarksTest.obtainedMarks,
      };

      axios
        .post(`${BASE_URL}updateTestData`, requestData)
        .then((response) => {
          // Handle the response as needed
          console.log("Update Test Data API Response:", response.data);
          setRefreshFlag(true);
        })
        .catch((error) => {
          console.error("Error updating Test data:", error);
        });
      setRefreshFlag(false);

      // After saving, reset the state
      setIsEditingTest(false);
      setEditedMarksTest({ totalMarks: 0, obtainedMarks: 0 });
    } else {
      // Enter edit mode
      setIsEditingTest(index);
      setEditedMarksTest({
        totalMarks: studentDetails.testScoresData[index].test_score_total,
        obtainedMarks: studentDetails.testScoresData[index].test_score,
      });
    }
  };

  useEffect(() => {
    const apiUrl = `${BASE_URL}getStudentDetail/${studentId}/${programId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setStudentDetails(data);
        setFeeStatus(data.voucher.status);
        setAppliationStatus(data.voucher.application_status);
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
      });
  }, [studentId, successMessage, errorMessage, refreshFlag === true]);
  console.log(studentDetails);
  const handleImageClick = (image) => {
    console.log("Image clicked:", image);
    const parts = image.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    axios
      .get(`${BASE_URL}download-studentImage/${filenameWithExtension}`, {
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

  const handleCnicImageClick = (cnicImage) => {
    console.log("CNIC image clicked:", cnicImage);
    const parts = cnicImage.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    axios
      .get(`${BASE_URL}download-studentImageCnic/${filenameWithExtension}`, {
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
  const handleDegreeClick = (documentPath) => {
    console.log("Document clicked:", documentPath);
    const parts = documentPath.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    axios
      .get(`${BASE_URL}download-studentDegree/${filenameWithExtension}`, {
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
  const handleTestAttachmentClick = (documentPath) => {
    console.log("Document clicked:", documentPath);
    const parts = documentPath.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    axios
      .get(`${BASE_URL}download-studentTest/${filenameWithExtension}`, {
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
  const handleAcceptApplication = () => {
    setLoading(true);

    console.log(studentId);
    console.log(programId);
    const requestData = {
      studentId: studentId,
      programId: programId,
    };

    axios
      .post(`${BASE_URL}accept-application`, requestData)
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

  const handleRejectApplication = () => {
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
        .post(`${BASE_URL}rejectt-application`, requestData)
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

  return (
    <div>
      {studentDetails && (
        <>
          <div>
            <h2>Student Personal Details</h2>
            <Table>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>
                    {studentDetails.studentData.first_name}{" "}
                    {studentDetails.studentData.last_name}
                  </td>
                </tr>
                <tr>
                  <td>Contact Number:</td>
                  <td>{studentDetails.studentData.phone_number}</td>
                </tr>
                <tr>
                  <td>Student CNIC/Passport Image</td>
                  <td>
                    <Button
                      outline
                      color="info"
                      onClick={() =>
                        handleCnicImageClick(
                          studentDetails.studentData.cnic_image
                        )
                      }
                    >
                      {studentDetails.studentData.cnic}
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{studentDetails.email.email}</td>
                </tr>
                <tr>
                  <td>Date of Birth:</td>
                  <td>{studentDetails.studentData.date_of_birth}</td>
                </tr>
                <tr>
                  <td>Mother Name:</td>
                  <td>{studentDetails.studentData.mother_name}</td>
                </tr>
                <tr>
                  <td>Father/Guardian Name:</td>
                  <td>{studentDetails.studentData.father_name}</td>
                </tr>
                <tr>
                  <td>Father/Guardian Contact:</td>
                  <td>{studentDetails.studentData.father_contact}</td>
                </tr>
                <tr>
                  <td>Father/Guardian Occupation:</td>
                  <td>{studentDetails.studentData.father_occupation}</td>
                </tr>
                <tr>
                  <td>Student Image</td>
                  <td>
                    <Button
                      outline
                      color="info"
                      onClick={() =>
                        handleImageClick(studentDetails.studentData.image)
                      }
                    >
                      View/Download
                    </Button>
                  </td>
                </tr>

                {/* Add more fields as needed */}
              </tbody>
            </Table>
          </div>
          <div>
            <Row>
              <Col>
                <h2>Permanent Address</h2>
                <Table>
                  <tbody>
                    <tr>
                      <td>Street Address:</td>
                      <td>{studentDetails.studentData.address}</td>
                    </tr>
                    <tr>
                      <td>City:</td>
                      <td>{studentDetails.studentData.city}</td>
                    </tr>
                    <tr>
                      <td>State:</td>
                      <td>{studentDetails.studentData.state}</td>
                    </tr>
                    <tr>
                      <td>Country:</td>
                      <td>{studentDetails.studentData.country}</td>
                    </tr>
                    <tr>
                      <td>Zip Code:</td>
                      <td>{studentDetails.studentData.zip_code}</td>
                    </tr>

                    {/* Add more fields as needed */}
                  </tbody>
                </Table>
              </Col>
              <Col>
                <h2>Temporary Address</h2>
                <Table>
                  <tbody>
                    <tr>
                      <td>Street Address:</td>
                      <td>{studentDetails.studentData.t_address}</td>
                    </tr>
                    <tr>
                      <td>City:</td>
                      <td>{studentDetails.studentData.t_city}</td>
                    </tr>
                    <tr>
                      <td>State:</td>
                      <td>{studentDetails.studentData.t_state}</td>
                    </tr>
                    <tr>
                      <td>Country:</td>
                      <td>{studentDetails.studentData.t_country}</td>
                    </tr>
                    <tr>
                      <td>Zip Code:</td>
                      <td>{studentDetails.studentData.t_zip_code}</td>
                    </tr>

                    {/* Add more fields as needed */}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>

          <div>
            <h2>Education</h2>
            <Table>
              <thead>
                <tr>
                  <th>Degree Title</th>
                  <th>Passing Year</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Board</th>
                  <th>School Name</th>
                  <th>School Country</th>
                  <th>School City</th>
                  <th>Degree</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.educationData.map((educationRecord, index) => (
                  <tr key={index}>
                    <td>{educationRecord.degree_name}</td>
                    <td>
                      {isEditing === index ? (
                        <Input
                          type="text"
                          value={editedMarks.passingYear}
                          onChange={(e) =>
                            setEditedMarks({
                              ...editedMarks,
                              passingYear: e.target.value,
                            })
                          }
                        />
                      ) : (
                        educationRecord.passing_year
                      )}
                    </td>
                    <td>
                      {isEditing === index ? (
                        <Input
                          type="text"
                          value={editedMarks.totalMarks}
                          onChange={(e) =>
                            setEditedMarks({
                              ...editedMarks,
                              totalMarks: e.target.value,
                            })
                          }
                        />
                      ) : (
                        educationRecord.total_marks
                      )}
                    </td>
                    <td>
                      {isEditing === index ? (
                        <Input
                          type="text"
                          value={editedMarks.obtainedMarks}
                          onChange={(e) =>
                            setEditedMarks({
                              ...editedMarks,
                              obtainedMarks: e.target.value,
                            })
                          }
                        />
                      ) : (
                        educationRecord.obtained_marks
                      )}
                    </td>

                    <td>{educationRecord.percentage_criteria}%</td>
                    <td>{educationRecord.institution_name}</td>
                    <td>{educationRecord.school_name}</td>
                    <td>{educationRecord.school_country}</td>
                    <td>{educationRecord.school_city}</td>
                    <td>
                      <Button
                        outline
                        color="info"
                        onClick={() =>
                          handleDegreeClick(educationRecord.document_path)
                        }
                      >
                        View/Download
                      </Button>
                    </td>
                    <td>
                      {isEditing === index ? (
                        <Button
                          title="Save"
                          outline
                          color="success"
                          onClick={() => toggleEdit(index)}
                        >
                          <Save></Save>
                        </Button>
                      ) : (
                        <Button
                          title="Edit"
                          outline
                          color="primary"
                          onClick={() => toggleEdit(index)}
                        >
                          <Edit3></Edit3>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <h2>Test Information</h2>
            <Table>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Test Type</th>
                  <th>Test Date</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Test City</th>
                  <th>Test Reg/Roll#</th>
                  <th>Test Attachment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.testScoresData.map((testRecord, index) => (
                  <tr key={index}>
                    <td>{testRecord.test_name}</td>
                    <td>{testRecord.test_type}</td>
                    <td>{testRecord.test_date}</td>
                    <td>
                      {isEditingTest === index ? (
                        <Input
                          type="text"
                          value={editedMarksTest.totalMarks}
                          onChange={(e) =>
                            setEditedMarksTest({
                              ...editedMarksTest,
                              totalMarks: e.target.value,
                            })
                          }
                        />
                      ) : (
                        testRecord.test_score_total
                      )}
                    </td>
                    <td>
                      {isEditingTest === index ? (
                        <Input
                          type="text"
                          value={editedMarksTest.obtainedMarks}
                          onChange={(e) =>
                            setEditedMarksTest({
                              ...editedMarksTest,
                              obtainedMarks: e.target.value,
                            })
                          }
                        />
                      ) : (
                        testRecord.test_score
                      )}
                    </td>
                    <td>{testRecord.percentage}%</td>
                    <td>{testRecord.test_city}</td>
                    <td>{testRecord.test_reg_no}</td>
                    <td>
                      <Button
                        outline
                        color="info"
                        onClick={() =>
                          handleTestAttachmentClick(testRecord.attachment_url)
                        }
                      >
                        View/Download
                      </Button>
                    </td>
                    <td>
                      {isEditingTest === index ? (
                        <Button
                          title="Save"
                          outline
                          color="success"
                          onClick={() => toggleEditTest(index)}
                        >
                          <Save></Save>
                        </Button>
                      ) : (
                        <Button
                          title="Edit"
                          outline
                          color="primary"
                          onClick={() => toggleEditTest(index)}
                        >
                          <Edit3></Edit3>
                        </Button>
                      )}
                    </td>

                    {/* Add more fields related to education here */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <h2>Voucher Details</h2>
            <Table>
              <tbody>
                <tr>
                  <td>Bank Name:</td>
                  <td>{studentDetails.voucher.bank_name} </td>
                </tr>
                <tr>
                  <td>Branch Code:</td>
                  <td>{studentDetails.voucher.branch_code}</td>
                </tr>
                <tr>
                  <td>Transaction ID</td>
                  <td>{studentDetails.voucher.transaction_id}</td>
                </tr>
                <tr>
                  <td>Mode of Payment</td>
                  <td>{studentDetails.voucher.mode_of_payment}</td>
                </tr>

                {/* Add more fields as needed */}
              </tbody>
            </Table>
          </div>
          {feeStatus === "Verified" && applicationStatus === "Pending" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleAcceptApplication}
                title="Accept Application"
                outline
                color="success"
              >
                <CheckCircle></CheckCircle>
              </Button>
              <div style={{ margin: "0 10px" }}></div> {/* Add space here */}
              <Button
                onClick={handleRejectApplication}
                title="Reject Application"
                outline
                color="danger"
              >
                <XCircle></XCircle>
              </Button>
            </div>
          )}
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
        </>
      )}
    </div>
  );
};

export default StudentInformation;
