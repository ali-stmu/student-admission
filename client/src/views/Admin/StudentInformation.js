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

const StudentInformation = (props) => {
  const { match } = props;
  const { studentId } = match.params;
  const { programId } = match.params;

  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    const apiUrl = `${BASE_URL}getStudentDetail/${studentId}/${programId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setStudentDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
      });
  }, [studentId]);
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
                </tr>
              </thead>
              <tbody>
                {studentDetails.educationData.map((educationRecord, index) => (
                  <tr key={index}>
                    <td>{educationRecord.degree_name}</td>
                    <td>{educationRecord.passing_year}</td>
                    <td>{educationRecord.total_marks}</td>
                    <td>{educationRecord.obtained_marks}</td>
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
                </tr>
              </thead>
              <tbody>
                {studentDetails.testScoresData.map((testRecord, index) => (
                  <tr key={index}>
                    <td>{testRecord.test_name}</td>
                    <td>{testRecord.test_type}</td>
                    <td>{testRecord.test_date}</td>
                    <td>{testRecord.test_score_total}</td>
                    <td>{testRecord.test_score}</td>
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
        </>
      )}
    </div>
  );
};

export default StudentInformation;
