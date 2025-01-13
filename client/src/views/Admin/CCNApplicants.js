import React, { useEffect, useState } from "react";
import { Table, Spinner } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../../config";

const CCNApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentInfo = JSON.parse(localStorage.getItem("StudentInfo"));
    const userId = studentInfo ? studentInfo.user_id : null;

    if (
      userId === 9665 ||
      userId === 333 ||
      userId === 356 ||
      userId === 362 ||
      userId === 363 ||
      userId === 364 ||
      userId === 365 ||
      userId === 6332 ||
      userId === 10023
    ) {
      axios
        .get(`${BASE_URL}ccn-applicants`)
        .then((response) => {
          setApplicants(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the applicants!", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Spinner color="primary" />;
  }

  return (
    <div>
      <h1>CCN Applicants</h1>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Candidate Name</th>
            <th>Father's Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Mailing Address</th>
            <th>Status</th>
            <th>Professional Reg Number</th>
            <th>Highest Degree</th>
            {/* <th>CNIC Picture</th>
            <th>Candidate Picture</th>
            <th>Highest Degree Picture</th> */}
            <th>Uploaded Challan</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={applicant.id}>
              <th scope="row">{index + 1}</th>
              <td>{applicant.candidate_name || "N/A"}</td>
              <td>{applicant.father_name || "N/A"}</td>
              <td>{applicant.phone_number || "N/A"}</td>
              <td>{applicant.email || "N/A"}</td>
              <td>{applicant.mailing_address || "N/A"}</td>
              <td>
                {applicant.status === "uploaded"
                  ? "Paid Challan uploaded"
                  : "Paid Challan not uploaded"}
              </td>
              <td>{applicant.professional_reg_number || "N/A"}</td>
              <td>{applicant.highest_degree_title || "N/A"}</td>
              {/* <td>
                {applicant.cnic_passport_picture_url ? (
                  <a
                    href={applicant.cnic_passport_picture_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {applicant.candidate_picture_url ? (
                  <a
                    href={applicant.candidate_picture_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {applicant.highest_degree_picture_url ? (
                  <a
                    href={applicant.highest_degree_picture_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td> */}
              <td>
                {applicant.voucher ? (
                  <a
                    href={applicant.voucher}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CCNApplicants;
