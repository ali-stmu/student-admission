import { Fragment, useState, useEffect, useRef } from "react";
import Select from "react-select";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { selectThemeColors, isObjEmpty } from "@utils";
import Flatpickr from "react-flatpickr";
import { BASE_URL } from "../../../../config";
import { BASE_URL_OF_SERVER } from "../../../../configForStudentPictureServer";
import { Link, useHistory } from "react-router-dom";

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
  const formDataAutoFill = new FormData();
  const [email, setEmail] = useState("");
  const [fatheremail, setFatherEmail] = useState("");
  const [user_id, setUserId] = useState("");
  const { register, errors, handleSubmit, trigger } = useForm();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");

  const [fathercontact, setFatherContact] = useState("");

  const [cnic, setCnic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageCnic, setSelectedImageCnic] = useState(null);
  const [gender, setGender] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [image, setImage] = useState("");
  const [imageCnic, setImageCnic] = useState("");
  const [religion, setReligion] = useState("islam");
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [foccupation, setFoccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const today = new Date();
  today.setFullYear(today.getFullYear() - 16);
  const minDate = today.toISOString().split("T")[0];
  const history = useHistory();
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    // Parse the JSON data
    const studentInfo = JSON.parse(rolesFromStorage);
    const Tempemail = studentInfo.email;
    const TempUserid = studentInfo.user_id;

    formDataAutoFill.append("user_id", TempUserid);
    formDataAutoFill.append("userEffectChecked", 1);
    fetch(`${BASE_URL}storeStudentData`, {
      method: "POST",
      body: formDataAutoFill,
    })
      .then((response) => response.json())
      .then((AutoFillDataRecived) => {
        // Handle the response from the backend
        //console.log(AutoFillDataRecived.original.cnic_image);
        //console.log(AutoFillDataRecived.original.first_name)
        if (AutoFillDataRecived.original.first_name) {
          //console.log('hello from if')
          setFirstName(AutoFillDataRecived.original.first_name);
          setMiddleName(AutoFillDataRecived.original.middle_name);
          setLastName(AutoFillDataRecived.original.last_name);
          setContact(AutoFillDataRecived.original.phone_number);
          setCnic(AutoFillDataRecived.original.cnic);
          setGender(AutoFillDataRecived.original.gender);
          setReligion(AutoFillDataRecived.original.religion);
          setDateofbirth(AutoFillDataRecived.original.date_of_birth);
          setFname(AutoFillDataRecived.original.father_name);
          setMname(AutoFillDataRecived.original.mother_name);
          setFoccupation(AutoFillDataRecived.original.father_occupation);
          setFatherContact(AutoFillDataRecived.original.father_contact);
          setPhone(AutoFillDataRecived.original.land_line);
          const genratedFullUrlForStudentPicsture =
            BASE_URL_OF_SERVER + AutoFillDataRecived.original.image;
          setSelectedImage(genratedFullUrlForStudentPicsture);
          const genratedFullUrlForStudentCnic =
            BASE_URL_OF_SERVER + AutoFillDataRecived.original.cnic_image;
          setSelectedImageCnic(genratedFullUrlForStudentCnic);
          setFatherEmail(AutoFillDataRecived.original.father_email);

          //const cnic = AutoFillDataRecived.cnic; // Replace 'cnic' with the actual property name in the response
          //console.log(cnic);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
    console.log(Tempemail);
    setEmail(Tempemail);
    setUserId(TempUserid);
    if (!rolesFromStorage) {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    // Define an async function to fetch data from the API
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}countries`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCountries(data.countries); // Set the retrieved data in your state variable
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call the async function to fetch data when the component mounts
  }, []);
  const isValidFirstName = firstName.trim().length > 0;
  const isValidLastName = lastName.trim().length > 0;
  //const isValidContact = contact > 0 || /^(\+92|92|0)?3\d{9}$/.test(contact);
  const isValidEmail = email > 0 || /\S+@\S+\.\S+/.test(email);
  const isValidCnic = cnic > 0 || /^\d{5}-\d{7}-\d$/.test(cnic);
  const isFormValid =
    isValidFirstName &&
    isValidLastName &&
    //isValidContact &&
    isValidEmail &&
    isValidCnic;

  const onSubmit = () => {
    console.log("ClickedOnSubmite");
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("middle_name", middleName);
    formData.append("last_name", lastName);
    formData.append("phone_number", contact);
    formData.append("father_contact", fathercontact);
    formData.append("email", email);
    formData.append("cnic", cnic);
    formData.append("gender", gender);
    formData.append("date_of_birth", dateofbirth);
    formData.append("religion", religion);
    formData.append("father_name", fname);
    formData.append("father_email", fatheremail);
    formData.append("mother_name", mname);
    formData.append("father_occupation", foccupation);
    formData.append("land_line", phone);
    formData.append("temp_image", image);
    formData.append("temp_image_cnic", imageCnic);
    formData.append("user_id", user_id);

    fetch(`${BASE_URL}storeStudentData`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        //console.error(error);
      });
    trigger();
    if (isObjEmpty(errors)) {
      stepper.next();
    }
  };
  console.log(selectedImageCnic);
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
    setFatherEmail(event.target.value);
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
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSizeInBytes) {
      // Display an error message or take appropriate action
      alert(
        "Error: The uploaded image exceeds the maximum allowed size of 2MB."
      );
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
        setImage(file);
      };
    }
    console.log(selectedImage);
  };
  const handleImageChangeCnic = (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSizeInBytes) {
      // Display an error message or take appropriate action
      alert(
        "Error: The uploaded image exceeds the maximum allowed size of 2MB."
      );
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImageCnic(reader.result);
        setImageCnic(file);
      };
    }
    console.log(selectedImageCnic);
  };
  const countryOptions = countries.map((country) => ({
    value: country.id, // Use a unique identifier for each country
    label: country.phonecode, // Display the country name in the dropdown
  }));

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
              First Name<sup>*</sup>
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
              Last Name<sup>*</sup>
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
          <FormGroup tag={Col} md="1">
            <Label className="form-label" for={`country-${type}`}>
              Country Code<sup>*</sup>
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={countryOptions} // Pass the country options to the Select component
              value={countryOptions.find(
                (option) => option.value === selectedCountry
              )} // Set the selected country
              onChange={(selectedOption) =>
                setSelectedCountry(selectedOption.value)
              } // Update the selected country
              isClearable={false}
            />
          </FormGroup>
          <FormGroup tag={Col} md="3">
            <Label className="form-label" for={`first-name-${type}`}>
              Contact<sup>*</sup>
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
              Email<sup>*</sup>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              readOnly
            />
          </FormGroup>

          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`last-name-${type}`}>
              CNIC<sup>*</sup>
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
              Gender<sup>*</sup>
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
              Religion<sup>*</sup>
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
              Date of Birth<sup>*</sup>
            </Label>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={dateofbirth}
              onChange={handleDobChange}
              max={minDate} // Set the maximum allowed date
              required
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Father Name<sup>*</sup>
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
              Mother Name<sup>*</sup>
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
              Father Occupation<sup>*</sup>
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
              Father Contact<sup>*</sup>
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
              Father Email<sup>*</sup>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={fatheremail}
              onChange={handleEmailChange}
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
        </Row>
        <h3>Uploads</h3>
        <Row>
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Upload Passport Size Picture with white background only
              <sup>*</sup>
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
          <FormGroup tag={Col} md="4">
            <Label className="form-label" for={`first-name-${type}`}>
              Upload CNIC/Passport Picture<sup>*</sup>
            </Label>
            <CustomInput
              type="file"
              onChange={handleImageChangeCnic}
              accept="image/*"
              id="exampleCustomFileBrowserr"
              name="customFile"
            />

            {selectedImageCnic && (
              <img
                src={selectedImageCnic}
                alt="Selected"
                width="50"
                height="50"
              />
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
            <span className="align-middle d-sm-inline-block d-none">
              Save & Next
            </span>
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
