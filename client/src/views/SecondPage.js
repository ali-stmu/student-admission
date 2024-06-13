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
  CustomInput,
} from "reactstrap";

const SecondPage = () => {
  const [formData, setFormData] = useState({
    candidateName: "",
    fatherName: "",
    phoneNumber: "",
    email: "",
    mailingAddress: "",
    professionalRegNumber: "",
    cnicPicture: null,
    candidatePicture: null,
    highestDegreePicture: null,
  });

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChangeCnic = (event) => {
    setFormData({ ...formData, cnicPicture: event.target.files[0] });
  };

  const handleImageChangeCandidate = (event) => {
    setFormData({ ...formData, candidatePicture: event.target.files[0] });
  };

  const handleImageChangeDegree = (event) => {
    setFormData({ ...formData, highestDegreePicture: event.target.files[0] });
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
      formDataToSend.append(
        "professionalRegNumber",
        formData.professionalRegNumber
      );
      formDataToSend.append("cnicPicture", formData.cnicPicture);
      formDataToSend.append("candidatePicture", formData.candidatePicture);
      formDataToSend.append(
        "highestDegreePicture",
        formData.highestDegreePicture
      );

      const response = await fetch(`${BASE_URL}savechpeform`, {
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
          cnicPicture: null,
          candidatePicture: null,
          highestDegreePicture: null,
        });
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
        <CardTitle>CHPE Admission Form</CardTitle>
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
          <Row form>
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
          </Row>
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
            </Col>
          </Row>
          <Row form>
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
          </Row>
          <Button type="submit">Submit</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SecondPage;
