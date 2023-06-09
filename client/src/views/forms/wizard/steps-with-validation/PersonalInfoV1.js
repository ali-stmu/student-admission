import { Fragment, useState, useEffect, useRef } from "react";
import Select from "react-select";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { selectThemeColors, isObjEmpty } from "@utils";
import Flatpickr from "react-flatpickr";
import {
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  Input,
  CustomInput,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
const PersonalInfo = ({ stepper, type }) => {
  const { register, errors, handleSubmit, trigger } = useForm();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [fathercontact, setFatherContact] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [gender, setGender] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [religion, setReligion] = useState("");
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [foccupation, setFoccupation] = useState("");
  const [phone, setPhone] = useState("");
  const isValidFirstName = firstName.trim().length > 0;
  const isValidLastName = lastName.trim().length > 0;
  const isValidContact = contact > 0 || /^(\+92|92|0)?3\d{9}$/.test(contact);
  const isValidEmail = email > 0 || /\S+@\S+\.\S+/.test(email);
  const isValidCnic = cnic > 0 || /^\d{5}-\d{7}-\d$/.test(cnic);
  const isFormValid =
    isValidFirstName &&
    isValidLastName &&
    isValidContact &&
    isValidEmail &&
    isValidCnic;

  const onSubmit = () => {
    trigger();
    if (isObjEmpty(errors)) {
      stepper.next();
    }
  };
  const genderOption = [
    { value: "", label: "Select" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  const religionOption = [
    { value: "", label: "Select" },
    { value: "islam", label: "Islam" },
    { value: "christianity", label: "Christianity" },
    { value: "hinduism", label: "Hinduism" },
    { value: "sikhism", label: "Sikhism" },
    { value: "other", label: "Other" },
  ];
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleMiddleNameChange = (event) => {
    setMiddleName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };
  const handleFatherContactChange = (event) => {
    setFatherContact(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleFnameChange = (event) => {
    setFname(event.target.value);
  };
  const handleMnameChange = (event) => {
    setMname(event.target.value);
  };
  const handleFoccupationChange = (event) => {
    setFoccupation(event.target.value);
  };
  const handleDobChange = (event) => {
    setDateofbirth(event.target.value);
  };
  const handleCnicChange = (event) => {
    let value = event.target.value;
    // Remove all non-numeric characters from the input
    value = value.replace(/\D/g, "");
    // Add a dash after the 5th character
    if (value.length >= 5) {
      value = `${value.substring(0, 5)}-${value.substring(5)}`;
    }
    // Add a dash after the 13th character
    if (value.length >= 13) {
      value = `${value.substring(0, 13)}-${value.substring(13)}`;
    }
    setCnic(value);
  };
  function handlePhoneChange(event) {
    const value = event.target.value;
    setPhone(value);

    const regex = /^0\d{2,3}-\d{7,8}$/;
    if (regex.test(value) || value === "") {
      setPhone(value);
    }
  }
  const validateFields = () => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!firstName) {
      errors.push("Please enter your first name\n");
    }
    if (!lastName) {
      errors.push("Please enter your last name\n");
    }
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address\n");
    }
    if (cnic.length !== 15 || !/^\d{5}-\d{7}-\d$/.test(cnic)) {
      errors.push("Please enter a valid CNIC number\n");
    }
    if (contact.length !== 11 || !/^\d+$/.test(contact)) {
      errors.push("Please enter a valid contact number\n");
    }
    setErrorMessage(errors);
  };
  const handleChangeGender = (selectedOption) => {
    setGender(selectedOption.value);
  };

  const handleChangeRelegion = (selectedOption) => {
    setReligion(selectedOption.value);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);
      console.log(selectedImage);
    };
  };
  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Personal Info</h5>
        <small>Enter Your Personal Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              First Name
            </Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`middle-name-${type}`}>
              Middle Name
            </Label>
            <Input
              type="text"
              id="middle-name"
              name="middle-name"
              value={middleName}
              onChange={handleMiddleNameChange}
            />
          </FormGroup>

          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`last-name-${type}`}>
              Last Name
            </Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Contact*
            </Label>
            <Input
              type="tel"
              id="contact"
              name="contact"
              value={contact}
              onChange={handleContactChange}
              placeholder="Enter a valid phone number"
              maxLength={13} // Maximum length of a Pakistani phone number is 13
              required
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`email-${type}`}>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </FormGroup>

          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`last-name-${type}`}>
              CNIC*
            </Label>
            <Input
              type="text"
              id="cnic"
              name="cnic"
              value={cnic}
              onChange={handleCnicChange}
              placeholder="12345-1234567-8"
              maxLength={15} // Maximum length of a Pakistani CNIC is 15
              required
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Gender*
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              defaultValue={genderOption[0]}
              options={genderOption}
              value={genderOption.find((option) => option.value === gender)}
              onChange={handleChangeGender}
              isClearable={false}
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`last-name-${type}`}>
              Religion
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              defaultValue={religionOption[0]}
              options={religionOption}
              isClearable={false}
              value={religionOption.find((option) => option.value === religion)}
              onChange={handleChangeRelegion}
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`email-${type}`}>
              Date of Birth
            </Label>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={dateofbirth}
              onChange={handleDobChange}
              required
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Father Name*
            </Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              value={fname}
              onChange={handleFnameChange}
              required
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`middle-name-${type}`}>
              Mother Name*
            </Label>
            <Input
              type="text"
              id="middle-name"
              name="middle-name"
              value={mname}
              onChange={handleMnameChange}
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`last-name-${type}`}>
              Father Occupation*
            </Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              value={foccupation}
              onChange={handleFoccupationChange}
              required
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Father Contact*
            </Label>
            <Input
              type="tel"
              id="contact"
              name="contact"
              value={fathercontact}
              onChange={handleFatherContactChange}
              placeholder="Enter a valid phone number"
              maxLength={13} // Maximum length of a Pakistani phone number is 13
              required
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Landline Number
            </Label>
            <Input
              type="tel"
              id="contact"
              name="contact"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter a valid phone number"
              maxLength={13} // Maximum length of a Pakistani phone number is 13
              required
            />
          </FormGroup>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Upload Picture*
            </Label>
            <CustomInput
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              id="exampleCustomFileBrowser"
              name="customFile"
            />

            {selectedImage && (
              <img src={selectedImage} alt="Selected" width="50" height="50" />
            )}
          </FormGroup>
        </Row>
        {errorMessage && (
          <div style={{ color: "red" }}>
            {errorMessage.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle mr-sm-25 mr-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none"></span>
          </Button.Ripple>
          <Button.Ripple
            type="submit"
            color="primary"
            //disabled={!isFormValid}
            id="btn-next"
            className="btn-next"
            onClick={validateFields}
          >
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ml-sm-25 ml-0"
            ></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  );
};

export default PersonalInfo;
