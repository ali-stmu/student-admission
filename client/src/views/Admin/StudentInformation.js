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
  return (
    <div>
      <h1>Student Information</h1>
      {studentDetails && (
        <>
          <div>
            <h2>Student Details</h2>
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
                  <td>CNIC/Passport#:</td>
                  <td>{studentDetails.studentData.cnic}</td>
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
                  <th>Passing Year</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Board</th>

                  <th>Status</th>
                  <th>School Name</th>
                  <th>School Country</th>
                  <th>School City</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.educationData.map((educationRecord, index) => (
                  <tr key={index}>
                    <td>{educationRecord.passing_year}</td>
                    <td>{educationRecord.total_marks}</td>
                    <td>{educationRecord.obtained_marks}</td>
                    <td>{educationRecord.percentage_criteria}%</td>
                    <td>{educationRecord.institution_name}</td>
                    <td>{educationRecord.result_status}</td>
                    <td>{educationRecord.school_name}</td>
                    <td>{educationRecord.school_country}</td>
                    <td>{educationRecord.school_city}</td>
                    {/* Add more fields related to education here */}
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
