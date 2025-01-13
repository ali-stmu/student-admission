import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Form,
  Button,
  Table,
  CustomInput,
} from "reactstrap";

const CCN = () => {
  const [formDataTable, setFormDataTable] = useState({});
  const [formData, setFormData] = useState({
    candidateName: "",
    fatherName: "",
    phoneNumber: "",
    email: "",
    mailingAddress: "",
    professionalRegNumber: "",
    highestDegreeTitle: "",
    // cnicPicture: null,
    // candidatePicture: null,
    // highestDegreePicture: null,
  });
  const [challanFile, setChallanFile] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const studentInfoFromStorage = localStorage.getItem("StudentInfo");
        if (studentInfoFromStorage) {
          const studentInfo = JSON.parse(studentInfoFromStorage);
          const response = await fetch(
            `${BASE_URL}ccn-form/${studentInfo.user_id}`
          );
          if (response.ok) {
            const formDataResponse = await response.json();
            setFormDataTable(formDataResponse); // Assuming formDataResponse is an object with the structure matching state
          } else {
            console.error("Failed to fetch ccn form data.");
          }
        }
      } catch (error) {
        console.error("Error fetching ccn form data:", error);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    const studentInfoFromStorage = localStorage.getItem("StudentInfo");
    if (studentInfoFromStorage) {
      const studentInfo = JSON.parse(studentInfoFromStorage);
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: studentInfo.email,
        user_id: studentInfo.user_id,
      }));
    }
  }, []);

  console.log(formDataTable);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleImageChangeCnic = (event) => {
  //   setFormData({ ...formData, cnicPicture: event.target.files[0] });
  // };

  // const handleImageChangeCandidate = (event) => {
  //   setFormData({ ...formData, candidatePicture: event.target.files[0] });
  // };

  // const handleImageChangeDegree = (event) => {
  //   setFormData({ ...formData, highestDegreePicture: event.target.files[0] });
  // };

  const handleChallanUpload = (event) => {
    setChallanFile(event.target.files[0]);
  };

  const handleChallanDownload = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}download-challan-ccn/${formData.user_id}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "challan.pdf"; // Adjust the filename as needed
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to download challan.");
      }
    } catch (error) {
      console.error("Error downloading challan:", error);
      alert("Error downloading challan. Please try again.");
    }
  };

  const handleSaveChallan = async () => {
    if (!challanFile) {
      alert("Please upload a challan file first.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("challan", challanFile);
    formDataToSend.append("user_id", formData.user_id);
    console.log(formDataToSend);
    try {
      const response = await fetch(`${BASE_URL}upload-challan-ccn`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Challan uploaded successfully!");

        setChallanFile(null); // Reset the input field
        window.location.reload();
      } else {
        alert("Failed to upload challan.");
      }
    } catch (error) {
      console.error("Error uploading challan:", error);
      alert("Error uploading challan. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("candidateName", formData.candidateName);
      formDataToSend.append("fatherName", formData.fatherName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("user_id", formData.user_id);
      formDataToSend.append("mailingAddress", formData.mailingAddress);
      formDataToSend.append("highestDegreeTitle", formData.highestDegreeTitle);
      formDataToSend.append(
        "professionalRegNumber",
        formData.professionalRegNumber
      );
      // formDataToSend.append("cnicPicture", formData.cnicPicture);
      // formDataToSend.append("candidatePicture", formData.candidatePicture);
      // formDataToSend.append(
      //   "highestDegreePicture",
      //   formData.highestDegreePicture
      // );

      const response = await fetch(`${BASE_URL}saveccnform`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          candidateName: "",
          fatherName: "",
          phoneNumber: "",
          email: formData.email,
          mailingAddress: "",
          professionalRegNumber: "",
          //cnicPicture: null,
          //candidatePicture: null,
          // highestDegreePicture: null,
        });
        window.location.reload();
      } else {
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate in Clinical Nutrition Admission Form</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Candidate Name</Label>
                <Input
                  type="text"
                  name="candidateName"
                  id="name"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="fatherName">Father Name</Label>
                <Input
                  type="text"
                  name="fatherName"
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter your father's name"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  readOnly
                />
              </FormGroup>
            </Col>
          </Row>
          {/* <Row form>
            <Col md={6}>
              <FormGroup>
                <Label className="form-label" for="cnic">
                  Upload CNIC/Passport Picture<sup>*</sup>
                </Label>
                <CustomInput
                  type="file"
                  onChange={handleImageChangeCnic}
                  accept="image/*"
                  id="cnic"
                  name="cnic"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="form-label" for="candidatePicture">
                  Picture of Candidate<sup>*</sup>
                </Label>
                <CustomInput
                  type="file"
                  onChange={handleImageChangeCandidate}
                  accept="image/*"
                  id="candidatePicture"
                  name="candidatePicture"
                />
              </FormGroup>
            </Col>
          </Row> */}
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="mailingAddress">Mailing Address</Label>
                <Input
                  type="text"
                  name="mailingAddress"
                  id="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your mailing address"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="professionalRegNumber">
                  Professional Registration Number (optional)
                </Label>
                <Input
                  type="text"
                  name="professionalRegNumber"
                  id="professionalRegNumber"
                  value={formData.professionalRegNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your professional registration number (optional)"
                />
              </FormGroup>
            </Col>
            {/* <Col md={6}>
              <FormGroup>
                <Label className="form-label" for="highestDegree">
                  Highest Degree (Qualification)<sup>*</sup>
                </Label>
                <CustomInput
                  type="file"
                  onChange={handleImageChangeDegree}
                  accept="image/*"
                  id="highestDegree"
                  name="highestDegree"
                />
              </FormGroup>
            </Col> */}
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="highestDegreeTitle">Highest Degree Title</Label>
                <Input
                  type="text"
                  name="highestDegreeTitle"
                  id="highestDegreeTitle"
                  value={formData.highestDegreeTitle}
                  onChange={handleInputChange}
                  placeholder="Enter Highest Degree Title"
                />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit">Submit</Button>
        </Form>
        <Table bordered>
          <thead>
            <tr>
              {/* <th>#</th>
              <th>Candidate Name</th>
              <th>Father Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Professional Reg. Number</th> */}
              <th>Download Challan</th>
              <th>Attach Paid Challan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <th scope="row">1</th> */}
              {/* <td>{formDataTable.candidate_name}</td>
              <td>{formDataTable.father_name}</td>
              <td>{formDataTable.phone_number}</td>
              <td>{formDataTable.email}</td>
              <td>{formDataTable.professional_reg_number}</td> */}
              <td>
                <Button onClick={handleChallanDownload}>
                  Download Challan
                </Button>
              </td>
              <td>
                {formDataTable.status === "uploaded" ? (
                  "Already uploaded"
                ) : (
                  <Row>
                    <Col>
                      <CustomInput
                        type="file"
                        onChange={handleChallanUpload}
                        id="challanUpload"
                      />
                    </Col>
                    <Col>
                      <Button onClick={handleSaveChallan}>Save Challan</Button>
                    </Col>
                  </Row>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default CCN;
